import { describe, expect, it } from 'vitest';
import { CAREER_PAY } from '../src/content/careerPay';
import { CAREER_IDS } from '../src/content/careers';
import { payLines, payShort } from '../src/logic/pay';

describe('pay in the US', () => {
  it('every career has figures or an honest note', () => {
    expect(CAREER_IDS.filter((id) => !CAREER_PAY[id])).toEqual([]);
  });

  it('figures are ordered and believable', () => {
    for (const id of CAREER_IDS) {
      const pay = CAREER_PAY[id]!;
      if (pay.kind === 'varies') continue;
      expect(pay.low, id).toBeLessThan(pay.median);
      expect(pay.median, id).toBeLessThan(pay.high);
      if (pay.kind === 'annual') expect(pay.median, id).toBeGreaterThan(20000);
      else expect(pay.median, id).toBeLessThan(100);
    }
  });

  it('rounds yearly pay to the nearest $1,000 and names the official category when it differs', () => {
    expect(payLines('software_dev')).toEqual({ headline: '$136,000 a year', range: '8 in 10 earn between $82,000 and $215,000.', category: 'Software developers' });
    expect(payLines('nursing')).toMatchObject({ category: 'Registered nurses' });
    expect(payLines('electrician')!.category).toBeNull(); // same name, no extra line
    expect(payLines('game_artist')!.category).toBe('Special effects artists and animators');
  });

  it('hourly jobs stay hourly', () => {
    expect(payLines('bartender')).toMatchObject({ headline: '$17 an hour', range: '8 in 10 earn between $10 and $35 an hour.' });
  });

  it('creators get a note, not a number, and no line in the life intro', () => {
    const lines = payLines('streamer')!;
    expect(lines.range).toBeNull();
    expect(lines.headline).toMatch(/No typical salary/);
    expect(payShort('streamer')).toBeNull();
    expect(payShort('nursing')).toBe('Typical pay in the US: $98,000 a year.');
  });
});
