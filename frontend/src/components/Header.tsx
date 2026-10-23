import React from 'react';
import { Eye, Type, Settings, HelpCircle, ShieldCheck, Home } from 'lucide-react';

interface HeaderProps {
  isHighContrast: boolean;
  isLargeText: boolean;
  language: 'en' | 'ta';
  onToggleHighContrast: () => void;
  onToggleLargeText: () => void;
  onToggleLanguage: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onGoHome: () => void;
  currentFormTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({
  isHighContrast,
  isLargeText,
  language,
  onToggleHighContrast,
  onToggleLargeText,
  onToggleLanguage,
  onOpenSettings,
  onOpenHelp,
  onGoHome,
  currentFormTitle,
}) => {
  return (
    <header
      role="banner"
      className={`sticky top-0 z-40 w-full transition-colors ${
        isHighContrast
          ? 'bg-black border-b-2 border-yellow-400 text-yellow-300'
          : 'bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onGoHome}
            aria-label="VoiceGov Assist Home, select government forms"
            className="flex items-center gap-3 group focus:outline-none"
          >
            <div
              className={`p-2 rounded-xl flex items-center justify-center font-bold text-lg ${
                isHighContrast
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/20'
              }`}
            >
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
                VoiceGov Assist
                <span
                  className={`text-xs px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                    isHighContrast
                      ? 'bg-yellow-300 text-black'
                      : 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                  }`}
                >
                  Demo Portal
                </span>
              </h1>
              <p
                className={`text-xs hidden sm:block ${
                  isHighContrast ? 'text-yellow-200' : 'text-slate-400'
                }`}
              >
                Accessible Voice-Based Government Form Assistant (WCAG 2.2 AA)
              </p>
            </div>
          </button>
        </div>

        {/* Current Form Indicator if active */}
        {currentFormTitle && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 text-xs">
            <span className="text-slate-400">Current Application:</span>
            <span className="font-semibold text-sky-300">{currentFormTitle}</span>
          </div>
        )}

        {/* Accessibility Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Home button if in form */}
          {currentFormTitle && (
            <button
              onClick={onGoHome}
              aria-label="Return to form list"
              title="Return to form list"
              className={`px-3 py-2 rounded-xl font-medium text-sm flex items-center gap-1.5 transition-all ${
                isHighContrast
                  ? 'border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Forms</span>
            </button>
          )}

          {/* High Contrast Mode Toggle */}
          <button
            onClick={onToggleHighContrast}
            aria-pressed={isHighContrast}
            aria-label={`Toggle high contrast mode. Currently ${isHighContrast ? 'on' : 'off'}`}
            title="Toggle High Contrast (Alt + C)"
            className={`px-3 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              isHighContrast
                ? 'bg-yellow-400 text-black shadow-md'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Contrast</span>
          </button>

          {/* Large Text Mode Toggle */}
          <button
            onClick={onToggleLargeText}
            aria-pressed={isLargeText}
            aria-label={`Toggle large text size. Currently ${isLargeText ? 'large' : 'standard'}`}
            title="Toggle Large Text (Alt + L)"
            className={`px-3 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              isLargeText
                ? isHighContrast
                  ? 'bg-yellow-300 text-black'
                  : 'bg-sky-600 text-white'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            <Type className="w-4 h-4" />
            <span className="hidden sm:inline">Text Size</span>
          </button>

          {/* Language Toggle (English / Tamil) */}
          <button
            onClick={onToggleLanguage}
            aria-label={`Current speech language is ${
              language === 'ta' ? 'Tamil' : 'English'
            }. Click to toggle.`}
            title="Toggle Language (English / Tamil preview)"
            className={`px-3 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              language === 'ta'
                ? isHighContrast
                  ? 'bg-cyan-300 text-black'
                  : 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
            }`}
          >
            {language === 'ta' ? 'தமிழ் (TA)' : 'English (EN)'}
          </button>

          {/* Voice Settings */}
          <button
            onClick={onOpenSettings}
            aria-label="Open voice and speech rate settings"
            title="Speech Settings (Alt + S)"
            className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Spoken Help & Commands */}
          <button
            onClick={onOpenHelp}
            aria-label="Open voice commands and keyboard shortcut help"
            title="Voice Commands Help (Alt + H)"
            className={`px-3 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              isHighContrast
                ? 'border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                : 'bg-sky-500/10 text-sky-300 border border-sky-500/30 hover:bg-sky-500/20'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help</span>
          </button>
        </div>
      </div>
    </header>
  );
};
