/**
 * AudioEngine
 * ───────────
 * A music-box rendition of the traditional "Happy Birthday" melody
 * (public domain), with a gentle waltz accompaniment that swells as the
 * celebration progresses — plus the interaction sound effects.
 *
 * No audio file required, which keeps the GitHub repo light and avoids any
 * music licensing question. If you drop your own track in, it takes over
 * the melody and the synth steps back to a soft underlay.
 *
 * Everything is gesture-gated: nothing makes noise until start() is called
 * from a real user interaction (browser autoplay policy).
 */

/* Note frequencies (equal temperament, A4 = 440Hz) */
const N = {
  G2: 98.0,
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  F3: 174.61,
  G3: 196.0,
  A3: 220.0,
  B3: 246.94,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.0,
  A4: 440.0,
  B4: 493.88,
  C5: 523.25,
  D5: 587.33,
  E5: 659.25,
  F5: 698.46,
  G5: 783.99,
};

/**
 * "Happy Birthday to You" — traditional melody, public domain.
 * [frequency | null for a rest, duration in beats]. 3/4 time.
 */
const MELODY = [
  // Happy birthday to you
  [N.G4, 0.75], [N.G4, 0.25], [N.A4, 1], [N.G4, 1], [N.C5, 1], [N.B4, 2],
  // Happy birthday to you
  [N.G4, 0.75], [N.G4, 0.25], [N.A4, 1], [N.G4, 1], [N.D5, 1], [N.C5, 2],
  // Happy birthday dear ...
  [N.G4, 0.75], [N.G4, 0.25], [N.G5, 1], [N.E5, 1], [N.C5, 1], [N.B4, 1], [N.A4, 1],
  // Happy birthday to you
  [N.F5, 0.75], [N.F5, 0.25], [N.E5, 1], [N.C5, 1], [N.D5, 1], [N.C5, 2],
  // a breath before it comes round again
  [null, 3],
];

/** One chord per 3-beat bar, following the melody's harmony. */
const CHORDS = [
  [N.C3, N.G3, N.C4, N.E4], // C
  [N.G2, N.D3, N.G3, N.B3], // G7
  [N.G2, N.D3, N.G3, N.B3], // G7
  [N.C3, N.G3, N.C4, N.E4], // C
  [N.C3, N.G3, N.C4, N.E4], // C
  [N.F3, N.C4, N.F4, N.A3], // F
  [N.C3, N.G3, N.C4, N.E4], // C
  [N.G2, N.D3, N.G3, N.B3], // G7
  [N.C3, N.G3, N.C4, N.E4], // C (under the rest)
];

const BEATS_PER_BAR = 3;

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.melodyGain = null;
    this.chordGain = null;
    this.fileGain = null;
    this.audioEl = null;
    this.fileReady = false;
    this.muted = false;
    this.intensity = 0.3;
    this.started = false;

    this._schedTimer = null;
    this._noteTime = 0;
    this._noteIndex = 0;
    this._barTime = 0;
    this._barIndex = 0;
  }

  /** Lazily build the graph on first gesture. */
  start(fileSrc, startMuted) {
    if (this.started) return;
    this.started = true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC();

    this.master = this.ctx.createGain();
    this.master.gain.value = startMuted ? 0 : 0.9;
    this.master.connect(this.ctx.destination);
    this.muted = !!startMuted;

    // A touch of air so the music box doesn't sound bone dry.
    this.reverb = this.ctx.createConvolver();
    this.reverb.buffer = this._impulse(1.8, 2.2);
    this.reverbGain = this.ctx.createGain();
    this.reverbGain.gain.value = 0.28;
    this.reverb.connect(this.reverbGain).connect(this.master);

    this.melodyGain = this.ctx.createGain();
    this.melodyGain.gain.value = 0.5;
    this.melodyGain.connect(this.master);
    this.melodyGain.connect(this.reverb);

    this.chordGain = this.ctx.createGain();
    this.chordGain.gain.value = 0.16;
    this.chordGain.connect(this.master);
    this.chordGain.connect(this.reverb);

    this._startScheduler();
    if (fileSrc) this._tryLoadFile(fileSrc);
    this.setIntensity(this.intensity);
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    if (this.fileReady && this.audioEl && !this.muted) {
      this.audioEl.play().catch(() => {});
    }
  }

  /** Short synthetic impulse response for a soft hall. */
  _impulse(duration, decay) {
    const rate = this.ctx.sampleRate;
    const len = Math.floor(rate * duration);
    const buf = this.ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      }
    }
    return buf;
  }

  _tryLoadFile(src) {
    const el = new Audio();
    el.src = src;
    el.loop = true;
    el.preload = 'auto';
    el.crossOrigin = 'anonymous';
    el.addEventListener('canplaythrough', () => {
      if (this.fileReady) return;
      try {
        const node = this.ctx.createMediaElementSource(el);
        this.fileGain = this.ctx.createGain();
        this.fileGain.gain.value = 0.85;
        node.connect(this.fileGain).connect(this.master);
        this.fileReady = true;
        // Your track carries the tune — fade the synth out of the way.
        this.melodyGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
        this.chordGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.5);
        if (!this.muted) el.play().catch(() => {});
      } catch {
        /* keep the synth score */
      }
    });
    el.addEventListener('error', () => {
      /* no file — the music box is already playing */
    });
    this.audioEl = el;
  }

  /** Tempo lifts a little as the celebration builds. */
  _beatDur() {
    const bpm = 104 + this.intensity * 26;
    return 60 / bpm;
  }

  /** A struck music-box / celeste tone: bright attack, long ringing tail. */
  _musicBox(freq, time, beatDur, gainNode, level = 0.3) {
    const dur = Math.min(beatDur * 2.2, 2.4);
    const partials = [
      { ratio: 1, gain: 1, type: 'sine' },
      { ratio: 2, gain: 0.38, type: 'sine' },
      { ratio: 3.01, gain: 0.12, type: 'triangle' },
      { ratio: 5.03, gain: 0.05, type: 'sine' },
    ];
    partials.forEach((p) => {
      const osc = this.ctx.createOscillator();
      osc.type = p.type;
      osc.frequency.value = freq * p.ratio;
      const g = this.ctx.createGain();
      const peak = level * p.gain;
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(peak, time + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
      osc.connect(g).connect(gainNode);
      osc.start(time);
      osc.stop(time + dur + 0.05);
    });
  }

  /** Soft sustained chord bed under the melody. */
  _chord(freqs, time, barDur) {
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      osc.type = i === 0 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      osc.detune.value = (i - 1.5) * 3;
      const g = this.ctx.createGain();
      const peak = 0.2 / freqs.length;
      g.gain.setValueAtTime(0.0001, time);
      g.gain.exponentialRampToValueAtTime(peak, time + barDur * 0.25);
      g.gain.exponentialRampToValueAtTime(0.0001, time + barDur * 1.05);
      osc.connect(g).connect(this.chordGain);
      osc.start(time);
      osc.stop(time + barDur * 1.1);
    });
  }

  /** Look-ahead scheduler driving two clocks: melody notes and bar chords. */
  _startScheduler() {
    const startAt = this.ctx.currentTime + 0.15;
    this._noteTime = startAt;
    this._barTime = startAt;
    this._noteIndex = 0;
    this._barIndex = 0;

    const LOOKAHEAD_MS = 25;
    const HORIZON = 0.35;

    this._schedTimer = setInterval(() => {
      if (!this.ctx || this.fileReady) return;
      const now = this.ctx.currentTime;
      const beat = this._beatDur();

      while (this._noteTime < now + HORIZON) {
        const [freq, beats] = MELODY[this._noteIndex % MELODY.length];
        if (freq) {
          this._musicBox(freq, this._noteTime, beat, this.melodyGain, 0.3);
          // An octave sparkle on top once the celebration is in full swing.
          if (this.intensity > 0.75) {
            this._musicBox(freq * 2, this._noteTime, beat, this.melodyGain, 0.07);
          }
        }
        this._noteTime += beats * beat;
        this._noteIndex += 1;
      }

      while (this._barTime < now + HORIZON) {
        const barDur = BEATS_PER_BAR * beat;
        this._chord(CHORDS[this._barIndex % CHORDS.length], this._barTime, barDur);
        this._barTime += barDur;
        this._barIndex += 1;
      }
    }, LOOKAHEAD_MS);
  }

  setIntensity(v) {
    this.intensity = Math.max(0, Math.min(1, v));
    if (!this.ctx || this.fileReady) return;
    const t = this.ctx.currentTime;
    this.melodyGain.gain.setTargetAtTime(0.34 + this.intensity * 0.5, t, 0.7);
    this.chordGain.gain.setTargetAtTime(0.08 + this.intensity * 0.22, t, 0.7);
  }

  setMuted(m) {
    this.muted = m;
    if (!this.ctx) return;
    this.master.gain.setTargetAtTime(m ? 0 : 0.9, this.ctx.currentTime, 0.25);
    if (this.audioEl) {
      if (m) this.audioEl.pause();
      else if (this.fileReady) this.audioEl.play().catch(() => {});
    }
  }

  /* ── Sound effects ─────────────────────────────────────────── */

  _env(node, time, peak, attack, release) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(peak, time + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, time + attack + release);
    node.connect(g).connect(this.master);
    return g;
  }

  _tone(freq, time, { type = 'sine', peak = 0.2, attack = 0.01, release = 0.3, glideTo } = {}) {
    if (!this.ctx || this.muted) return;
    const osc = this.ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, time + attack + release);
    this._env(osc, time, peak, attack, release);
    osc.start(time);
    osc.stop(time + attack + release + 0.05);
  }

  _noise(time, { peak = 0.25, release = 0.4, filterFreq = 1200, type = 'lowpass' } = {}) {
    if (!this.ctx || this.muted) return;
    const dur = release + 0.1;
    const buffer = this.ctx.createBuffer(1, this.ctx.sampleRate * dur, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = filterFreq;
    src.connect(filter);
    this._env(filter, time, peak, 0.005, release);
    src.start(time);
    src.stop(time + dur);
  }

  play(name) {
    if (!this.ctx || this.muted) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const t = this.ctx.currentTime;
    switch (name) {
      case 'click':
        this._tone(880, t, { type: 'sine', peak: 0.15, attack: 0.005, release: 0.12 });
        this._tone(1320, t + 0.02, { type: 'sine', peak: 0.08, attack: 0.005, release: 0.14 });
        break;
      case 'lights':
        [523, 659, 784, 1046].forEach((f, i) =>
          this._tone(f, t + i * 0.09, { type: 'triangle', peak: 0.14, attack: 0.01, release: 0.4 })
        );
        break;
      case 'balloons':
        this._tone(300, t, { type: 'sine', peak: 0.18, attack: 0.02, release: 0.5, glideTo: 900 });
        this._noise(t, { peak: 0.08, release: 0.5, filterFreq: 900 });
        break;
      case 'cake':
        [261, 329, 392].forEach((f, i) =>
          this._tone(f, t + i * 0.04, { type: 'sine', peak: 0.2, attack: 0.03, release: 0.9 })
        );
        break;
      case 'candle':
        this._noise(t, { peak: 0.06, release: 0.25, filterFreq: 2600, type: 'bandpass' });
        break;
      case 'wish':
        this._tone(1046, t, { type: 'sine', peak: 0.22, attack: 0.005, release: 1.1 });
        this._tone(1568, t, { type: 'sine', peak: 0.09, attack: 0.005, release: 0.9 });
        this._tone(2093, t + 0.01, { type: 'sine', peak: 0.05, attack: 0.005, release: 0.7 });
        break;
      case 'firework':
        this._tone(90, t, { type: 'sine', peak: 0.28, attack: 0.005, release: 0.18 });
        this._noise(t + 0.04, { peak: 0.3, release: 0.6, filterFreq: 3200, type: 'highpass' });
        break;
      case 'sparkle':
        this._tone(1760, t, { type: 'sine', peak: 0.06, attack: 0.005, release: 0.3 });
        break;
      default:
        break;
    }
  }

  destroy() {
    if (this._schedTimer) clearInterval(this._schedTimer);
    if (this.audioEl) this.audioEl.pause();
    if (this.ctx) this.ctx.close();
  }
}
