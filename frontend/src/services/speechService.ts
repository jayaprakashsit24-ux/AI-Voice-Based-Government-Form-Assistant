import type { SpeechSettings } from '../types/form';
import { earconService } from './audioEffects';

// Web Speech API Types
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export type SpeechRecognitionErrorType =
  | 'not-allowed'
  | 'no-speech'
  | 'network'
  | 'audio-capture'
  | 'not-supported'
  | 'unknown';

class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private recognitionSupported: boolean = false;
  private synthesisSupported: boolean = false;

  private settings: SpeechSettings = {
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
    language: 'en',
  };

  // Event handlers
  public onTranscriptFinal?: (text: string) => void;
  public onTranscriptInterim?: (text: string) => void;
  public onListenStart?: () => void;
  public onListenEnd?: () => void;
  public onSpeechStart?: () => void;
  public onSpeechEnd?: () => void;
  public onError?: (errorType: SpeechRecognitionErrorType, rawError: any) => void;

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as IWindow;
      const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRec) {
        this.recognitionSupported = true;
        try {
          this.recognition = new SpeechRec();
          this.setupRecognition();
        } catch (e) {
          console.warn('SpeechRecognition initialization error:', e);
          this.recognitionSupported = false;
        }
      }
      this.synthesisSupported = 'speechSynthesis' in window;
    }
  }

  public isRecognitionSupported(): boolean {
    return this.recognitionSupported;
  }

  public isSynthesisSupported(): boolean {
    return this.synthesisSupported;
  }

  public getSettings(): SpeechSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<SpeechSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    if (this.recognition) {
      this.recognition.lang = this.settings.language === 'ta' ? 'ta-IN' : 'en-IN';
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.lang = this.settings.language === 'ta' ? 'ta-IN' : 'en-IN';

    this.recognition.onstart = () => {
      this.isListening = true;
      earconService.play('listen_start');
      this.onListenStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          final += item[0].transcript;
        } else {
          interim += item[0].transcript;
        }
      }

      if (interim) {
        this.onTranscriptInterim?.(interim);
      }

      if (final) {
        const cleaned = final.trim();
        if (cleaned) {
          this.onTranscriptFinal?.(cleaned);
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      this.isListening = false;
      const err = event.error;
      let mappedType: SpeechRecognitionErrorType = 'unknown';

      if (err === 'not-allowed' || err === 'service-not-allowed') {
        mappedType = 'not-allowed';
      } else if (err === 'no-speech') {
        mappedType = 'no-speech';
      } else if (err === 'network') {
        mappedType = 'network';
      } else if (err === 'audio-capture') {
        mappedType = 'audio-capture';
      }

      this.onError?.(mappedType, event);
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        earconService.play('listen_stop');
      }
      this.isListening = false;
      this.onListenEnd?.();
    };
  }

  public startListening(): boolean {
    if (!this.recognitionSupported || !this.recognition) {
      this.onError?.('not-supported', new Error('Speech recognition not supported in this browser.'));
      return false;
    }

    // Stop speaking before listening so assistant doesn't hear itself
    this.stopSpeaking();

    try {
      if (this.isListening) {
        this.recognition.stop();
      }
      this.recognition.lang = this.settings.language === 'ta' ? 'ta-IN' : 'en-IN';
      this.recognition.start();
      return true;
    } catch (e: any) {
      console.warn('Could not start recognition:', e);
      return false;
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
      this.isListening = false;
    }
  }

  public speak(text: string, onEnd?: () => void, priority: boolean = true) {
    if (!this.synthesisSupported || typeof window === 'undefined') {
      onEnd?.();
      return;
    }

    if (priority) {
      this.stopSpeaking();
    }

    // Pause recognition while speaking so assistant doesn't pick up its own voice
    this.stopListening();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.settings.rate;
    utterance.pitch = this.settings.pitch;
    utterance.volume = this.settings.volume;

    // Pick appropriate voice
    const voices = window.speechSynthesis.getVoices();
    if (this.settings.voiceURI) {
      const v = voices.find((vox) => vox.voiceURI === this.settings.voiceURI);
      if (v) utterance.voice = v;
    } else {
      // Prioritize natural Indian English, then standard English
      const targetLang = this.settings.language === 'ta' ? 'ta' : 'en';
      const preferred = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(targetLang) &&
          (v.lang.includes('IN') || v.name.includes('India') || v.name.includes('Natural'))
      ) || voices.find((v) => v.lang.toLowerCase().startsWith(targetLang));

      if (preferred) utterance.voice = preferred;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.onSpeechStart?.();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.onSpeechEnd?.();
      onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.isSpeaking = false;
      this.onSpeechEnd?.();
      onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking() {
    if (this.synthesisSupported && typeof window !== 'undefined') {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesisSupported || typeof window === 'undefined') return [];
    return window.speechSynthesis.getVoices();
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export const speechService = new SpeechService();
