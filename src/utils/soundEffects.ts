// Web Audio API sound effects generator for Birthday Interactive Experience

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Candle blowing sound effect (filtered noise simulating breath + extinguishing chime)
export function playBlowSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // White noise buffer for wind/breath
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.35);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);

    // Chime sparkle
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.4);

    oscGain.gain.setValueAtTime(0.15, now + 0.1);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    osc.start(now + 0.1);
    osc.stop(now + 0.45);
  } catch {
    // Ignore audio context errors if blocked by browser policy until gesture
  }
}

// Balloon pop sound effect
export function playPopSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Sharp burst pitch drop
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  } catch {
    // ignore
  }
}

// Wheel tick click
export function playWheelClickSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch {
    // ignore
  }
}

// Celebratory Fanfare / Cheer Arpeggio
export function playCheerSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.55);
    });
  } catch {
    // ignore
  }
}

// Background melody player using synth (Happy Birthday melody notes)
class SynthMusicPlayer {
  private isPlaying = false;
  private intervalId: number | null = null;
  private noteIndex = 0;

  // Happy Birthday melody frequencies (in Hz)
  private melody = [
    { note: 261.63, dur: 0.3 }, // C4
    { note: 261.63, dur: 0.3 }, // C4
    { note: 293.66, dur: 0.6 }, // D4
    { note: 261.63, dur: 0.6 }, // C4
    { note: 349.23, dur: 0.6 }, // F4
    { note: 329.63, dur: 1.0 }, // E4

    { note: 261.63, dur: 0.3 }, // C4
    { note: 261.63, dur: 0.3 }, // C4
    { note: 293.66, dur: 0.6 }, // D4
    { note: 261.63, dur: 0.6 }, // C4
    { note: 392.00, dur: 0.6 }, // G4
    { note: 349.23, dur: 1.0 }, // F4

    { note: 261.63, dur: 0.3 }, // C4
    { note: 261.63, dur: 0.3 }, // C4
    { note: 523.25, dur: 0.6 }, // C5
    { note: 440.00, dur: 0.6 }, // A4
    { note: 349.23, dur: 0.6 }, // F4
    { note: 329.63, dur: 0.6 }, // E4
    { note: 293.66, dur: 0.8 }, // D4

    { note: 466.16, dur: 0.3 }, // Bb4
    { note: 466.16, dur: 0.3 }, // Bb4
    { note: 440.00, dur: 0.6 }, // A4
    { note: 349.23, dur: 0.6 }, // F4
    { note: 392.00, dur: 0.6 }, // G4
    { note: 349.23, dur: 1.2 }, // F4
  ];

  public start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.noteIndex = 0;
    this.playNextNote();
  }

  private playNextNote = () => {
    if (!this.isPlaying) return;
    try {
      const ctx = getAudioContext();
      const item = this.melody[this.noteIndex];
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine'; // soft music box tone
      osc.frequency.setValueAtTime(item.note, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + item.dur * 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + item.dur);

      this.noteIndex = (this.noteIndex + 1) % this.melody.length;
      const delayMs = item.dur * 1000 + 100;
      this.intervalId = window.setTimeout(this.playNextNote, delayMs);
    } catch {
      this.isPlaying = false;
    }
  };

  public stop() {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const bgMusic = new SynthMusicPlayer();
