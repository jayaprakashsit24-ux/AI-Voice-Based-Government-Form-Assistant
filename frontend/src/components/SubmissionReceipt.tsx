import React from 'react';
import type { SubmissionResponse } from '../types/form';
import { CheckCircle2, Copy, Printer, RotateCcw, Volume2, ShieldAlert } from 'lucide-react';

interface SubmissionReceiptProps {
  receipt: SubmissionResponse;
  isHighContrast?: boolean;
  onReadReceipt: () => void;
  onNewApplication: () => void;
}

export const SubmissionReceipt: React.FC<SubmissionReceiptProps> = ({
  receipt,
  isHighContrast,
  onReadReceipt,
  onNewApplication,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(receipt.reference_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Success Banner Card */}
      <div
        className={`rounded-3xl p-6 sm:p-10 transition-all ${
          isHighContrast
            ? 'bg-black border-4 border-yellow-400 text-yellow-300 shadow-2xl'
            : 'bg-slate-900 border border-slate-800 shadow-2xl text-slate-100'
        }`}
      >
        <div className="text-center mb-8">
          <div
            className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
              isHighContrast
                ? 'bg-yellow-400 text-black'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-400/30'
            }`}
          >
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span
            className={`inline-block text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full mb-2 ${
              isHighContrast
                ? 'bg-yellow-400 text-black'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
            }`}
          >
            Simulation Submission Complete
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Application Recorded
          </h2>

          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-lg mx-auto">
            Your demo application for{' '}
            <strong className="text-sky-300">{receipt.form_title}</strong> has been
            simulated and recorded in the local prototype store.
          </p>
        </div>

        {/* Demo Disclaimer Notice */}
        <div
          role="note"
          className={`p-4 rounded-2xl mb-8 flex items-start gap-3 border text-xs sm:text-sm ${
            isHighContrast
              ? 'bg-zinc-950 border-yellow-400 text-yellow-200'
              : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
          }`}
        >
          <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
          <div>
            <strong>Accessibility Prototype Notice:</strong> This is a fictional demonstration of voice-guided form completion. No actual government database was accessed, and no official application has been lodged with state or central authorities.
          </div>
        </div>

        {/* Reference Number Box */}
        <div
          className={`p-6 rounded-2xl border text-center mb-8 transition-colors ${
            isHighContrast
              ? 'bg-zinc-950 border-yellow-400'
              : 'bg-slate-800/80 border-slate-700 shadow-inner'
          }`}
        >
          <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-1">
            Simulated Application Reference Number
          </span>
          <div className="text-2xl sm:text-3xl font-mono font-extrabold tracking-wider text-sky-400 my-2">
            {receipt.reference_number}
          </div>
          <p className="text-xs text-slate-400">
            Submitted on {new Date(receipt.submitted_at).toLocaleString()}
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={handleCopyRef}
              aria-label="Copy reference number to clipboard"
              className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isHighContrast
                  ? 'border border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy Reference'}</span>
            </button>

            <button
              onClick={onReadReceipt}
              aria-label="Read receipt aloud"
              className={`py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isHighContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-sky-600 hover:bg-sky-500 text-white'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>Read Receipt Aloud</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <button
            onClick={handlePrint}
            aria-label="Print or save PDF receipt"
            className={`py-3 px-5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              isHighContrast
                ? 'border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>

          <button
            onClick={onNewApplication}
            aria-label="Start another government demo application"
            className={`py-3 px-6 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
              isHighContrast
                ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-lg shadow-emerald-500/20'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start Another Application</span>
          </button>
        </div>
      </div>
    </div>
  );
};
