// Synthesizes the two placeholder music loops in assets/audio (no samples, no licenses involved).
// Hopeful and moving rather than ambient: a I–V–vi–IV progression with a warm pad, plucked-string
// arpeggios, a soft bass line and light percussion, all in one seamless loop. Swap in final music by
// replacing music-reveal.wav and music-life.wav. Run: node scripts/make-music.mjs
import fs from 'node:fs';
import path from 'node:path';

const RATE = 32000;
const OUT = path.join('assets', 'audio');

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

/** Deterministic noise, so the files only change when the music does. */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return (((t ^ (t >>> 14)) >>> 0) / 4294967296) * 2 - 1;
  };
}

function writeWav(name, samples) {
  const data = Buffer.alloc(samples.length * 2);
  let peak = 0;
  for (const s of samples) peak = Math.max(peak, Math.abs(s));
  const gain = peak > 0 ? 0.85 / peak : 1;
  samples.forEach((s, i) => data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s * gain)) * 32767), i * 2));
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVEfmt ', 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);
  fs.writeFileSync(path.join(OUT, name), Buffer.concat([header, data]));
  console.log(name, `${(samples.length / RATE).toFixed(1)} s`, `${(data.length / 1024).toFixed(0)} KB`);
}

/** Adds a rendered sound into the loop at `start` seconds; anything past the end wraps to the start. */
function place(out, start, sound, gain) {
  const n = out.length;
  const at = Math.round(start * RATE);
  for (let i = 0; i < sound.length; i++) out[(at + i) % n] += sound[i] * gain;
}

/** A plucked string (Karplus–Strong): a burst of noise through a tuned, slowly damped delay line. */
function pluck(freq, seconds, noise, brightness = 0.5) {
  const n = Math.round(seconds * RATE);
  const period = Math.max(2, Math.round(RATE / freq));
  const line = new Float64Array(period);
  let prev = 0;
  for (let i = 0; i < period; i++) {
    // Smoothing the initial burst makes the string mellower.
    prev = prev + (noise() - prev) * brightness;
    line[i] = prev;
  }
  const out = new Float64Array(n);
  let idx = 0;
  for (let i = 0; i < n; i++) {
    const next = (idx + 1) % period;
    const v = 0.996 * 0.5 * (line[idx] + line[next]);
    out[i] = line[idx];
    line[idx] = v;
    idx = next;
  }
  for (let i = 0; i < 64 && i < n; i++) {
    out[i] *= i / 64; // a 2 ms fade-in rounds off the attack
    out[n - 1 - i] *= i / 64; // and no click at the cut
  }
  return out;
}

/** A soft bell for occasional sparkle on top. */
function bell(freq, seconds) {
  const n = Math.round(seconds * RATE);
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const env = Math.exp(-t / 0.9) * Math.min(1, t / 0.004);
    out[i] = env * (Math.sin(2 * Math.PI * freq * t) + 0.3 * Math.sin(2 * Math.PI * freq * 2.76 * t) * Math.exp(-t / 0.3));
  }
  return out;
}

/** Round, short bass note: a sine with a little second harmonic and a quick fade. */
function bass(freq, seconds) {
  const n = Math.round(seconds * RATE);
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const env = Math.min(1, t / 0.008) * Math.exp(-t / (seconds * 0.6)) * Math.min(1, (seconds - t) / 0.03);
    out[i] = env * (Math.sin(2 * Math.PI * freq * t) + 0.25 * Math.sin(4 * Math.PI * freq * t));
  }
  return out;
}

/** Soft kick: a sine that drops from 110 Hz to 45 Hz. */
function kick() {
  const n = Math.round(0.35 * RATE);
  const out = new Float64Array(n);
  let phase = 0;
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    phase += (2 * Math.PI * (45 + 65 * Math.exp(-t / 0.04))) / RATE;
    out[i] = Math.sin(phase) * Math.exp(-t / 0.12) * Math.min(1, t / 0.002);
  }
  return out;
}

/** Airy hi-hat: high-passed noise with a very short decay. */
function hat(noise, decay = 0.035) {
  const n = Math.round(0.12 * RATE);
  const out = new Float64Array(n);
  let last = 0;
  for (let i = 0; i < n; i++) {
    const x = noise();
    out[i] = (x - last) * Math.exp(-(i / RATE) / decay);
    last = x;
  }
  return out;
}

/** Soft clap: a few quick noise bursts, band-limited. */
function clap(noise) {
  const n = Math.round(0.25 * RATE);
  const out = new Float64Array(n);
  let lp = 0;
  let last = 0;
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const bursts = [0, 0.011, 0.022].reduce((a, s) => a + (t >= s ? Math.exp(-(t - s) / (s === 0.022 ? 0.08 : 0.008)) : 0), 0);
    lp += (noise() - lp) * 0.35;
    out[i] = (lp - last) * bursts;
    last = lp;
  }
  return out;
}

/**
 * A warm pad chord: each note is a few harmonics on two slightly detuned voices. Its level dips a
 * little after every beat (a gentle "pump") so the pad breathes with the groove.
 */
function pad(out, start, seconds, notes, gain, beat, pump) {
  const n = Math.round((seconds + 0.6) * RATE);
  const sound = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const env = Math.min(1, t / 0.35) * (t > seconds ? Math.exp(-(t - seconds) / 0.25) : 1);
    const sinceBeat = ((start + t) % beat) / beat;
    const breath = 1 - pump * Math.exp(-sinceBeat * 6);
    let s = 0;
    for (const note of notes) {
      const f = hz(note);
      for (let k = 1; k <= 5; k++) {
        const amp = 1 / k ** 1.6;
        s += amp * (Math.sin(2 * Math.PI * f * k * t) + Math.sin(2 * Math.PI * f * 1.0035 * k * t + k));
      }
    }
    sound[i] = s * env * breath;
  }
  place(out, start, sound, gain / notes.length);
}

/** Schroeder reverb over two passes of the loop, keeping the second, so the tail wraps seamlessly. */
function reverb(dry, wet) {
  const n = dry.length;
  const combs = [0.0297, 0.0371, 0.0411, 0.0437].map((s) => ({ d: Math.round(s * RATE), buf: null, i: 0 }));
  const allpass = [0.005, 0.0017].map((s) => ({ d: Math.round(s * RATE), buf: null, i: 0 }));
  for (const c of [...combs, ...allpass]) c.buf = new Float64Array(c.d);
  const out = new Float64Array(n);
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < n; i++) {
      const x = dry[i];
      let y = 0;
      for (const c of combs) {
        const v = c.buf[c.i];
        c.buf[c.i] = x + v * 0.8;
        c.i = (c.i + 1) % c.d;
        y += v;
      }
      y /= combs.length;
      for (const a of allpass) {
        const v = a.buf[a.i];
        a.buf[a.i] = y + v * 0.5;
        a.i = (a.i + 1) % a.d;
        y = v - y * 0.5;
      }
      if (pass === 1) out[i] = x + y * wet;
    }
  }
  return out;
}

/** Removes any DC offset, then a light saturation so the few highest peaks round off. */
function soften(samples) {
  const mean = samples.reduce((a, v) => a + v, 0) / samples.length;
  let peak = 0;
  for (const v of samples) peak = Math.max(peak, Math.abs(v - mean));
  const drive = 1.1;
  return samples.map((v) => Math.tanh(((v - mean) / peak) * drive) / Math.tanh(drive));
}

/**
 * One loop. `chords` change every two bars; `sections(bar)` says which parts play in that bar, so a
 * loop can build (the beat comes in halfway) and then fall back to the start.
 */
function loop({ bpm, bars, chords, arpSteps, sections, seed, levels }) {
  const beat = 60 / bpm;
  const bar = beat * 4;
  const out = new Float64Array(Math.round(bars * bar * RATE));
  const noise = rng(seed);
  for (let b = 0; b < bars; b++) {
    const chord = chords[Math.floor(b / 2) % chords.length];
    const at = b * bar;
    const on = sections(b);
    if (b % 2 === 0) pad(out, at, bar * 2, chord.pad, levels.pad, beat, on.kick ? 0.28 : 0.08);
    // Bass: root on 1, a pickup on the "and" of 2, then the fifth or root on 3.
    const root = hz(chord.bass);
    if (on.bassMoving) {
      place(out, at, bass(root, beat * 1.4), levels.bass);
      place(out, at + beat * 1.5, bass(root, beat * 0.45), levels.bass * 0.7);
      place(out, at + beat * 2, bass(root * (b % 2 ? 1.5 : 1), beat * 1.8), levels.bass * 0.85);
    } else {
      place(out, at, bass(root, bar * 0.95), levels.bass * 0.8);
    }
    // Arpeggio: plucked strings through the chord's upper notes.
    const steps = on.sixteenths ? 16 : 8;
    for (let s = 0; s < steps; s++) {
      const pattern = arpSteps[(b % 2) * 8 + (on.sixteenths ? s >> 1 : s)];
      const note = chord.arp[(pattern + (on.sixteenths && s % 2 ? 2 : 0)) % chord.arp.length];
      const accent = s % (steps / 4) === 0 ? 1 : 0.7;
      place(out, at + (s * bar) / steps, pluck(hz(note), 1.6, noise, 0.45), levels.arp * accent * (on.sixteenths ? 0.75 : 1));
    }
    if (on.bell && b % 2 === 1) place(out, at + beat * 3.5, bell(hz(chord.arp[3] + 12), 2.5), levels.bell);
    // Percussion.
    for (let q = 0; q < 4; q++) {
      if (on.kick && (q === 0 || q === 2)) place(out, at + q * beat, kick(), levels.kick);
      if (on.clap && (q === 1 || q === 3)) place(out, at + q * beat, clap(noise), levels.clap);
      if (on.hats) place(out, at + q * beat + beat / 2, hat(noise), levels.hat);
      if (on.hats16) place(out, at + q * beat + beat / 4, hat(noise, 0.02), levels.hat * 0.5);
    }
  }
  return soften(reverb(out, 0.35));
}

const ARP = [0, 1, 2, 3, 2, 1, 2, 3, 0, 1, 2, 3, 1, 2, 3, 2];

// Reveal: bright and a little magical. C – G – Am – F; the beat comes in on bar 5, then builds.
writeWav('music-reveal.wav', loop({
  bpm: 104,
  bars: 16,
  seed: 7,
  arpSteps: ARP,
  chords: [
    { bass: 36, pad: [60, 64, 67, 74], arp: [72, 76, 79, 84] },
    { bass: 43, pad: [59, 62, 67, 74], arp: [71, 74, 79, 83] },
    { bass: 45, pad: [60, 64, 69, 72], arp: [72, 76, 81, 84] },
    { bass: 41, pad: [60, 65, 69, 72], arp: [72, 77, 81, 84] },
  ],
  sections: (b) => ({
    kick: b >= 4,
    hats: b >= 4,
    hats16: b >= 12,
    clap: b >= 8,
    bassMoving: b >= 4,
    sixteenths: b >= 8,
    bell: true,
  }),
  levels: { pad: 0.5, arp: 0.32, bass: 0.42, kick: 0.5, clap: 0.1, hat: 0.07, bell: 0.16 },
}));

// Life: a steady, hopeful groove to read over. D – A – Bm – G, with the beat all the way through.
writeWav('music-life.wav', loop({
  bpm: 96,
  bars: 16,
  seed: 11,
  arpSteps: ARP,
  chords: [
    { bass: 38, pad: [62, 66, 69, 73], arp: [69, 74, 78, 81] },
    { bass: 45, pad: [61, 64, 69, 73], arp: [69, 73, 76, 81] },
    { bass: 47, pad: [62, 66, 71, 74], arp: [71, 74, 78, 83] },
    { bass: 43, pad: [62, 67, 71, 74], arp: [67, 71, 74, 79] },
  ],
  sections: (b) => ({
    kick: true,
    hats: true,
    hats16: b >= 8,
    clap: b >= 4,
    bassMoving: true,
    sixteenths: false,
    bell: b >= 8,
  }),
  levels: { pad: 0.42, arp: 0.28, bass: 0.45, kick: 0.5, clap: 0.09, hat: 0.06, bell: 0.12 },
}));
