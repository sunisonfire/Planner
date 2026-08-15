// Web Audio API synthesized sound effects (zero external assets, zero lag)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const SoundEngine = {
  // Gentle UI Click / Tap
  playClick: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // safe fallback
    }
  },

  // Switch / Toggle / Pop sound
  playPop: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(760, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // safe fallback
    }
  },

  // Task Completion / Goal Step Success (pleasant melodic 3-tone chime)
  playSuccess: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.06);

        const startTime = ctx.currentTime + index * 0.06;
        const endTime = startTime + 0.18;

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.08, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(endTime);
      });
    } catch {
      // safe fallback
    }
  },

  // Delete / Reset (soft downward swoop)
  playDelete: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // safe fallback
    }
  },

  // Navigation tab change sound
  playTab: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch {
      // safe fallback
    }
  },

  // Grand celebration fanfare (100% goal, full backup restore)
  playCelebration: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // Chord progression arpeggio: C5 -> E5 -> G5 -> C6
      const fanfare = [523.25, 659.25, 783.99, 1046.50];
      fanfare.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

        const startTime = ctx.currentTime + index * 0.08;
        const duration = index === fanfare.length - 1 ? 0.35 : 0.18;
        const endTime = startTime + duration;

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.1, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, endTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(endTime);
      });
    } catch {
      // safe fallback
    }
  },

  // Soft Pomodoro Clock Tick
  playTimerTick: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.015);

      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.015);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.015);
    } catch {
      // safe fallback
    }
  },

  // Pomodoro Interval Complete Chime (Tibetan bell / Zen harmony)
  playTimerComplete: (enabled: boolean = true) => {
    if (!enabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // 3 Zen bells harmonic chords: E5, B5, E6
      const bells = [659.25, 987.77, 1318.51];
      bells.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.12);

        const startTime = ctx.currentTime + index * 0.12;
        const endTime = startTime + 1.6;

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(endTime);
      });
    } catch {
      // safe fallback
    }
  },
};

// Ambient Sound Generator (synthesized Web Audio for pure zero-asset focus)
let ambientNode: AudioNode | null = null;
let ambientGainNode: GainNode | null = null;

export const AmbientSound = {
  start: (type: 'rain' | 'whitenoise' | 'binaural', volume = 0.3) => {
    try {
      AmbientSound.stop();
      const ctx = getAudioContext();
      if (!ctx) return;

      ambientGainNode = ctx.createGain();
      ambientGainNode.gain.setValueAtTime(0.001, ctx.currentTime);
      ambientGainNode.gain.linearRampToValueAtTime(Math.min(volume * 0.15, 0.15), ctx.currentTime + 0.5);
      ambientGainNode.connect(ctx.destination);

      if (type === 'binaural') {
        // Binaural 40Hz Gamma Focus Frequency (432Hz left, 472Hz right)
        const merger = ctx.createChannelMerger(2);

        const oscL = ctx.createOscillator();
        oscL.type = 'sine';
        oscL.frequency.setValueAtTime(216, ctx.currentTime);

        const oscR = ctx.createOscillator();
        oscR.type = 'sine';
        oscR.frequency.setValueAtTime(256, ctx.currentTime); // 40Hz binaural beat

        oscL.connect(merger, 0, 0);
        oscR.connect(merger, 0, 1);
        merger.connect(ambientGainNode);

        oscL.start();
        oscR.start();
        ambientNode = merger;
      } else {
        // Synthesized noise buffer (White noise or Rain filter)
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = buffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'rain') {
            // Pink/Brown noise filter simulation for rain drops
            output[i] = (lastOut + 0.02 * white) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
          } else {
            output[i] = white * 0.4;
          }
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = buffer;
        whiteNoise.loop = true;

        if (type === 'rain') {
          // Low-pass filter for cozy rainfall effect
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(900, ctx.currentTime);
          whiteNoise.connect(filter);
          filter.connect(ambientGainNode);
          ambientNode = filter;
        } else {
          whiteNoise.connect(ambientGainNode);
          ambientNode = whiteNoise;
        }

        whiteNoise.start();
      }
    } catch {
      // safe fallback
    }
  },

  stop: () => {
    try {
      if (ambientGainNode && audioCtx) {
        ambientGainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
        setTimeout(() => {
          if (ambientNode) {
            ambientNode.disconnect();
            ambientNode = null;
          }
          if (ambientGainNode) {
            ambientGainNode.disconnect();
            ambientGainNode = null;
          }
        }, 350);
      }
    } catch {
      // safe fallback
    }
  },
};
