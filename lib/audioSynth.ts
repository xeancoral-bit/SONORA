// Web Audio Synthesizer Engine for SONORA
// Generates ambient, lofi, electronic, pop, and chill procedural audio for previewing any song seamlessly

export class SonoraSynthEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private intervalId: any = null;
  private preset: string = 'chill';
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private step = 0;
  private bpm = 85;

  private chordProgressions: Record<string, number[][]> = {
    chill: [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23]  // G7
    ],
    lofi: [
      [220.00, 261.63, 329.63, 392.00], // Am7
      [293.66, 349.23, 440.00, 523.25], // Dm7
      [196.00, 246.94, 293.66, 349.23], // G7
      [261.63, 329.63, 392.00, 493.88]  // Cmaj7
    ],
    electronic: [
      [130.81, 164.81, 196.00, 261.63], // C3 synth
      [146.83, 174.61, 220.00, 293.66], // D3 synth
      [110.00, 130.81, 164.81, 220.00], // A2 synth
      [174.61, 220.00, 261.63, 349.23]  // F3 synth
    ],
    pop: [
      [261.63, 329.63, 392.00], // C
      [196.00, 246.94, 293.66], // G
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 261.63]  // F
    ],
    rnb: [
      [164.81, 220.00, 261.63, 329.63], // E min9
      [146.83, 196.00, 246.94, 293.66], // D min9
      [130.81, 174.61, 220.00, 261.63], // C maj9
      [123.47, 164.81, 196.00, 246.94]  // B min7
    ],
    acoustic: [
      [196.00, 246.94, 293.66, 392.00], // G
      [164.81, 196.00, 246.94, 329.63], // Em
      [174.61, 220.00, 261.63, 349.23], // F
      [130.81, 164.81, 196.00, 261.63]  // C
    ]
  };

  public init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)) * 0.4, this.ctx.currentTime);
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public play(preset: string = 'chill', bpm = 85) {
    this.init();
    if (!this.ctx || !this.masterGain) return;
    this.preset = this.chordProgressions[preset] ? preset : 'chill';
    this.bpm = bpm;
    this.isPlaying = true;
    this.step = 0;

    if (this.intervalId) clearInterval(this.intervalId);

    const stepTimeMs = (60 / this.bpm / 2) * 1000;
    this.triggerBeat();
    this.intervalId = setInterval(() => {
      if (this.isPlaying) {
        this.step++;
        this.triggerBeat();
      }
    }, stepTimeMs);
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private triggerBeat() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const chords = this.chordProgressions[this.preset] || this.chordProgressions.chill;
    const currentChordIndex = Math.floor(this.step / 8) % chords.length;
    const chord = chords[currentChordIndex];

    // Play chord pad on bar start
    if (this.step % 8 === 0) {
      chord.forEach((freq, i) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = this.preset === 'electronic' ? 'sawtooth' : 'sine';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(this.preset === 'electronic' ? 1200 : 800, now);
        filter.frequency.exponentialRampToValueAtTime(300, now + 3.0);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.08 / (i + 1), now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 3.0);
      });

      // Bass note
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(chord[0] / 2, now);
      bassGain.gain.setValueAtTime(0.15, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      bassOsc.connect(bassGain);
      bassGain.connect(this.masterGain);
      bassOsc.start(now);
      bassOsc.stop(now + 2.0);
    }

    // Melodic pulse / arpeggio
    if (this.step % 2 === 0) {
      const noteIndex = (this.step / 2) % chord.length;
      const noteFreq = chord[noteIndex] * (this.preset === 'electronic' ? 2 : 1.5);

      const leadOsc = this.ctx.createOscillator();
      const leadGain = this.ctx.createGain();
      leadOsc.type = this.preset === 'lofi' ? 'triangle' : 'sine';
      leadOsc.frequency.setValueAtTime(noteFreq, now);

      leadGain.gain.setValueAtTime(0.04, now);
      leadGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      leadOsc.connect(leadGain);
      leadGain.connect(this.masterGain);
      leadOsc.start(now);
      leadOsc.stop(now + 0.4);
    }

    // Soft click/kick rhythm
    if (this.step % 4 === 0) {
      const kickOsc = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kickOsc.frequency.setValueAtTime(120, now);
      kickOsc.frequency.exponentialRampToValueAtTime(30, now + 0.08);
      kickGain.gain.setValueAtTime(0.1, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      kickOsc.connect(kickGain);
      kickGain.connect(this.masterGain);
      kickOsc.start(now);
      kickOsc.stop(now + 0.1);
    }
  }
}

export const synthEngine = typeof window !== 'undefined' ? new SonoraSynthEngine() : null;
