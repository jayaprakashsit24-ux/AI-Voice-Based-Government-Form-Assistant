import React from 'react';
import type { FormTemplate } from '../types/form';
import { GraduationCap, Fingerprint, HeartHandshake, FileText, HelpCircle, ArrowRight, Clock, ListChecks } from 'lucide-react';

interface FormSelectorProps {
  forms: FormTemplate[];
  onSelectForm: (formId: string) => void;
  isHighContrast?: boolean;
}

export const FormSelector: React.FC<FormSelectorProps> = ({
  forms,
  onSelectForm,
  isHighContrast,
}) => {
  const getFormIcon = (formId: string) => {
    switch (formId) {
      case 'scholarship-demo':
        return <GraduationCap className="w-8 h-8" />;
      case 'aadhaar-update-demo':
        return <Fingerprint className="w-8 h-8" />;
      case 'pension-demo':
        return <HeartHandshake className="w-8 h-8" />;
      case 'income-cert-demo':
        return <FileText className="w-8 h-8" />;
      default:
        return <HelpCircle className="w-8 h-8" />;
    }
  };

  const getSpokenCommandHint = (formId: string) => {
    switch (formId) {
      case 'scholarship-demo':
        return 'Say: "Start scholarship application"';
      case 'aadhaar-update-demo':
        return 'Say: "Start Aadhaar update"';
      case 'pension-demo':
        return 'Say: "Start pension application"';
      case 'income-cert-demo':
        return 'Say: "Start income certificate"';
      default:
        return 'Say: "Start grievance application"';
    }
  };

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Intro Hero Banner */}
      <div
        className={`mb-10 p-6 sm:p-8 rounded-3xl transition-all ${
          isHighContrast
            ? 'bg-black border-2 border-yellow-400 text-yellow-300'
            : 'bg-gradient-to-br from-slate-900 via-sky-950/40 to-slate-900 border border-slate-800 shadow-2xl text-slate-100'
        }`}
      >
        <div className="max-w-3xl">
          <span
            className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 ${
              isHighContrast
                ? 'bg-yellow-400 text-black'
                : 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
            }`}
          >
            Accessible Voice Demonstration
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Select a Government Application
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed">
            Fill government applications hands-free using voice guidance. Designed for visually impaired, blind, elderly citizens, and assistive technology users.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium">
            <span className="flex items-center gap-1.5 text-sky-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Microphone Ready
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">
              Press <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-sky-300 font-mono">Space</kbd> to Speak
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-amber-400">
              Demo Simulation Only
            </span>
          </div>
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {forms.map((form, index) => {
          const isPrimary = form.id === 'scholarship-demo';
          return (
            <div
              key={form.id}
              className={`flex flex-col justify-between rounded-3xl p-6 transition-all duration-200 group relative ${
                isHighContrast
                  ? 'bg-black border-2 border-yellow-400 text-yellow-300 hover:border-white'
                  : isPrimary
                  ? 'bg-slate-900 border-2 border-sky-500/80 shadow-xl shadow-sky-500/10 hover:border-sky-400'
                  : 'bg-slate-900 border border-slate-800 shadow-lg hover:border-slate-700'
              }`}
            >
              {isPrimary && (
                <div className="absolute -top-3 right-6">
                  <span className="bg-sky-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    Recommended Demo
                  </span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-2xl ${
                      isHighContrast
                        ? 'bg-yellow-400 text-black'
                        : isPrimary
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-400/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {getFormIcon(form.id)}
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                      isHighContrast
                        ? 'bg-zinc-900 text-yellow-300 border border-yellow-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Option {index + 1}
                  </span>
                </div>

                <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
                  {form.category}
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white mb-2">
                  {form.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {form.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400 mb-6">
                  <span className="flex items-center gap-1">
                    <ListChecks className="w-4 h-4 text-slate-500" />
                    {form.fields.length} Fields
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-slate-500" />
                    ~{form.estimated_minutes} mins
                  </span>
                </div>
              </div>

              <div>
                {/* Voice Hint Badge */}
                <div
                  className={`mb-4 px-3 py-2 rounded-xl text-xs font-medium ${
                    isHighContrast
                      ? 'bg-zinc-950 text-yellow-200 border border-yellow-400/50'
                      : 'bg-slate-800/80 text-sky-300 border border-slate-700'
                  }`}
                >
                  <span className="font-semibold block mb-0.5">Voice Trigger:</span>
                  {getSpokenCommandHint(form.id)}
                </div>

                <button
                  onClick={() => onSelectForm(form.id)}
                  aria-label={`Start ${form.title}`}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all ${
                    isHighContrast
                      ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                      : isPrimary
                      ? 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/25'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700'
                  }`}
                >
                  <span>Start Application</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Accessibility Guarantee & Disclaimer Footer */}
      <div className="mt-12 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-400 leading-relaxed text-center">
        <p className="font-semibold text-slate-300 mb-1">
          Accessibility Compliance & Privacy Protection
        </p>
        <p>
          VoiceGov Assist is built strictly adhering to WCAG 2.2 AA accessibility guidelines. Speech audio is processed ephemerally in browser and server memory; no biometric or sensitive government identifiers (such as 12-digit Aadhaar UID) are stored. All submissions are fictional simulations for assistive technology evaluation.
        </p>
      </div>
    </div>
  );
};
