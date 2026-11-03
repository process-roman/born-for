// Synthesizes the placeholder music and sounds in assets/audio (no samples, no licenses involved).
// Two calm loops (reveal, life) and six short cues. Swap in final audio by replacing the files;
// the app only cares about the file names. Run: node scripts/make-placeholder-audio.mjs
import fs from 'node:fs';
import path from 'node:path';

const RATE = 22050;
const OUT = path.join('assets', 'audio');
fs.mkdirSync(OUT, { recursive: true });

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

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
  console.log(name, `${(data.length / 1024).toFixed(0)} KB`);
}

/** A soft bell: a few inharmonic partials with an exponential decay. */
function bell(t, freq, decay) {
  if (t < 0) return 0;
  const env = Math.exp(-t / decay) * Math.min(1, t / 0.005);
  return env * (Math.sin(2 * Math.PI * freq * t) + 0.35 * Math.sin(2 * Math.PI * freq * 2.01 * t) + 0.12 * Math.sin(2 * Math.PI * freq * 3.02 * t));
}

/**
 * A seamless ambient loop: chords crossfade on a cosine window that wraps around the loop, so the
 * last chord blends back into the first. Sparse bell notes float on top.
 */
function ambientLoop({ seconds, chords, octaveShift, bells, brightness }) {
  const n = Math.round(seconds * RATE);
  const out = new Float64Array(n);
  const per = seconds / chords.length;
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    let s = 0;
    chords.forEach((chord, c) => {
      // Distance from this chord's centre, wrapped around the loop.
      let d = Math.abs(t - (c + 0.5) * per);
      d = Math.min(d, seconds - d);
      const w = d < per ? 0.5 + 0.5 * Math.cos((Math.PI * d) / per) : 0;
      if (w === 0) return;
      for (const note of chord) {
        const f = hz(note + octaveShift);
        // Two slightly detuned sines per note give a slow, warm shimmer.
        s += w * (Math.sin(2 * Math.PI * f * t) + 0.6 * Math.sin(2 * Math.PI * f * 1.003 * t) + brightness * Math.sin(2 * Math.PI * f * 2 * t));
      }
    });
    out[i] = s * 0.12;
  }
  // Bells: wrap their tails around the end so the loop stays seamless.
  for (const [at, note] of bells) {
    const f = hz(note);
    for (let i = 0; i < Math.round(4 * RATE); i++) out[(Math.round(at * RATE) + i) % n] += 0.18 * bell(i / RATE, f, 1.2);
  }
  return out;
}

/** A short one-shot cue from bell notes, with a soft fade at the end. */
function cue(seconds, notes) {
  const n = Math.round(seconds * RATE);
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    let s = 0;
    for (const [at, note, decay] of notes) s += bell(t - at, hz(note), decay);
    const tail = Math.min(1, (seconds - t) / 0.08);
    out[i] = s * tail;
  }
  return out;
}

// Reveal: airy, a little magical. Cmaj9 → Am9 → Fmaj7 → G6sus, high bells.
writeWav('music-reveal.wav', ambientLoop({
  seconds: 48,
  chords: [[60, 64, 67, 71, 74], [57, 60, 64, 67, 71], [53, 57, 60, 64, 69], [55, 60, 62, 64, 67]],
  octaveShift: 0,
  brightness: 0.25,
  bells: [[3, 79], [9.5, 76], [15, 83], [21, 79], [27.5, 74], [33, 81], [39, 76], [44.5, 79]],
}));

// Life: calmer and lower, for reading. Dmaj7 → Bm7 → Gmaj7 → A6, fewer bells.
writeWav('music-life.wav', ambientLoop({
  seconds: 56,
  chords: [[50, 54, 57, 61], [47, 50, 54, 57], [43, 47, 50, 54], [45, 49, 52, 54]],
  octaveShift: 12,
  brightness: 0.12,
  bells: [[6, 73], [20, 69], [34, 76], [48, 71]],
}));

writeWav('sfx-reveal.wav', cue(2.4, [[0, 72, 0.9], [0.12, 76, 0.9], [0.24, 79, 1], [0.36, 84, 1.2]]));
writeWav('sfx-star.wav', cue(1.4, [[0, 88, 0.4], [0.07, 91, 0.45], [0.14, 96, 0.6]]));
writeWav('sfx-success.wav', cue(0.9, [[0, 76, 0.35], [0.1, 83, 0.5]]));
writeWav('sfx-setback.wav', cue(1.0, [[0, 69, 0.5], [0.14, 64, 0.6]]));
writeWav('sfx-badge.wav', cue(1.2, [[0, 81, 0.5], [0.09, 88, 0.6]]));
writeWav('sfx-ending.wav', cue(2.8, [[0, 60, 1.6], [0.15, 64, 1.6], [0.3, 67, 1.6], [0.45, 72, 1.8], [0.7, 79, 1.4]]));
