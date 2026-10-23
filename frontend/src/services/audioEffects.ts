// Accessible Web Audio API Earcon synthesizer
class EarconService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public play(type: 'listen_start' | 'listen_stop' | 'success' | 'confirm_prompt' | 'error' | 'click') {
    if (!this.enabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      if (type === 'listen_start') {
        // Ascending pleasant double tone: C5 (523Hz) -> E5 (659Hz)
        this.playTone(ctx, 523.25, now, 0.12, 'sine', 0.15);
        this.playTone(ctx, 659.25, now + 0.1, 0.18, 'sine', 0.2);
      } else if (type === 'listen_stop') {
        // Soft single settle ping
        this.playTone(ctx, 440, now, 0.08, 'sine', 0.1);
      } else if (type === 'success') {
        // Major triad chime: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz)
        this.playTone(ctx, 523.25, now, 0.12, 'triangle', 0.15);
        this.playTone(ctx, 659.25, now + 0.1, 0.12, 'triangle', 0.18);
        this.playTone(ctx, 783.99, now + 0.2, 0.28, 'triangle', 0.22);
      } else if (type === 'confirm_prompt') {
        // Friendly double bell
        this.playTone(ctx, 587.33, now, 0.1, 'sine', 0.15);
        this.playTone(ctx, 880, now + 0.12, 0.2, 'sine', 0.18);
      } else if (type === 'error') {
        // Descending low warning tone: 240Hz -> 180Hz
        this.playTone(ctx, 240, now, 0.15, 'sawtooth', 0.12);
        this.playTone(ctx, 180, now + 0.14, 0.25, 'sawtooth', 0.14);
      } else if (type === 'click') {
        this.playTone(ctx, 600, now, 0.04, 'sine', 0.08);
      }
    } catch {
      // Audio playback fails gracefully if audio blocked
    }
  }

  private playTone(
    ctx: AudioContext,
    freq: number,
    startTime: number,
    duration: number,
    type: OscillatorType,
    maxGain: number
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(maxGain, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
  }
}

export const earconService = new EarconService();
