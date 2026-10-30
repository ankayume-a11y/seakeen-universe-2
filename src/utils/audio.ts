/**
 * iOS Sound Synthesis Engine using Web Audio API
 * Generates authentic iPhone sound effects with zero external network dependencies
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ringtoneInterval: number | null = null;
  public enabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.enabled) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Short mechanical lock sound
   */
  playLock() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // ignore
    }
  }

  /**
   * Unlock click sound
   */
  playUnlock() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  }

  /**
   * iOS Keypad click sound
   */
  playKeypadClick(digit?: string) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const baseFreq = 500 + (digit ? (parseInt(digit, 10) || 5) * 40 : 100);
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // ignore
    }
  }

  /**
   * iOS Virtual Keyboard click
   */
  playKeyboardClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      // Subtle wooden / mechanical click
      const bufferSize = ctx.sampleRate * 0.02; // 20ms noise
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1600;
      filter.Q.value = 3;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.02);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start();
    } catch {
      // ignore
    }
  }

  /**
   * iOS Tri-tone Notification chime
   */
  playNotification() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const notes = [
        { freq: 880, start: 0, dur: 0.12 },       // A5
        { freq: 1108.73, start: 0.13, dur: 0.12 }, // C#6
        { freq: 1318.51, start: 0.26, dur: 0.28 }  // E6
      ];

      notes.forEach(({ freq, start, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

        gain.gain.setValueAtTime(0.3, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Message sent whoosh / pop sound
   */
  playMessageSent() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // ignore
    }
  }

  /**
   * Call rejection / hangup tone
   */
  playCallEnd() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, ctx.currentTime);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // ignore
    }
  }

  /**
   * iOS Opening / Reflection Ringtone
   */
  startRingtone() {
    this.stopRingtone();
    const ctx = this.getContext();
    if (!ctx) return;

    const playPattern = () => {
      const c = this.getContext();
      if (!c) return;
      // High marimba notes reminiscent of iOS Opening
      const ringNotes = [
        { f: 1046.5, t: 0 },
        { f: 1318.5, t: 0.12 },
        { f: 1567.98, t: 0.24 },
        { f: 2093.0, t: 0.36 },
        { f: 1567.98, t: 0.54 },
        { f: 2093.0, t: 0.72 }
      ];

      ringNotes.forEach(({ f, t }) => {
        try {
          const osc = c.createOscillator();
          const gain = c.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, c.currentTime + t);

          gain.gain.setValueAtTime(0.22, c.currentTime + t);
          gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + t + 0.2);

          osc.connect(gain);
          gain.connect(c.destination);

          osc.start(c.currentTime + t);
          osc.stop(c.currentTime + t + 0.22);
        } catch {
          // ignore
        }
      });
    };

    playPattern();
    this.ringtoneInterval = window.setInterval(playPattern, 2000);
  }

  stopRingtone() {
    if (this.ringtoneInterval !== null) {
      clearInterval(this.ringtoneInterval);
      this.ringtoneInterval = null;
    }
  }

  /**
   * Camera shutter click
  /**
   * Smooth, authentic iPhone camera shutter click
   */
  playCameraShutter() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const t = ctx.currentTime;
      // Phase 1: Soft crisp initial shutter blade click (bandpass filtered noise)
      const bufferSize = Math.floor(ctx.sampleRate * 0.035);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.22));
      }
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1750, t);
      filter.Q.setValueAtTime(1.8, t);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.032);

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start(t);

      // Phase 2: Gentle, smooth mechanical aperture release (~40ms later)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(460, t + 0.04);
      osc.frequency.exponentialRampToValueAtTime(260, t + 0.08);

      oscGain.gain.setValueAtTime(0.08, t + 0.04);
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      osc.start(t + 0.04);
      osc.stop(t + 0.085);
    } catch {
      // ignore
    }
  }

  /**
   * Generic button tap
   */
  playTap() {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundEngine();
