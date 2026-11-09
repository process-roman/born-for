// Synthesizes the six short sound cues in assets/audio (no samples, no licenses involved). The music
// loops come from make-music.mjs. Swap in final audio by replacing the files; the app only cares
// about the file names. Run: node scripts/make-placeholder-audio.mjs
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

writeWav('sfx-reveal.wav', cue(2.4, [[0, 72, 0.9], [0.12, 76, 0.9], [0.24, 79, 1], [0.36, 84, 1.2]]));
writeWav('sfx-star.wav', cue(1.4, [[0, 88, 0.4], [0.07, 91, 0.45], [0.14, 96, 0.6]]));
writeWav('sfx-success.wav', cue(0.9, [[0, 76, 0.35], [0.1, 83, 0.5]]));
writeWav('sfx-setback.wav', cue(1.0, [[0, 69, 0.5], [0.14, 64, 0.6]]));
writeWav('sfx-badge.wav', cue(1.2, [[0, 81, 0.5], [0.09, 88, 0.6]]));
writeWav('sfx-ending.wav', cue(2.8, [[0, 60, 1.6], [0.15, 64, 1.6], [0.3, 67, 1.6], [0.45, 72, 1.8], [0.7, 79, 1.4]]));
