import React from 'react';
import { X, Mic, Keyboard, Volume2, HelpCircle } from 'lucide-react';

interface VoiceHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  isHighContrast?: boolean;
}

export const VoiceHelpModal: React.FC<VoiceHelpModalProps> = ({
  isOpen,
  onClose,
  isHighContrast,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 transition-all ${
          isHighContrast
            ? 'bg-black border-4 border-yellow-400 text-yellow-300 shadow-2xl'
            : 'bg-slate-900 border border-slate-700 shadow-2xl text-slate-100'
        }`}
      >
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                isHighContrast ? 'bg-yellow-400 text-black' : 'bg-sky-500/20 text-sky-300'
              }`}
            >
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 id="help-modal-title" className="text-xl sm:text-2xl font-bold">
                Voice Commands & Accessibility Guide
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                You can control the entire portal using natural spoken English or keyboard shortcuts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close help modal"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Commands Grid */}
        <div className="space-y-6">
          {/* Spoken Voice Commands */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-sky-400 flex items-center gap-2 mb-3">
              <Mic className="w-4 h-4" /> Spoken Voice Commands
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="font-bold text-white block mb-0.5">"Start a new application"</span>
                <span className="text-slate-400">Starts scholarship or primary demo form.</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="font-bold text-white block mb-0.5">"Yes" / "No"</span>
                <span className="text-slate-400">Confirms or rejects recognized answers.</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="font-bold text-white block mb-0.5">"Repeat the question"</span>
                <span className="text-slate-400">Repeats the current prompt aloud.</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="font-bold text-white block mb-0.5">"Go back"</span>
                <span className="text-slate-400">Returns to the previous form field.</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="font-bold text-white block mb-0.5">"Skip this field"</span>
                <span className="text-slate-400">Skips optional or current field.</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="font-bold text-white block mb-0.5">"Review my form"</span>
                <span className="text-slate-400">Reads summary of all entered details.</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="font-bold text-white block mb-0.5">"I confirm and submit"</span>
                <span className="text-slate-400">Submits the demo application.</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="font-bold text-white block mb-0.5">"Stop speaking"</span>
                <span className="text-slate-400">Immediately silences assistant speech.</span>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2 mb-3">
              <Keyboard className="w-4 h-4" /> Keyboard Shortcuts
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-300">Push-to-Talk / Toggle Mic</span>
                <kbd className="px-2 py-1 rounded bg-slate-700 font-mono text-sky-300 font-bold">Space</kbd>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-300">Repeat Question Aloud</span>
                <kbd className="px-2 py-1 rounded bg-slate-700 font-mono text-sky-300 font-bold">R</kbd>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-300">Stop Speaking / Silence</span>
                <kbd className="px-2 py-1 rounded bg-slate-700 font-mono text-sky-300 font-bold">M</kbd>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-300">Open Voice Help</span>
                <kbd className="px-2 py-1 rounded bg-slate-700 font-mono text-sky-300 font-bold">H</kbd>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-300">Toggle High Contrast</span>
                <kbd className="px-2 py-1 rounded bg-slate-700 font-mono text-sky-300 font-bold">Alt + C</kbd>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-300">Toggle Large Text Size</span>
                <kbd className="px-2 py-1 rounded bg-slate-700 font-mono text-sky-300 font-bold">Alt + L</kbd>
              </div>
            </div>
          </div>

          {/* Audio Earcons explanation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4" /> Audio Earcons (Audio Chimes)
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              For users with visual impairments, VoiceGov Assist plays distinct musical earcons: an ascending chime when the microphone activates, a gentle settle tone when speech completes, a celebration triad when an action succeeds, and a low warning tone if an input is invalid.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className={`py-2.5 px-6 rounded-xl font-bold text-sm ${
              isHighContrast
                ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
            }`}
          >
            Got it, Close Help (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
