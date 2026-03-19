let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playNote(ctx, freq, startTime, duration, gain = 0.15) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  osc.type = 'sine';
  osc.frequency.value = freq;

  filter.type = 'lowpass';
  filter.frequency.value = 2000;

  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.05);
  gainNode.gain.setValueAtTime(gain, startTime + duration - 0.1);
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration);

  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

const melody = [
  262, 262, 392, 392, 440, 440, 392, null,
  349, 349, 330, 330, 294, 294, 262, null,
  392, 392, 349, 349, 330, 330, 294, null,
  392, 392, 349, 349, 330, 330, 294, null,
  262, 262, 392, 392, 440, 440, 392, null,
  349, 349, 330, 330, 294, 294, 262, null,
];

const tempo = 0.45;
let lullabyTimer = null;
let lullabyGain = null;

function scheduleLullaby(ctx, gainNode, startTime) {
  melody.forEach((freq, i) => {
    if (freq) {
      const osc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.value = freq;
      filter.type = 'lowpass';
      filter.frequency.value = 2000;

      const isHeld = i % 8 === 6;
      const dur = isHeld ? tempo * 1.8 : tempo * 0.9;
      const t = startTime + i * tempo;

      noteGain.gain.setValueAtTime(0, t);
      noteGain.gain.linearRampToValueAtTime(0.12, t + 0.05);
      noteGain.gain.setValueAtTime(0.12, t + dur - 0.1);
      noteGain.gain.linearRampToValueAtTime(0, t + dur);

      osc.connect(filter);
      filter.connect(noteGain);
      noteGain.connect(gainNode);

      osc.start(t);
      osc.stop(t + dur);
    }
  });
}

export function playLullaby() {
  stopLullaby();

  const ctx = getAudioContext();
  const songDuration = melody.length * tempo;
  const gap = 1.5;

  lullabyGain = ctx.createGain();
  lullabyGain.connect(ctx.destination);

  let nextStart = ctx.currentTime;
  scheduleLullaby(ctx, lullabyGain, nextStart);

  lullabyTimer = setInterval(() => {
    const now = ctx.currentTime;
    if (now >= nextStart + songDuration - 1) {
      nextStart = nextStart + songDuration + gap;
      scheduleLullaby(ctx, lullabyGain, nextStart);
    }
  }, 500);
}

export function stopLullaby() {
  if (lullabyTimer) {
    clearInterval(lullabyTimer);
    lullabyTimer = null;
  }
  if (lullabyGain) {
    lullabyGain.disconnect();
    lullabyGain = null;
  }
}

export function setLullabyVolume(vol) {
  if (lullabyGain) {
    lullabyGain.gain.setValueAtTime(vol, getAudioContext().currentTime);
  }
}

// Pre-generate a reusable noise buffer so each click is instant
let noiseBuffer = null;

function getNoiseBuffer(ctx) {
  if (!noiseBuffer) {
    const duration = 1.2;
    const size = ctx.sampleRate * duration;
    noiseBuffer = ctx.createBuffer(1, size, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < size; i++) {
      data[i] = Math.random() * 2 - 1;
    }
  }
  return noiseBuffer;
}

export function playPageTurn() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  const duration = 0.8;

  // Noise source — a new source node each time, but reuses the buffer
  const source = ctx.createBufferSource();
  source.buffer = getNoiseBuffer(ctx);

  // Soft bandpass to get a papery rustle
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.value = 1200;
  bandpass.Q.value = 0.4;

  // Sweep the filter frequency upward to simulate the arc of a page flip
  bandpass.frequency.setValueAtTime(600, now);
  bandpass.frequency.linearRampToValueAtTime(1800, now + duration * 0.4);
  bandpass.frequency.linearRampToValueAtTime(900, now + duration);

  // Gentle volume envelope: fade in, sustain, fade out
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
  gainNode.gain.setValueAtTime(0.15, now + duration * 0.3);
  gainNode.gain.linearRampToValueAtTime(0.08, now + duration * 0.6);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  source.connect(bandpass);
  bandpass.connect(gainNode);
  gainNode.connect(ctx.destination);

  source.start(now);
  source.stop(now + duration);
}

export function speakAsGandalf(text) {
  return new Promise((resolve) => {
    const synth = window.speechSynthesis;
    // Cancel anything currently speaking
    synth.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.65;
    utter.pitch = 0.3;
    utter.volume = 1.0;

    // Try to find the deepest/most dramatic male voice available
    function pickVoice() {
      const voices = synth.getVoices();
      const prefs = ['male', 'david', 'james', 'daniel', 'george', 'richard'];
      for (const pref of prefs) {
        const match = voices.find(
          (v) => v.name.toLowerCase().includes(pref) && v.lang.startsWith('en')
        );
        if (match) return match;
      }
      // Fallback: any English voice
      return voices.find((v) => v.lang.startsWith('en')) || voices[0];
    }

    const voices = synth.getVoices();
    if (voices.length > 0) {
      utter.voice = pickVoice();
      utter.onend = resolve;
      synth.speak(utter);
    } else {
      // Voices load asynchronously in some browsers
      synth.addEventListener('voiceschanged', () => {
        utter.voice = pickVoice();
        utter.onend = resolve;
        synth.speak(utter);
      }, { once: true });
    }
  });
}
