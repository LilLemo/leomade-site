"use client";

// Tiny synthesized sounds, no audio files. Quiet on purpose; only ever played after a click.
let ctx = null;
const MASTER = .55;

function audio() {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch { return null; }
}

function tone({ freq, to, type = "sine", dur = .12, gain = .1, delay = 0, attack = .004 }) {
  const a = audio(); if (!a) return;
  const t = a.currentTime + delay;
  const osc = a.createOscillator(), amp = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + dur);
  amp.gain.setValueAtTime(.0001, t);
  amp.gain.linearRampToValueAtTime(gain * MASTER, t + attack);
  amp.gain.exponentialRampToValueAtTime(.0001, t + dur);
  osc.connect(amp).connect(a.destination);
  osc.start(t); osc.stop(t + dur + .02);
}

function noise({ dur = .03, gain = .08, filter = "highpass", freq = 2000, q = .8, delay = 0 }) {
  const a = audio(); if (!a) return;
  const t = a.currentTime + delay;
  const length = Math.max(1, Math.floor(a.sampleRate * dur));
  const buffer = a.createBuffer(1, length, a.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const src = a.createBufferSource(), f = a.createBiquadFilter(), amp = a.createGain();
  src.buffer = buffer;
  f.type = filter; f.frequency.value = freq; f.Q.value = q;
  amp.gain.value = gain * MASTER;
  src.connect(f).connect(amp).connect(a.destination);
  src.start(t);
}

export const sfx = {
  poke() { tone({ freq: 460, to: 190, dur: .14, gain: .1 }); noise({ dur: .02, gain: .04, filter: "lowpass", freq: 1200 }); },
  pop() { tone({ freq: 320, to: 720, dur: .16, gain: .09, type: "triangle" }); },
  bigDown() { noise({ dur: .025, gain: .12, filter: "bandpass", freq: 1700, q: 1.2 }); tone({ freq: 150, to: 70, dur: .17, gain: .2 }); },
  bigUp() { noise({ dur: .015, gain: .05, filter: "highpass", freq: 2600 }); },
  key(i = 0) { noise({ dur: .016, gain: .1, filter: "highpass", freq: 3000 + i * 450 }); tone({ freq: 1800 + i * 160, dur: .02, gain: .025, type: "square" }); noise({ delay: .04, dur: .012, gain: .05, filter: "highpass", freq: 4200 }); },
  clack(on) { noise({ dur: .045, gain: .14, filter: "lowpass", freq: 900 }); tone({ freq: on ? 520 : 290, dur: .05, gain: .045, type: "square" }); if (on) tone({ freq: 880, delay: .09, dur: .14, gain: .035 }); },
  floor() { noise({ dur: .012, gain: .06, filter: "highpass", freq: 2600 }); tone({ freq: 1250, dur: .05, gain: .035 }); },
  ding() { tone({ freq: 1318.5, dur: 1.2, gain: .07, attack: .006 }); tone({ freq: 1046.5, delay: .2, dur: 1.4, gain: .07, attack: .006 }); },
  lightSwitch() { noise({ dur: .01, gain: .13, filter: "highpass", freq: 2200 }); noise({ delay: .028, dur: .022, gain: .09, filter: "bandpass", freq: 1300, q: 1.4 }); tone({ freq: 95, to: 60, delay: .028, dur: .06, gain: .08 }); },
  metro() { tone({ freq: 784, dur: .45, gain: .06, attack: .01 }); tone({ freq: 659.3, delay: .22, dur: .55, gain: .06, attack: .01 }); tone({ freq: 523.3, delay: .44, dur: .8, gain: .06, attack: .01 }); },
  coinFlip() { tone({ freq: 2400, to: 3100, dur: .09, gain: .03, type: "triangle" }); noise({ dur: .02, gain: .04, filter: "highpass", freq: 5000 }); },
  coinLand() { tone({ freq: 2637, dur: .5, gain: .035, type: "triangle" }); tone({ freq: 3520, delay: .015, dur: .35, gain: .022 }); noise({ dur: .02, gain: .05, filter: "bandpass", freq: 3200, q: 2 }); },
};
