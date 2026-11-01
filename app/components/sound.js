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
  scan() { tone({ freq: 1760, dur: .05, gain: .025, type: "square" }); },
  alert() { tone({ freq: 330, dur: .12, gain: .05, type: "square" }); tone({ freq: 262, delay: .12, dur: .16, gain: .05, type: "square" }); },
  fix() { tone({ freq: 880, dur: .08, gain: .05 }); tone({ freq: 1318.5, delay: .07, dur: .14, gain: .05 }); },
  stamp() { noise({ dur: .05, gain: .16, filter: "lowpass", freq: 600 + Math.random() * 250 }); tone({ freq: 105 + Math.random() * 30, to: 55, dur: .2, gain: .22 }); },
  type(i = 0) { noise({ dur: .018, gain: .11, filter: "bandpass", freq: 1500 + (i % 5) * 180, q: 1.1 }); tone({ freq: 120 + (i % 3) * 14, to: 70, dur: .045, gain: .05 }); },
  bell() { tone({ freq: 2093, dur: .7, gain: .05, attack: .002 }); tone({ freq: 2637, delay: .005, dur: .5, gain: .025 }); },
  flip() { noise({ dur: .14, gain: .06, filter: "bandpass", freq: 1200, q: .5 }); noise({ delay: .08, dur: .1, gain: .05, filter: "bandpass", freq: 2200, q: .5 }); },
  clip() { noise({ dur: .012, gain: .1, filter: "highpass", freq: 3500 }); tone({ freq: 1900, dur: .03, gain: .03, type: "square" }); },
  tear() { for (let i = 0; i < 9; i++) noise({ delay: i * .018, dur: .016, gain: .05 + (i % 3) * .015, filter: "highpass", freq: 2500 + (i % 4) * 500 }); },
  thump() { tone({ freq: 92, to: 42, dur: .26, gain: .3 }); noise({ dur: .06, gain: .16, filter: "lowpass", freq: 520 }); tone({ freq: 360 + Math.random() * 40, to: 250, dur: .05, gain: .06, type: "triangle" }); },
  springStamp() { noise({ dur: .012, gain: .09, filter: "highpass", freq: 3200 }); tone({ freq: 2300, dur: .018, gain: .025, type: "square" }); noise({ delay: .05, dur: .07, gain: .05, filter: "bandpass", freq: 1700, q: 2 }); noise({ delay: .15, dur: .03, gain: .14, filter: "lowpass", freq: 900 }); tone({ freq: 170, to: 85, delay: .15, dur: .1, gain: .12 }); tone({ freq: 480, to: 760, delay: .26, dur: .14, gain: .035, type: "triangle" }); tone({ freq: 1870, delay: .27, dur: .3, gain: .015 }); noise({ delay: .3, dur: .02, gain: .06, filter: "highpass", freq: 2800 }); },
  springPick() { noise({ dur: .015, gain: .07, filter: "highpass", freq: 3000 }); tone({ freq: 620, to: 820, dur: .09, gain: .025, type: "triangle" }); },
  pick() { noise({ dur: .03, gain: .07, filter: "lowpass", freq: 900 }); tone({ freq: 240, to: 180, dur: .08, gain: .05, type: "triangle" }); },
  print(n = 8) { for (let i = 0; i < n; i++) noise({ delay: i * .045, dur: .025, gain: .05, filter: "bandpass", freq: 2400 + (i % 2) * 400, q: 2 }); },
  drop(i = 0) { tone({ freq: 520 - i * 60, to: 260 - i * 30, dur: .12, gain: .06, type: "triangle", delay: i * .09 }); },
  block(i = 0) { noise({ delay: i * .11, dur: .03, gain: .08, filter: "lowpass", freq: 1400 }); tone({ freq: 392 + i * 98, delay: i * .11, dur: .08, gain: .04 }); },
  plug() { noise({ dur: .02, gain: .12, filter: "bandpass", freq: 1500, q: 1.5 }); tone({ freq: 180, to: 120, dur: .07, gain: .1 }); },
  buzz() { tone({ freq: 110, dur: .28, gain: .07, type: "sawtooth" }); },
  lever() { noise({ dur: .08, gain: .1, filter: "lowpass", freq: 600 }); tone({ freq: 200, to: 420, dur: .25, gain: .06, type: "triangle" }); },
  coinFlip() { tone({ freq: 2400, to: 3100, dur: .09, gain: .03, type: "triangle" }); noise({ dur: .02, gain: .04, filter: "highpass", freq: 5000 }); },
  coinLand() { tone({ freq: 2637, dur: .5, gain: .035, type: "triangle" }); tone({ freq: 3520, delay: .015, dur: .35, gain: .022 }); noise({ dur: .02, gain: .05, filter: "bandpass", freq: 3200, q: 2 }); },
};
