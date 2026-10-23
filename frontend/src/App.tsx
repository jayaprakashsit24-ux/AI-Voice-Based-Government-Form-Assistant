import React, { useEffect, useState, useRef, useCallback } from 'react';
import type {
  FormTemplate,
  VoiceAssistantState,
  ReviewResponse,
  SubmissionResponse,
  SpeechSettings,
} from './types/form';
import { apiService } from './services/apiService';
import { speechService } from './services/speechService';
import { earconService } from './services/audioEffects';
import { Header } from './components/Header';
import { FormSelector } from './components/FormSelector';
import { VoiceFormFiller } from './components/VoiceFormFiller';
import { FormReview } from './components/FormReview';
import { SubmissionReceipt } from './components/SubmissionReceipt';
import { VoiceHelpModal } from './components/VoiceHelpModal';
import { AudioSettingsModal } from './components/AudioSettingsModal';
import { Mic, MicOff, RotateCcw, VolumeX, Keyboard } from 'lucide-react';

export const App: React.FC = () => {
  // Screen state: 'select_form' | 'filling' | 'review' | 'completed'
  const [screen, setScreen] = useState<'select_form' | 'filling' | 'review' | 'completed'>('select_form');
  const [forms, setForms] = useState<FormTemplate[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormTemplate | null>(null);
  const [currentFieldIndex, setCurrentFieldIndex] = useState<number>(0);
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Assistant State Machine
  const [assistantState, setAssistantState] = useState<VoiceAssistantState>('idle');
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    value: string;
    displayValue: string;
    spokenText: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [spokenAnnouncement, setSpokenAnnouncement] = useState<string>('');

  // Results
  const [reviewData, setReviewData] = useState<ReviewResponse | null>(null);
  const [submissionReceipt, setSubmissionReceipt] = useState<SubmissionResponse | null>(null);

  // Accessibility & Settings
  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('voicegov_contrast') === 'true';
  });
  const [isLargeText, setIsLargeText] = useState<boolean>(() => {
    return localStorage.getItem('voicegov_largetext') === 'true';
  });
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>(() => {
    const saved = localStorage.getItem('voicegov_speech');
    return saved
      ? JSON.parse(saved)
      : { rate: 1.0, pitch: 1.0, volume: 1.0, language: 'en' };
  });

  // Modals
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Ref to track state in async speech callbacks without closure traps
  const stateRef = useRef({
    screen,
    selectedForm,
    currentFieldIndex,
    formData,
    assistantState,
    pendingConfirmation,
    isHelpOpen,
    isSettingsOpen,
  });

  useEffect(() => {
    stateRef.current = {
      screen,
      selectedForm,
      currentFieldIndex,
      formData,
      assistantState,
      pendingConfirmation,
      isHelpOpen,
      isSettingsOpen,
    };
  }, [
    screen,
    selectedForm,
    currentFieldIndex,
    formData,
    assistantState,
    pendingConfirmation,
    isHelpOpen,
    isSettingsOpen,
  ]);

  // Load forms on mount
  useEffect(() => {
    const fetchForms = async () => {
      const data = await apiService.getForms();
      if (data && data.length > 0) {
        setForms(data);
      }
    };
    fetchForms();
  }, []);

  // Update root element styling for high-contrast and large-text
  useEffect(() => {
    const root = document.documentElement;
    if (isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('voicegov_contrast', String(isHighContrast));
  }, [isHighContrast]);

  useEffect(() => {
    const root = document.documentElement;
    if (isLargeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    localStorage.setItem('voicegov_largetext', String(isLargeText));
  }, [isLargeText]);

  // Helper to announce for screen-readers and update state
  const announceAndSpeak = useCallback((text: string, onEnd?: () => void) => {
    setSpokenAnnouncement(text);
    setAssistantState('speaking');
    speechService.speak(text, () => {
      onEnd?.();
    });
  }, []);

  // Ask current field question
  const askCurrentField = useCallback((fieldIdx: number, formToUse?: FormTemplate) => {
    const activeForm = formToUse || stateRef.current.selectedForm;
    if (!activeForm || !activeForm.fields[fieldIdx]) return;

    const field = activeForm.fields[fieldIdx];
    setPendingConfirmation(null);
    setErrorMessage(null);
    setTranscript('');
    setInterimTranscript('');

    const questionSpeech = `${field.spoken_prompt}`;
    announceAndSpeak(questionSpeech, () => {
      // Auto-start listening after question is read
      setAssistantState('listening');
      speechService.startListening();
    });
  }, [announceAndSpeak]);

  // Handle Form Selection
  const handleSelectForm = useCallback((formId: string) => {
    const target = forms.find((f) => f.id === formId);
    if (!target) return;

    setSelectedForm(target);
    setCurrentFieldIndex(0);
    setFormData({});
    setScreen('filling');
    setPendingConfirmation(null);
    setErrorMessage(null);

    const welcomeMsg = `You have selected ${target.title}. Let's begin. Question 1. ${target.fields[0].spoken_prompt}`;
    announceAndSpeak(welcomeMsg, () => {
      setAssistantState('listening');
      speechService.startListening();
    });
  }, [forms, announceAndSpeak]);

  // Handle Review
  const handleGoToReview = useCallback(async (dataToUse?: Record<string, any>) => {
    const current = stateRef.current;
    if (!current.selectedForm) return;

    const data = dataToUse || current.formData;
    setScreen('review');
    setAssistantState('review');
    setPendingConfirmation(null);
    setErrorMessage(null);

    const reviewRes = await apiService.generateReview({
      form_id: current.selectedForm.id,
      data,
      language: speechSettings.language,
    });
    setReviewData(reviewRes);

    announceAndSpeak(reviewRes.spoken_summary, () => {
      setAssistantState('listening');
      speechService.startListening();
    });
  }, [speechSettings.language, announceAndSpeak]);

  // Read Summary Aloud on Review
  const handleReadSummary = useCallback(() => {
    if (reviewData) {
      announceAndSpeak(reviewData.spoken_summary, () => {
        setAssistantState('listening');
        speechService.startListening();
      });
    } else {
      handleGoToReview();
    }
  }, [reviewData, announceAndSpeak, handleGoToReview]);

  // Submit Application
  const handleSubmitApplication = useCallback(async () => {
    const current = stateRef.current;
    if (!current.selectedForm) return;

    setAssistantState('processing');
    const submission = await apiService.submitApplication({
      form_id: current.selectedForm.id,
      data: current.formData,
      applicant_consent: true,
    });

    setSubmissionReceipt(submission);
    setScreen('completed');
    setAssistantState('completed');
    earconService.play('success');

    announceAndSpeak(submission.spoken_receipt, () => {
      setAssistantState('idle');
    });
  }, [announceAndSpeak]);

  // Go Home / Reset
  const handleGoHome = useCallback(() => {
    speechService.stopSpeaking();
    speechService.stopListening();
    setSelectedForm(null);
    setFormData({});
    setCurrentFieldIndex(0);
    setPendingConfirmation(null);
    setErrorMessage(null);
    setReviewData(null);
    setSubmissionReceipt(null);
    setScreen('select_form');
    setAssistantState('idle');
    announceAndSpeak('Application reset. Returned to government forms list.');
  }, [announceAndSpeak]);

  // Confirmation Confirm Yes
  const handleConfirmYes = useCallback(() => {
    const current = stateRef.current;
    if (!current.pendingConfirmation || !current.selectedForm) return;

    const activeField = current.selectedForm.fields[current.currentFieldIndex];
    const confirmedVal = current.pendingConfirmation.value;

    const updatedData = {
      ...current.formData,
      [activeField.id]: confirmedVal,
    };
    setFormData(updatedData);
    setPendingConfirmation(null);
    setErrorMessage(null);
    earconService.play('success');

    const nextIdx = current.currentFieldIndex + 1;
    if (nextIdx < current.selectedForm.fields.length) {
      setCurrentFieldIndex(nextIdx);
      const nextField = current.selectedForm.fields[nextIdx];
      const nextPrompt = `Your ${activeField.label} has been saved. Next question: ${nextField.spoken_prompt}`;
      announceAndSpeak(nextPrompt, () => {
        setAssistantState('listening');
        speechService.startListening();
      });
    } else {
      // Completed all fields -> Jump to Review
      const finishPrompt = `Your ${activeField.label} has been saved. All questions have been answered. Moving to application review.`;
      announceAndSpeak(finishPrompt, () => {
        handleGoToReview(updatedData);
      });
    }
  }, [announceAndSpeak, handleGoToReview]);

  // Confirmation Confirm No
  const handleConfirmNo = useCallback(() => {
    const current = stateRef.current;
    if (!current.selectedForm) return;
    const activeField = current.selectedForm.fields[current.currentFieldIndex];

    setPendingConfirmation(null);
    setErrorMessage(null);
    setTranscript('');
    setInterimTranscript('');

    const retryPrompt = `Understood. Please say your ${activeField.label} again.`;
    announceAndSpeak(retryPrompt, () => {
      setAssistantState('listening');
      speechService.startListening();
    });
  }, [announceAndSpeak]);

  // Process incoming recognized speech
  const handleTranscriptFinal = useCallback(async (text: string) => {
    const current = stateRef.current;
    setTranscript(text);
    setInterimTranscript('');
    setAssistantState('processing');

    const activeField =
      current.screen === 'filling' && current.selectedForm
        ? current.selectedForm.fields[current.currentFieldIndex]
        : undefined;

    const parseMode =
      current.pendingConfirmation !== null
        ? 'confirming'
        : current.screen === 'review'
        ? 'review'
        : current.screen === 'filling'
        ? 'filling'
        : 'navigation';

    const response = await apiService.parseVoiceInput({
      form_id: current.selectedForm?.id,
      field_id: activeField?.id,
      transcript: text,
      current_value: current.pendingConfirmation?.value,
      language: speechSettings.language,
      mode: parseMode,
    });

    // 1. Navigation / Global Voice Commands
    if (response.intent === 'repeat') {
      if (current.screen === 'filling') {
        askCurrentField(current.currentFieldIndex);
      } else if (current.screen === 'review') {
        handleReadSummary();
      } else {
        announceAndSpeak('Please say: start a new application, or select a form.', () => {
          setAssistantState('listening');
          speechService.startListening();
        });
      }
      return;
    }

    if (response.intent === 'go_back') {
      if (current.screen === 'filling' && current.currentFieldIndex > 0) {
        const prevIdx = current.currentFieldIndex - 1;
        setCurrentFieldIndex(prevIdx);
        askCurrentField(prevIdx);
      } else if (current.screen === 'review') {
        setScreen('filling');
        askCurrentField(current.currentFieldIndex);
      } else {
        announceAndSpeak('Already at the first question.', () => {
          setAssistantState('listening');
          speechService.startListening();
        });
      }
      return;
    }

    if (response.intent === 'skip') {
      if (current.screen === 'filling' && current.selectedForm) {
        earconService.play('click');
        const nextIdx = current.currentFieldIndex + 1;
        if (nextIdx < current.selectedForm.fields.length) {
          setCurrentFieldIndex(nextIdx);
          askCurrentField(nextIdx);
        } else {
          handleGoToReview();
        }
      }
      return;
    }

    if (response.intent === 'stop') {
      speechService.stopSpeaking();
      speechService.stopListening();
      setAssistantState('idle');
      return;
    }

    if (response.intent === 'review') {
      handleGoToReview();
      return;
    }

    if (response.intent === 'submit') {
      if (current.screen === 'review') {
        handleSubmitApplication();
      } else {
        handleGoToReview();
      }
      return;
    }

    if (response.intent === 'help') {
      setIsHelpOpen(true);
      announceAndSpeak('Opening voice commands help. Press Escape to close.', () => {
        setAssistantState('idle');
      });
      return;
    }

    if (response.intent === 'cancel') {
      handleGoHome();
      return;
    }

    if (response.intent === 'select_form' && response.target_form_id) {
      handleSelectForm(response.target_form_id);
      return;
    }

    // 2. Confirmation State (Saying Yes / No)
    if (parseMode === 'confirming') {
      if (response.intent === 'confirm_yes') {
        handleConfirmYes();
      } else if (response.intent === 'confirm_no') {
        handleConfirmNo();
      } else {
        announceAndSpeak('Please say yes to confirm or no to try again.', () => {
          setAssistantState('confirming');
          speechService.startListening();
        });
      }
      return;
    }

    // 3. Form Filling State (Answering a question)
    if (current.screen === 'filling' && activeField) {
      if (response.is_valid && response.extracted_value !== undefined) {
        setErrorMessage(null);
        setPendingConfirmation({
          value: response.extracted_value,
          displayValue: response.display_value || response.extracted_value,
          spokenText:
            response.spoken_confirmation ||
            `I heard ${response.display_value || response.extracted_value}. Is that correct? Say yes or no.`,
        });

        earconService.play('confirm_prompt');
        setAssistantState('confirming');

        announceAndSpeak(
          response.spoken_confirmation ||
            `I heard ${response.display_value || response.extracted_value}. Is that correct? Say yes or no.`,
          () => {
            // Listen for confirmation (yes/no)
            setAssistantState('confirming');
            speechService.startListening();
          }
        );
      } else {
        // Validation Error
        earconService.play('error');
        setAssistantState('error');
        const errText =
          response.spoken_feedback ||
          response.validation_error ||
          activeField.error_prompt ||
          'That answer was not recognized. Please say your answer again.';
        setErrorMessage(errText);

        announceAndSpeak(errText, () => {
          setAssistantState('listening');
          speechService.startListening();
        });
      }
      return;
    }

    // If on Form Selection screen and spoke something general
    if (current.screen === 'select_form') {
      announceAndSpeak('Please choose an application by speaking its name, such as: start scholarship application.', () => {
        setAssistantState('listening');
        speechService.startListening();
      });
    }
  }, [
    speechSettings.language,
    askCurrentField,
    announceAndSpeak,
    handleSelectForm,
    handleConfirmYes,
    handleConfirmNo,
    handleGoToReview,
    handleReadSummary,
    handleSubmitApplication,
    handleGoHome,
  ]);

  // Jump to edit specific field
  const handleJumpToField = useCallback((index: number) => {
    setCurrentFieldIndex(index);
    setScreen('filling');
    askCurrentField(index);
  }, [askCurrentField]);

  // Manual input submission
  const handleManualSubmit = useCallback((val: string) => {
    handleTranscriptFinal(val);
  }, [handleTranscriptFinal]);

  // Wire Speech Service Event Listeners
  useEffect(() => {
    speechService.onTranscriptInterim = (text: string) => {
      setInterimTranscript(text);
    };

    speechService.onTranscriptFinal = (text: string) => {
      handleTranscriptFinal(text);
    };

    speechService.onListenStart = () => {
      setAssistantState('listening');
    };

    speechService.onListenEnd = () => {
      if (stateRef.current.assistantState === 'listening') {
        if (stateRef.current.pendingConfirmation) {
          setAssistantState('confirming');
        } else if (stateRef.current.screen === 'review') {
          setAssistantState('review');
        } else {
          setAssistantState('idle');
        }
      }
    };

    speechService.onError = (errorType) => {
      if (errorType === 'not-allowed') {
        setErrorMessage('Microphone access was denied. Please allow microphone permissions in your browser.');
        setAssistantState('error');
        earconService.play('error');
      } else if (errorType === 'no-speech') {
        if (stateRef.current.assistantState === 'listening') {
          setAssistantState('idle');
        }
      }
    };
  }, [handleTranscriptFinal]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      // Space: Toggle Mic / Push-to-Talk
      if (e.code === 'Space') {
        e.preventDefault();
        if (speechService.getIsListening()) {
          speechService.stopListening();
          setAssistantState('idle');
        } else {
          speechService.stopSpeaking();
          setAssistantState('listening');
          speechService.startListening();
        }
      }

      // 'R' / 'r': Repeat prompt
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        if (stateRef.current.screen === 'filling') {
          askCurrentField(stateRef.current.currentFieldIndex);
        } else if (stateRef.current.screen === 'review') {
          handleReadSummary();
        }
      }

      // 'M' / 'm': Stop Speaking / Mute
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        speechService.stopSpeaking();
        speechService.stopListening();
        setAssistantState('idle');
      }

      // 'H' / 'h': Voice Help
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setIsHelpOpen((prev) => !prev);
      }

      // Alt + C: Toggle High Contrast
      if (e.altKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        setIsHighContrast((prev) => !prev);
      }

      // Alt + L: Toggle Large Text
      if (e.altKey && (e.key === 'l' || e.key === 'L')) {
        e.preventDefault();
        setIsLargeText((prev) => !prev);
      }

      // Alt + S: Open Settings
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        setIsSettingsOpen(true);
      }

      // Escape: Close modals
      if (e.key === 'Escape') {
        setIsHelpOpen(false);
        setIsSettingsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [askCurrentField, handleReadSummary]);

  // Toggle Language between English and Tamil preview
  const handleToggleLanguage = useCallback(() => {
    const newLang = speechSettings.language === 'en' ? 'ta' : 'en';
    const updated = { ...speechSettings, language: newLang as 'en' | 'ta' };
    setSpeechSettings(updated);
    speechService.updateSettings(updated);
    localStorage.setItem('voicegov_speech', JSON.stringify(updated));
    announceAndSpeak(
      newLang === 'ta'
        ? 'தமிழ் குரல் முறை செயல்படுத்தப்பட்டுள்ளது.'
        : 'English voice mode activated.'
    );
  }, [speechSettings, announceAndSpeak]);

  // Save Audio Settings
  const handleSaveSpeechSettings = useCallback((newSettings: SpeechSettings) => {
    setSpeechSettings(newSettings);
    speechService.updateSettings(newSettings);
    localStorage.setItem('voicegov_speech', JSON.stringify(newSettings));
  }, []);

  return (
    <div className="min-h-screen flex flex-col transition-colors pb-24">
      {/* Offscreen Accessible Live Region for Screen Readers */}
      <div
        role="status"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {spokenAnnouncement}
      </div>

      {/* Main Header */}
      <Header
        isHighContrast={isHighContrast}
        isLargeText={isLargeText}
        language={speechSettings.language}
        onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
        onToggleLargeText={() => setIsLargeText(!isLargeText)}
        onToggleLanguage={handleToggleLanguage}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onGoHome={handleGoHome}
        currentFormTitle={selectedForm?.title}
      />

      {/* Dynamic Screen View */}
      <main id="main-content" className="flex-1">
        {screen === 'select_form' && (
          <FormSelector
            forms={forms}
            onSelectForm={handleSelectForm}
            isHighContrast={isHighContrast}
          />
        )}

        {screen === 'filling' && selectedForm && (
          <VoiceFormFiller
            form={selectedForm}
            currentFieldIndex={currentFieldIndex}
            formData={formData}
            state={assistantState}
            transcript={transcript}
            interimTranscript={interimTranscript}
            pendingConfirmationText={pendingConfirmation?.spokenText}
            errorMessage={errorMessage}
            isHighContrast={isHighContrast}
            onConfirmYes={handleConfirmYes}
            onConfirmNo={handleConfirmNo}
            onRepeatQuestion={() => askCurrentField(currentFieldIndex)}
            onStopSpeaking={() => {
              speechService.stopSpeaking();
              setAssistantState('idle');
            }}
            onGoBack={() => {
              if (currentFieldIndex > 0) {
                const prev = currentFieldIndex - 1;
                setCurrentFieldIndex(prev);
                askCurrentField(prev);
              }
            }}
            onSkipField={() => {
              const next = currentFieldIndex + 1;
              if (next < selectedForm.fields.length) {
                setCurrentFieldIndex(next);
                askCurrentField(next);
              } else {
                handleGoToReview();
              }
            }}
            onGoToReview={() => handleGoToReview()}
            onJumpToField={handleJumpToField}
            onManualSubmit={handleManualSubmit}
          />
        )}

        {screen === 'review' && selectedForm && (
          <FormReview
            form={selectedForm}
            formData={formData}
            reviewData={reviewData}
            state={assistantState}
            isHighContrast={isHighContrast}
            onReadSummary={handleReadSummary}
            onStopSpeaking={() => {
              speechService.stopSpeaking();
              setAssistantState('idle');
            }}
            onEditField={handleJumpToField}
            onBackToForm={() => setScreen('filling')}
            onRestartForm={() => {
              setFormData({});
              setCurrentFieldIndex(0);
              setScreen('filling');
              askCurrentField(0);
            }}
            onSubmitApplication={handleSubmitApplication}
          />
        )}

        {screen === 'completed' && submissionReceipt && (
          <SubmissionReceipt
            receipt={submissionReceipt}
            isHighContrast={isHighContrast}
            onReadReceipt={() => announceAndSpeak(submissionReceipt.spoken_receipt)}
            onNewApplication={handleGoHome}
          />
        )}
      </main>

      {/* Persistent Bottom Accessible Action Bar */}
      <nav
        aria-label="Accessible Voice Quick Bar"
        className={`fixed bottom-0 left-0 right-0 z-40 border-t py-3 px-4 transition-colors ${
          isHighContrast
            ? 'bg-black border-yellow-400 text-yellow-300'
            : 'bg-slate-900/95 backdrop-blur border-slate-800 text-slate-100 shadow-2xl'
        }`}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          {/* Quick Repeat Button */}
          <button
            onClick={() => {
              if (screen === 'filling') askCurrentField(currentFieldIndex);
              else if (screen === 'review') handleReadSummary();
            }}
            aria-label="Repeat current prompt (Key: R)"
            className={`py-2 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              isHighContrast
                ? 'border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Repeat</span>
            <kbd className="hidden md:inline px-1 py-0.5 rounded bg-slate-900 text-[10px] font-mono">R</kbd>
          </button>

          {/* Central Big Accessible Push-to-Talk Mic Button */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                if (speechService.getIsListening()) {
                  speechService.stopListening();
                  setAssistantState('idle');
                } else {
                  speechService.stopSpeaking();
                  setAssistantState('listening');
                  speechService.startListening();
                }
              }}
              aria-label={
                assistantState === 'listening'
                  ? 'Microphone is listening. Click to stop.'
                  : 'Click or press Spacebar to speak'
              }
              className={`relative p-4 sm:p-5 rounded-full font-bold transition-all shadow-2xl ${
                assistantState === 'listening'
                  ? isHighContrast
                    ? 'bg-yellow-400 text-black ring-8 ring-yellow-400/30 animate-pulse'
                    : 'bg-emerald-500 text-slate-950 ring-8 ring-emerald-500/40 animate-pulse scale-105'
                  : isHighContrast
                  ? 'bg-zinc-900 border-4 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-sky-500/30'
              }`}
            >
              {assistantState === 'listening' ? (
                <Mic className="w-7 h-7 sm:w-8 sm:h-8" />
              ) : (
                <MicOff className="w-7 h-7 sm:w-8 sm:h-8 opacity-90" />
              )}
            </button>
            <span className="text-[11px] font-semibold mt-1 text-slate-400 flex items-center gap-1">
              <Keyboard className="w-3 h-3" />
              {assistantState === 'listening' ? 'Listening (Space to stop)' : 'Press Space to speak'}
            </span>
          </div>

          {/* Stop / Silence Button */}
          <button
            onClick={() => {
              speechService.stopSpeaking();
              speechService.stopListening();
              setAssistantState('idle');
            }}
            aria-label="Silence assistant speech (Key: M)"
            className={`py-2 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              isHighContrast
                ? 'border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <VolumeX className="w-4 h-4" />
            <span className="hidden sm:inline">Stop</span>
            <kbd className="hidden md:inline px-1 py-0.5 rounded bg-slate-900 text-[10px] font-mono">M</kbd>
          </button>
        </div>
      </nav>

      {/* Accessible Modals */}
      <VoiceHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        isHighContrast={isHighContrast}
      />

      <AudioSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={speechSettings}
        onSaveSettings={handleSaveSpeechSettings}
        isHighContrast={isHighContrast}
      />
    </div>
  );
};

export default App;
