import React from 'react';
import type { VoiceAssistantState, FormField } from '../types/form';
import { RotateCcw, VolumeX, Check, X, AlertTriangle, HelpCircle } from 'lucide-react';

interface VoiceStatusCardProps {
  state: VoiceAssistantState;
  currentField?: FormField | null;
  currentQuestionText: string;
  transcript: string;
  interimTranscript: string;
  pendingConfirmationText?: string | null;
  errorMessage?: string | null;
  isHighContrast?: boolean;
  onConfirmYes: () => void;
  onConfirmNo: () => void;
  onRepeatQuestion: () => void;
  onStopSpeaking: () => void;
  onExplainHelp?: () => void;
}

export const VoiceStatusCard: React.FC<VoiceStatusCardProps> = ({
  state,
  currentField,
  currentQuestionText,
  transcript,
  interimTranscript,
  pendingConfirmationText,
  errorMessage,
  isHighContrast,
  onConfirmYes,
  onConfirmNo,
  onRepeatQuestion,
  onStopSpeaking,
  onExplainHelp,
}) => {
  return (
    <section
      aria-label="Current Voice Interaction Console"
      className={`rounded-3xl p-6 sm:p-8 transition-all duration-300 ${
        isHighContrast
          ? 'bg-black border-4 border-yellow-400 text-yellow-300 shadow-2xl'
          : 'bg-slate-900 border border-slate-800 shadow-2xl text-slate-100'
      }`}
    >
      {/* Question Header & Spoken Prompt */}
      <div className="mb-6">
        {currentField && (
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span
              className={`text-xs sm:text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                isHighContrast
                  ? 'bg-yellow-400 text-black'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
              }`}
            >
              Field: {currentField.label}
              {currentField.required && ' *Required'}
            </span>

            {currentField.example_spoken && (
              <span
                className={`text-xs ${
                  isHighContrast ? 'text-yellow-200' : 'text-slate-400'
                }`}
              >
                Spoken example: "{currentField.example_spoken}"
              </span>
            )}
          </div>
        )}

        <h2
          aria-live="assertive"
          className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-snug ${
            isHighContrast ? 'text-white' : 'text-slate-50'
          }`}
        >
          {currentQuestionText || 'Voice Assistant Ready'}
        </h2>

        {currentField?.help_text && (
          <p
            className={`mt-3 text-sm sm:text-base leading-relaxed ${
              isHighContrast ? 'text-yellow-200 font-medium' : 'text-slate-300'
            }`}
          >
            {currentField.help_text}
          </p>
        )}
      </div>

      {/* Confirmation Box (Active when awaiting yes/no confirmation) */}
      {state === 'confirming' && pendingConfirmationText && (
        <div
          role="alert"
          aria-live="assertive"
          className={`my-6 p-5 sm:p-6 rounded-2xl border-2 transition-all animate-in fade-in zoom-in-95 duration-200 ${
            isHighContrast
              ? 'bg-zinc-950 border-yellow-300 text-yellow-300'
              : 'bg-amber-950/40 border-amber-500/60 text-amber-200'
          }`}
        >
          <div className="flex items-start gap-3 mb-4">
            <HelpCircle className="w-7 h-7 flex-shrink-0 text-amber-400 mt-0.5" />
            <div>
              <p className="text-lg sm:text-xl font-bold leading-snug">
                {pendingConfirmationText}
              </p>
              <p className="text-sm mt-1 text-slate-300">
                You can say "Yes" or "No", or use the buttons below.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={onConfirmYes}
              aria-label="Confirm yes, save this answer"
              className={`py-3.5 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                isHighContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-700/30'
              }`}
            >
              <Check className="w-5 h-5" />
              <span>Yes, Correct (Confirm)</span>
            </button>

            <button
              onClick={onConfirmNo}
              aria-label="No, that is not correct. Try again"
              className={`py-3.5 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                isHighContrast
                  ? 'border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <X className="w-5 h-5" />
              <span>No, Try Again</span>
            </button>
          </div>
        </div>
      )}

      {/* Validation Error Banner */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className={`my-4 p-4 rounded-2xl flex items-start gap-3 border ${
            isHighContrast
              ? 'bg-black border-2 border-rose-400 text-rose-300'
              : 'bg-rose-950/50 border-rose-600/60 text-rose-200'
          }`}
        >
          <AlertTriangle className="w-6 h-6 flex-shrink-0 text-rose-400 mt-0.5" />
          <div className="text-sm sm:text-base font-semibold">
            {errorMessage}
          </div>
        </div>
      )}

      {/* Live Transcript Area */}
      <div
        className={`p-4 sm:p-5 rounded-2xl border transition-colors ${
          isHighContrast
            ? 'bg-zinc-950 border-yellow-400/50'
            : 'bg-slate-800/60 border-slate-700/80'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-2 text-slate-400">
          <span>Recognized Speech Transcript</span>
          {state === 'listening' && (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Listening now...
            </span>
          )}
        </div>

        <div className="min-h-[48px] flex items-center">
          {interimTranscript ? (
            <p className="text-base sm:text-lg italic text-sky-300 animate-pulse">
              "{interimTranscript}..."
            </p>
          ) : transcript ? (
            <p
              className={`text-base sm:text-lg font-medium ${
                isHighContrast ? 'text-white' : 'text-slate-100'
              }`}
            >
              "{transcript}"
            </p>
          ) : (
            <p className="text-sm sm:text-base text-slate-500 italic">
              Speak your answer clearly into the microphone. Voice commands like "Repeat", "Go back", or "Skip" are also supported.
            </p>
          )}
        </div>
      </div>

      {/* Action Controls for Quick Speech Control */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onRepeatQuestion}
            aria-label="Repeat the current question aloud"
            title="Repeat Question (Key: R)"
            className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              isHighContrast
                ? 'border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Repeat Question (R)</span>
          </button>

          <button
            onClick={onStopSpeaking}
            aria-label="Stop assistant from speaking"
            title="Stop Speaking (Key: M)"
            className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              isHighContrast
                ? 'border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <VolumeX className="w-4 h-4" />
            <span>Stop Speaking (M)</span>
          </button>
        </div>

        {onExplainHelp && (
          <button
            onClick={onExplainHelp}
            aria-label="Ask assistant to explain what this field requires"
            className="text-xs sm:text-sm font-medium text-sky-400 hover:underline flex items-center gap-1"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Explain this field</span>
          </button>
        )}
      </div>
    </section>
  );
};
