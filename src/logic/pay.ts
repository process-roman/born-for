// "Pay in the US" text from the BLS figures (careerPay.ts). Rounded so the numbers don't claim more
// precision than the data has: yearly pay to the nearest $1,000, hourly pay to the nearest dollar.

import { CAREER_PAY, type CareerPay } from '../content/careerPay';
import { CAREERS, type CareerId } from '../content/careers';

export interface PayLines {
  /** "$136,000 a year", or the note when there's no typical salary. */
  headline: string;
  /** "8 in 10 earn between $82,000 and $215,000." Null when there's no figure. */
  range: string | null;
  /** The official occupation, when it isn't simply this career. */
  category: string | null;
}

function money(value: number, kind: 'annual' | 'hourly'): string {
  const rounded = kind === 'annual' ? Math.round(value / 1000) * 1000 : Math.round(value);
  return `$${rounded.toLocaleString('en-US')}`;
}

export function payLines(careerId: CareerId, pay: CareerPay | undefined = CAREER_PAY[careerId]): PayLines | null {
  if (!pay) return null;
  if (pay.kind === 'varies') return { headline: pay.note, range: null, category: null };
  const unit = pay.kind === 'annual' ? 'a year' : 'an hour';
  // "Electricians" is just the plural of "Electrician": no need to name the category.
  const singular = (name: string) => name.toLowerCase().replace(/s$/, '');
  const same = singular(pay.category) === singular(CAREERS[careerId].name);
  return {
    headline: `${money(pay.median, pay.kind)} ${unit}`,
    range: `8 in 10 earn between ${money(pay.low, pay.kind)} and ${money(pay.high, pay.kind)}${pay.kind === 'hourly' ? ' an hour' : ''}.`,
    category: same ? null : pay.category,
  };
}

/** One short line for the life intro: "Typical pay in the US: $62,000 a year." Null without a figure. */
export function payShort(careerId: CareerId): string | null {
  const pay = CAREER_PAY[careerId];
  if (!pay || pay.kind === 'varies') return null;
  return `Typical pay in the US: ${payLines(careerId, pay)!.headline}.`;
}
