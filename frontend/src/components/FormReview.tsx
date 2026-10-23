import React from 'react';
import type { FormTemplate, ReviewResponse, VoiceAssistantState } from '../types/form';
import { AudioVisualizer } from './AudioVisualizer';
import { Volume2, VolumeX, CheckCircle2, AlertTriangle, Edit3, ArrowLeft, Send, RotateCcw } from 'lucide-react';

interface FormReviewProps {
  form: FormTemplate;
  formData: Record<string, any>;
  reviewData: ReviewResponse | null;
  state: VoiceAssistantState;
  isHighContrast?: boolean;
  onReadSummary: () => void;
  onStopSpeaking: () => void;
  onEditField: (fieldIndex: number) => void;
  onBackToForm: () => void;
  onRestartForm: () => void;
  onSubmitApplication: () => void;
}

export const FormReview: React.FC<FormReviewProps> = ({
  form,
  formData,
  reviewData,
  state,
  isHighContrast,
  onReadSummary,
  onStopSpeaking,
  onEditField,
  onBackToForm,
  onRestartForm,
  onSubmitApplication,
}) => {
  const isSpeaking = state === 'speaking';
  const canSubmit = reviewData ? reviewData.can_submit : true;

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Visualizer Status */}
      <div className="mb-8">
        <AudioVisualizer state={state} isHighContrast={isHighContrast} />
      </div>

      {/* Main Review Card */}
      <div
        className={`rounded-3xl p-6 sm:p-8 transition-all ${
          isHighContrast
            ? 'bg-black border-4 border-yellow-400 text-yellow-300 shadow-2xl'
            : 'bg-slate-900 border border-slate-800 shadow-2xl text-slate-100'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${
                isHighContrast ? 'text-yellow-400' : 'text-sky-400'
              }`}
            >
              Step 5: Voice Review & Verification
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Review Application Details
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {form.title} – Verify all answers before final simulated submission.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={isSpeaking ? onStopSpeaking : onReadSummary}
              aria-label={isSpeaking ? 'Stop reading summary' : 'Read application summary aloud'}
              className={`py-2.5 px-4 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                isHighContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Stop Reading</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>Read Summary Aloud</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Missing Required Fields Alert if any */}
        {reviewData && reviewData.missing_required.length > 0 && (
          <div
            role="alert"
            className={`my-6 p-4 rounded-2xl flex items-start gap-3 border ${
              isHighContrast
                ? 'bg-black border-2 border-rose-400 text-rose-300'
                : 'bg-rose-950/40 border-rose-600/50 text-rose-200'
            }`}
          >
            <AlertTriangle className="w-6 h-6 flex-shrink-0 text-rose-400 mt-0.5" />
            <div>
              <p className="font-bold text-sm sm:text-base">
                Required Information Missing
              </p>
              <p className="text-xs sm:text-sm mt-1">
                Please complete the following required fields before submitting:{' '}
                <span className="font-semibold underline">
                  {reviewData.missing_required.join(', ')}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Fields Table / Card Grid */}
        <div className="my-6 divide-y divide-slate-800">
          {form.fields.map((field, index) => {
            const rawVal = formData[field.id];
            const isFilled = rawVal !== undefined && rawVal !== null && rawVal !== '';

            let displayVal = rawVal || 'Not provided';
            if (isFilled && field.mask_spoken && String(rawVal).length >= 4) {
              displayVal = `XXXXXX${String(rawVal).slice(-4)}`;
            } else if (isFilled && field.field_type === 'currency') {
              displayVal = `₹${Number(rawVal).toLocaleString('en-IN')}`;
            }

            return (
              <div
                key={field.id}
                className="py-4 flex flex-wrap items-center justify-between gap-4 hover:bg-slate-800/30 px-3 rounded-xl transition-colors"
              >
                <div className="flex-1 min-w-[240px]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {index + 1}. {field.label}
                    </span>
                    {field.required && (
                      <span className="text-xs text-rose-400 font-bold">*Required</span>
                    )}
                  </div>
                  <div
                    className={`text-base sm:text-lg font-bold mt-1 ${
                      isFilled
                        ? isHighContrast
                          ? 'text-white'
                          : 'text-slate-100'
                        : 'text-slate-500 italic'
                    }`}
                  >
                    {displayVal}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isFilled ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Saved
                    </span>
                  ) : field.required ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-lg">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Missing
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500">Skipped</span>
                  )}

                  <button
                    onClick={() => onEditField(index)}
                    aria-label={`Edit ${field.label}`}
                    title="Change this answer"
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isHighContrast
                        ? 'border border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Voice Submission Command Banner */}
        <div
          className={`p-4 rounded-2xl mb-8 border ${
            isHighContrast
              ? 'bg-zinc-950 border-yellow-400/80 text-yellow-200'
              : 'bg-sky-950/40 border-sky-500/40 text-sky-200'
          }`}
        >
          <p className="text-sm font-semibold flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Voice Command to Submit:
          </p>
          <p className="text-base sm:text-lg font-bold mt-1 text-white">
            Say: "I confirm and submit" or click the button below.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToForm}
              aria-label="Go back to question flow"
              className={`py-3 px-5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                isHighContrast
                  ? 'border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Questions</span>
            </button>

            <button
              onClick={onRestartForm}
              aria-label="Restart application from beginning"
              className="py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Application</span>
            </button>
          </div>

          <button
            onClick={onSubmitApplication}
            disabled={!canSubmit}
            aria-label="Confirm and submit application"
            className={`py-3.5 px-8 rounded-xl font-extrabold text-base flex items-center gap-2 transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed ${
              isHighContrast
                ? 'bg-yellow-400 text-black hover:bg-yellow-300 ring-2 ring-yellow-400'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-600/30 ring-2 ring-emerald-500/50'
            }`}
          >
            <Send className="w-5 h-5" />
            <span>I Confirm and Submit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
