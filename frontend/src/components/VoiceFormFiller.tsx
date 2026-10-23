import React, { useState } from 'react';
import type { FormTemplate, FormField, VoiceAssistantState } from '../types/form';
import { VoiceStatusCard } from './VoiceStatusCard';
import { AudioVisualizer } from './AudioVisualizer';
import { ChevronLeft, SkipForward, FileCheck, CheckCircle2, Circle, Edit3, Send } from 'lucide-react';

interface VoiceFormFillerProps {
  form: FormTemplate;
  currentFieldIndex: number;
  formData: Record<string, any>;
  state: VoiceAssistantState;
  transcript: string;
  interimTranscript: string;
  pendingConfirmationText?: string | null;
  errorMessage?: string | null;
  isHighContrast?: boolean;
  onConfirmYes: () => void;
  onConfirmNo: () => void;
  onRepeatQuestion: () => void;
  onStopSpeaking: () => void;
  onGoBack: () => void;
  onSkipField: () => void;
  onGoToReview: () => void;
  onJumpToField: (index: number) => void;
  onManualSubmit: (value: string) => void;
}

export const VoiceFormFiller: React.FC<VoiceFormFillerProps> = ({
  form,
  currentFieldIndex,
  formData,
  state,
  transcript,
  interimTranscript,
  pendingConfirmationText,
  errorMessage,
  isHighContrast,
  onConfirmYes,
  onConfirmNo,
  onRepeatQuestion,
  onStopSpeaking,
  onGoBack,
  onSkipField,
  onGoToReview,
  onJumpToField,
  onManualSubmit,
}) => {
  const [manualText, setManualText] = useState('');
  const currentField: FormField = form.fields[currentFieldIndex];
  const progressPercent = Math.round(((currentFieldIndex + 1) / form.fields.length) * 100);

  const handleManualFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualText.trim()) {
      onManualSubmit(manualText.trim());
      setManualText('');
    }
  };

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Progress & Application Title Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span
            className={`text-xs font-bold uppercase tracking-wider ${
              isHighContrast ? 'text-yellow-300' : 'text-sky-400'
            }`}
          >
            {form.category}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {form.title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Progress</span>
            <span
              className={`text-sm sm:text-base font-bold ${
                isHighContrast ? 'text-yellow-300' : 'text-sky-300'
              }`}
            >
              Question {currentFieldIndex + 1} of {form.fields.length} ({progressPercent}%)
            </span>
          </div>

          <button
            onClick={onGoToReview}
            aria-label="Skip to review application"
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all ${
              isHighContrast
                ? 'border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Review Form</span>
          </button>
        </div>
      </div>

      {/* Accessible Progress Bar */}
      <div
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Application progress: ${progressPercent} percent`}
        className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden mb-8"
      >
        <div
          className={`h-full transition-all duration-300 ${
            isHighContrast ? 'bg-yellow-400' : 'bg-gradient-to-r from-sky-500 to-emerald-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Voice Assistant Interaction Card & Visualizer */}
        <div className="lg:col-span-7 space-y-6">
          <AudioVisualizer state={state} isHighContrast={isHighContrast} />

          <VoiceStatusCard
            state={state}
            currentField={currentField}
            currentQuestionText={currentField?.spoken_prompt || ''}
            transcript={transcript}
            interimTranscript={interimTranscript}
            pendingConfirmationText={pendingConfirmationText}
            errorMessage={errorMessage}
            isHighContrast={isHighContrast}
            onConfirmYes={onConfirmYes}
            onConfirmNo={onConfirmNo}
            onRepeatQuestion={onRepeatQuestion}
            onStopSpeaking={onStopSpeaking}
            onExplainHelp={() => onRepeatQuestion()}
          />

          {/* Navigation Controls: Previous / Skip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={onGoBack}
              disabled={currentFieldIndex === 0}
              aria-label="Go to previous question"
              className={`py-3 px-5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                isHighContrast
                  ? 'border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Go Back (Previous)</span>
            </button>

            <button
              onClick={onSkipField}
              aria-label="Skip this question"
              className={`py-3 px-5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                isHighContrast
                  ? 'border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
            >
              <span>Skip Question</span>
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Optional Accessible Keyboard / Hybrid Fallback Input */}
          <div
            className={`p-4 rounded-2xl border ${
              isHighContrast
                ? 'bg-black border-yellow-400/60'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <label
              htmlFor="manual-field-input"
              className="text-xs font-semibold text-slate-400 block mb-2"
            >
              Optional: Keyboard Input Override (If voice is difficult)
            </label>
            <form onSubmit={handleManualFormSubmit} className="flex gap-2">
              <input
                id="manual-field-input"
                type="text"
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder={`Type answer for ${currentField?.label}...`}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none transition-colors ${
                  isHighContrast
                    ? 'bg-zinc-950 border-2 border-yellow-400 text-white placeholder-yellow-600'
                    : 'bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:border-sky-500'
                }`}
              />
              <button
                type="submit"
                aria-label="Submit typed answer"
                className={`px-4 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-1.5 transition-all ${
                  isHighContrast
                    ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                    : 'bg-sky-600 hover:bg-sky-500 text-white'
                }`}
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Enter</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Form Sheet Preview */}
        <div className="lg:col-span-5">
          <div
            className={`rounded-3xl p-6 transition-all sticky top-20 ${
              isHighContrast
                ? 'bg-black border-2 border-yellow-400 text-yellow-300 shadow-xl'
                : 'bg-slate-900/90 border border-slate-800 shadow-xl text-slate-100'
            }`}
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-sky-400" />
                <span>Live Application Preview</span>
              </h3>
              <span className="text-xs text-slate-400">
                {Object.keys(formData).length} of {form.fields.length} Filled
              </span>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {form.fields.map((f, idx) => {
                const isCurrent = idx === currentFieldIndex;
                const val = formData[f.id];
                const isFilled = val !== undefined && val !== null && val !== '';

                let displayVal = val;
                if (isFilled && f.mask_spoken && String(val).length >= 4) {
                  displayVal = `XXXXXX${String(val).slice(-4)}`;
                } else if (isFilled && f.field_type === 'currency') {
                  displayVal = `₹${Number(val).toLocaleString('en-IN')}`;
                }

                return (
                  <div
                    key={f.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isCurrent
                        ? isHighContrast
                          ? 'border-2 border-yellow-400 bg-zinc-950 ring-2 ring-yellow-400/40'
                          : 'border-sky-500 bg-sky-950/20 ring-1 ring-sky-500/50'
                        : isFilled
                        ? 'border-slate-800 bg-slate-800/40'
                        : 'border-slate-800/60 bg-slate-900/40 opacity-70'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="mt-0.5 flex-shrink-0">
                        {isFilled ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <Circle className="w-4 h-4 text-sky-400 fill-sky-400/30 animate-pulse" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-600" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-400">
                            {idx + 1}. {f.label}
                          </span>
                          {f.required && (
                            <span className="text-rose-400 text-xs">*</span>
                          )}
                        </div>

                        <div className="text-sm font-semibold truncate mt-0.5">
                          {isFilled ? (
                            <span className="text-white">{displayVal}</span>
                          ) : isCurrent ? (
                            <span className="text-sky-300 italic">Answering now...</span>
                          ) : (
                            <span className="text-slate-500 italic">Not answered</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isFilled && !isCurrent && (
                      <button
                        onClick={() => onJumpToField(idx)}
                        aria-label={`Edit ${f.label}`}
                        title="Edit this field"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-sky-300 hover:bg-slate-700/60 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
