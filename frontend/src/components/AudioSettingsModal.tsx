import React, { useEffect, useState } from 'react';
import type { SpeechSettings } from '../types/form';
import { speechService } from '../services/speechService';
import { X, Settings, Play } from 'lucide-react';

interface AudioSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SpeechSettings;
  onSaveSettings: (settings: SpeechSettings) => void;
  isHighContrast?: boolean;
}

export const AudioSettingsModal: React.FC<AudioSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
  isHighContrast,
}) => {
  const [current, setCurrent] = useState<SpeechSettings>(settings);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    setCurrent(settings);
    if (typeof window !== 'undefined') {
      const loadVoices = () => {
        const v = speechService.getAvailableVoices();
        setVoices(v);
      };
      loadVoices();
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleTestVoice = () => {
    speechService.updateSettings(current);
    speechService.speak(
      current.language === 'ta'
        ? 'இது வாய்ஸ்கவ் அசிஸ்டன்ட்டின் குரல் பரிசோதனை ஆகும்.'
        : 'This is a voice test for VoiceGov Assist. How does this sound?'
    );
  };

  const handleSave = () => {
    onSaveSettings(current);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="audio-settings-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 transition-all ${
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
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 id="audio-settings-title" className="text-xl font-bold">
                Speech & Audio Settings
              </h3>
              <p className="text-xs text-slate-400">
                Adjust assistant voice speed, pitch, and synthesizer voice.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close settings"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Speech Rate Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="speech-rate" className="text-sm font-semibold">
                Speech Speed (Rate)
              </label>
              <span className="text-xs font-mono font-bold text-sky-400">
                {current.rate}x
              </span>
            </div>
            <input
              id="speech-rate"
              type="range"
              min="0.7"
              max="1.4"
              step="0.05"
              value={current.rate}
              onChange={(e) =>
                setCurrent({ ...current, rate: parseFloat(e.target.value) })
              }
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Slower (0.7x)</span>
              <span>Normal (1.0x)</span>
              <span>Faster (1.4x)</span>
            </div>
          </div>

          {/* Speech Pitch Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="speech-pitch" className="text-sm font-semibold">
                Voice Pitch
              </label>
              <span className="text-xs font-mono font-bold text-sky-400">
                {current.pitch}x
              </span>
            </div>
            <input
              id="speech-pitch"
              type="range"
              min="0.8"
              max="1.3"
              step="0.05"
              value={current.pitch}
              onChange={(e) =>
                setCurrent({ ...current, pitch: parseFloat(e.target.value) })
              }
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Deeper (0.8x)</span>
              <span>Standard (1.0x)</span>
              <span>Higher (1.3x)</span>
            </div>
          </div>

          {/* Voice Selection Dropdown */}
          {voices.length > 0 && (
            <div>
              <label htmlFor="voice-select" className="text-sm font-semibold block mb-2">
                Synthesizer Voice
              </label>
              <select
                id="voice-select"
                value={current.voiceURI || ''}
                onChange={(e) =>
                  setCurrent({ ...current, voiceURI: e.target.value || undefined })
                }
                className={`w-full p-3 rounded-xl text-sm focus:outline-none ${
                  isHighContrast
                    ? 'bg-zinc-950 border-2 border-yellow-400 text-white'
                    : 'bg-slate-800 border border-slate-700 text-slate-100'
                }`}
              >
                <option value="">Default Recommended Voice</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Test Voice Button */}
          <div className="pt-2">
            <button
              onClick={handleTestVoice}
              className={`w-full py-2.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                isHighContrast
                  ? 'border-2 border-yellow-400 text-yellow-300 hover:bg-yellow-400 hover:text-black'
                  : 'bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Test Current Voice Settings</span>
            </button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl font-semibold text-sm text-slate-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`py-2.5 px-6 rounded-xl font-bold text-sm ${
              isHighContrast
                ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20'
            }`}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
