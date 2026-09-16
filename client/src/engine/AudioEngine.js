/**
 * Synthesized Web Audio API Sound Engine.
 * Creates procedural game audio without requiring external mp3/wav assets.
 */
export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.volume = 0.5;
    this.muted =
      typeof localStorage !== "undefined"
        ? localStorage.getItem("snake_muted") === "true"
        : false;
  }

  /**
   * Initializes or resumes AudioContext on user interaction
   */
  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtxClass =
        window.AudioContext || window.webkitAudioContext;

      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(
          this.muted ? 0 : this.volume,
          this.ctx.currentTime
        );
        this.masterGain.connect(this.ctx.destination);
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * @returns {boolean}
   */
  isMuted() {
    return this.muted;
  }

  /**
   * @param {number} vol - 0.0 to 1.0
   */
  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        this.muted ? 0 : this.volume,
        this.ctx.currentTime
      );
    }
  }

  /**
   * @returns {boolean}
   */
  toggleMute() {
    this.muted = !this.muted;
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("snake_muted", this.muted.toString());
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(
        this.muted ? 0 : this.volume,
        this.ctx.currentTime
      );
    }
    return this.muted;
  }

  /**
   * Procedural food eat chime
   */
  playEat() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio autoplay fallback
    }
  }

  /**
   * Procedural game over sound
   */
  playDie() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.35);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.38);
    } catch {
      // Ignore
    }
  }

  /**
   * Subtle tick sound on direction change
   */
  playTurn() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(330, now);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Ignore
    }
  }

  /**
   * UI Click Sound
   */
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(660, now);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore
    }
  }

  /**
   * Full-board Victory arpeggio
   */
  playWin() {
    if (this.muted) return;
    this.init();
    if (!this.ctx || !this.masterGain) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.2);
      });
    } catch {
      // Ignore
    }
  }
}

export const audioEngine = new AudioEngine();
