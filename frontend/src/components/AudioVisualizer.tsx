import React from 'react';
import type { VoiceAssistantState } from '../types/form';
import { Mic, Volume2, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface AudioVisualizerProps {
  state: VoiceAssistantState;
  isHighContrast?: boolean;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ state, isHighContrast }) => {
  const getStatusColor = () => {
    switch (state) {
      case 'listening':
        return isHighContrast ? 'text-yellow-300' : 'text-emerald-400';
      case 'speaking':
        return isHighContrast ? 'text-cyan-300' : 'text-sky-400';
      case 'confirming':
        return isHighContrast ? 'text-yellow-400' : 'text-amber-400';
      case 'processing':
        return isHighContrast ? 'text-purple-300' : 'text-indigo-400';
      case 'completed':
        return isHighContrast ? 'text-green-300' : 'text-emerald-500';
      case 'error':
        return isHighContrast ? 'text-rose-400' : 'text-red-500';
      default:
        return 'text-slate-400';
    }
  };

  const getStatusLabel = () => {
    switch (state) {
      case 'listening':
        return 'Listening to you...';
      case 'speaking':
        return 'Assistant is speaking...';
      case 'confirming':
        return 'Awaiting your confirmation (Say Yes or No)';
      case 'processing':
        return 'Processing your answer...';
      case 'review':
        return 'Reviewing application details';
      case 'completed':
        return 'Application submitted (Demo)';
      case 'error':
        return 'Attention needed';
      default:
        return 'Voice Assistant Ready';
    }
  };

  const getStatusIcon = () => {
    switch (state) {
      case 'listening':
        return <Mic className="w-6 h-6 animate-pulse" />;
      case 'speaking':
        return <Volume2 className="w-6 h-6 animate-bounce" />;
      case 'confirming':
        return <AlertCircle className="w-6 h-6 animate-pulse" />;
      case 'processing':
        return <Loader2 className="w-6 h-6 animate-spin" />;
      case 'completed':
        return <CheckCircle2 className="w-6 h-6" />;
      case 'error':
        return <AlertCircle className="w-6 h-6" />;
      default:
        return <Mic className="w-6 h-6 opacity-60" />;
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-all duration-300 ${
        isHighContrast
          ? 'bg-black border-2 border-yellow-400 text-yellow-300'
          : 'bg-slate-900/90 border border-slate-700 shadow-xl'
      }`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2.5 rounded-full ${getStatusColor()} ${
          state === 'listening' ? 'ring-4 ring-emerald-500/30' : ''
        }`}>
          {getStatusIcon()}
        </div>
        <span className={`text-base font-semibold tracking-wide uppercase ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>
      </div>

      {/* Dynamic Sound Wave */}
      <div
        className="flex items-center justify-center gap-1.5 h-12 w-full max-w-xs px-4"
        aria-hidden="true"
      >
        {[...Array(7)].map((_, i) => (
          <span
            key={i}
            className={`wave-bar ${getStatusColor()}`}
            style={{
              animationPlayState: state === 'listening' || state === 'speaking' ? 'running' : 'paused',
              opacity: state === 'idle' ? 0.3 : 1,
              height: state === 'idle' ? '6px' : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
};
