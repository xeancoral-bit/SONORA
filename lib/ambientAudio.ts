// Web Audio Ambient Soundscape Engine for Sonora
// Generates procedural ambient audio layers (Rain, Campfire, Waves, Cafe, Vinyl Crackle)
// Completely client-side, zero network overhead, runs alongside any playing track.

export interface SoundscapeState {
  enabled: boolean;
  rain: number;      // 0 to 1
  campfire: number;  // 0 to 1
  waves: number;     // 0 to 1
  cafe: number;      // 0 to 1
  vinyl: number;     // 0 to 1
}

export const DEFAULT_SOUNDSCAPES: SoundscapeState = {
  enabled: false,
  rain: 0,
  campfire: 0,
  waves: 0,
  cafe: 0,
  vinyl: 0,
};

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // Nodes for each layer
  private rainGain: GainNode | null = null;
  private campfireGain: GainNode | null = null;
  private wavesGain: GainNode | null = null;
  private cafeGain: GainNode | null = null;
  private vinylGain: GainNode | null = null;

  // Timers and sources
  private crackleTimer: any = null;
  private vinylTimer: any = null;
  private activeSources: AudioNode[] = [];
  private isInitialized = false;

  private state: SoundscapeState = { ...DEFAULT_SOUNDSCAPES };

  public init() {
    if (typeof window === 'undefined' || this.isInitialized) return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Rain Layer
      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.rainGain.connect(this.masterGain);
      this.setupRain(this.rainGain);

      // Campfire Layer
      this.campfireGain = this.ctx.createGain();
      this.campfireGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.campfireGain.connect(this.masterGain);
      this.setupCampfire(this.campfireGain);

      // Waves Layer
      this.wavesGain = this.ctx.createGain();
      this.wavesGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.wavesGain.connect(this.masterGain);
      this.setupWaves(this.wavesGain);

      // Cafe Layer
      this.cafeGain = this.ctx.createGain();
      this.cafeGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.cafeGain.connect(this.masterGain);
      this.setupCafe(this.cafeGain);

      // Vinyl Layer
      this.vinylGain = this.ctx.createGain();
      this.vinylGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.vinylGain.connect(this.masterGain);
      this.setupVinyl(this.vinylGain);

      this.isInitialized = true;
    } catch (e) {
      console.warn('AmbientSoundEngine: Web Audio not supported or blocked:', e);
    }
  }

  // Create looped white noise buffer
  private createNoiseBuffer(seconds: number = 3): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Setup Rain: Low-pass filtered pinkish noise
  private setupRain(target: GainNode) {
    if (!this.ctx) return;
    const noise = this.createNoiseBuffer(5);
    if (!noise) return;

    const source = this.ctx.createBufferSource();
    source.buffer = noise;
    source.loop = true;

    const filter1 = this.ctx.createBiquadFilter();
    filter1.type = 'lowpass';
    filter1.frequency.setValueAtTime(1100, this.ctx.currentTime);

    const filter2 = this.ctx.createBiquadFilter();
    filter2.type = 'highpass';
    filter2.frequency.setValueAtTime(200, this.ctx.currentTime);

    source.connect(filter1);
    filter1.connect(filter2);
    filter2.connect(target);

    source.start();
    this.activeSources.push(source);
  }

  // Setup Campfire: Warm rumble + random wood crackle pops
  private setupCampfire(target: GainNode) {
    if (!this.ctx) return;
    const noise = this.createNoiseBuffer(4);
    if (!noise) return;

    // Background low fire rumble
    const source = this.ctx.createBufferSource();
    source.buffer = noise;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const rumbleGain = this.ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.4, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(rumbleGain);
    rumbleGain.connect(target);
    source.start();
    this.activeSources.push(source);

    // Random periodic crackle pops
    const triggerCrackle = () => {
      if (!this.ctx || !this.campfireGain || this.state.campfire <= 0.01) {
        this.crackleTimer = setTimeout(triggerCrackle, 300 + Math.random() * 600);
        return;
      }
      try {
        const popDuration = 0.015 + Math.random() * 0.035;
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();
        const popFilter = this.ctx.createBiquadFilter();

        popFilter.type = 'bandpass';
        popFilter.frequency.setValueAtTime(1200 + Math.random() * 2500, this.ctx.currentTime);
        popFilter.Q.setValueAtTime(4 + Math.random() * 4, this.ctx.currentTime);

        popOsc.type = 'sawtooth';
        popOsc.frequency.setValueAtTime(100 + Math.random() * 400, this.ctx.currentTime);

        const now = this.ctx.currentTime;
        popGain.gain.setValueAtTime(0, now);
        popGain.gain.linearRampToValueAtTime(0.35 + Math.random() * 0.45, now + 0.003);
        popGain.gain.exponentialRampToValueAtTime(0.001, now + popDuration);

        popOsc.connect(popFilter);
        popFilter.connect(popGain);
        popGain.connect(target);

        popOsc.start(now);
        popOsc.stop(now + popDuration);
      } catch {}

      this.crackleTimer = setTimeout(triggerCrackle, 120 + Math.random() * 500);
    };

    triggerCrackle();
  }

  // Setup Waves: Slow undulating band-pass noise
  private setupWaves(target: GainNode) {
    if (!this.ctx) return;
    const noise = this.createNoiseBuffer(6);
    if (!noise) return;

    const source = this.ctx.createBufferSource();
    source.buffer = noise;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    // LFO to simulate rolling ocean waves (in/out every ~7s)
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.14, this.ctx.currentTime); // ~7 seconds per cycle

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(250, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(target);

    source.start();
    lfo.start();
    this.activeSources.push(source, lfo);
  }

  // Setup Cafe: Distant murmured warmth and subtle clinks
  private setupCafe(target: GainNode) {
    if (!this.ctx) return;
    const noise = this.createNoiseBuffer(5);
    if (!noise) return;

    const source = this.ctx.createBufferSource();
    source.buffer = noise;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);

    const bodyGain = this.ctx.createGain();
    bodyGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(bodyGain);
    bodyGain.connect(target);

    source.start();
    this.activeSources.push(source);
  }

  // Setup Vinyl: Gentle high-frequency hiss with dusty pops
  private setupVinyl(target: GainNode) {
    if (!this.ctx) return;
    const noise = this.createNoiseBuffer(4);
    if (!noise) return;

    // High hiss
    const source = this.ctx.createBufferSource();
    source.buffer = noise;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(4000, this.ctx.currentTime);

    const hissGain = this.ctx.createGain();
    hissGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(hissGain);
    hissGain.connect(target);
    source.start();
    this.activeSources.push(source);

    // Random tiny vinyl needle clicks
    const triggerVinylTick = () => {
      if (!this.ctx || !this.vinylGain || this.state.vinyl <= 0.01) {
        this.vinylTimer = setTimeout(triggerVinylTick, 200 + Math.random() * 400);
        return;
      }
      try {
        const tickBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.005), this.ctx.sampleRate);
        const tickData = tickBuffer.getChannelData(0);
        for (let i = 0; i < tickData.length; i++) {
          tickData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (tickData.length * 0.3));
        }

        const tickSource = this.ctx.createBufferSource();
        tickSource.buffer = tickBuffer;

        const tickGain = this.ctx.createGain();
        const now = this.ctx.currentTime;
        tickGain.gain.setValueAtTime(0.15 + Math.random() * 0.25, now);

        tickSource.connect(tickGain);
        tickGain.connect(target);

        tickSource.start(now);
      } catch {}

      this.vinylTimer = setTimeout(triggerVinylTick, 80 + Math.random() * 350);
    };

    triggerVinylTick();
  }

  public updateLayer(layer: keyof SoundscapeState, value: number | boolean) {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (layer === 'enabled') {
      this.state.enabled = Boolean(value);
    } else {
      (this.state as any)[layer] = Number(value);
    }

    const isEngaged = this.state.enabled;
    const now = this.ctx ? this.ctx.currentTime : 0;

    const setGain = (node: GainNode | null, vol: number) => {
      if (!node || !this.ctx) return;
      const targetVol = isEngaged ? vol : 0;
      node.gain.setTargetAtTime(targetVol, now, 0.05);
    };

    setGain(this.rainGain, this.state.rain);
    setGain(this.campfireGain, this.state.campfire);
    setGain(this.wavesGain, this.state.waves);
    setGain(this.cafeGain, this.state.cafe);
    setGain(this.vinylGain, this.state.vinyl);

    try {
      localStorage.setItem('sonora_soundscape_settings', JSON.stringify(this.state));
    } catch {}
  }

  public getState(): SoundscapeState {
    return { ...this.state };
  }

  public loadSavedState(): SoundscapeState {
    try {
      const saved = localStorage.getItem('sonora_soundscape_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = { ...DEFAULT_SOUNDSCAPES, ...parsed };
      }
    } catch {}
    return this.state;
  }
}

export const ambientEngine = new AmbientSoundEngine();
