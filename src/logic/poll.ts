// Reveal highlights, confirm-poll cards, the optional background step and "Your sign called X of 8"
// (Signs & Onboarding Spec §2, §4).

import { POLL_STATEMENTS, type AttributeId, type Band, type Stats } from '../content/attributes';
import { SIGNS, getSignStats, type SignId } from '../content/signs';
import { bandFor } from './stats';

export const TOP_ATTRIBUTE_COUNT = 3;

/** The sign's strongest probable traits, strongest first (starred at the reveal). */
export function topAttributes(sign: SignId, count = TOP_ATTRIBUTE_COUNT): AttributeId[] {
  return SIGNS[sign].signature.slice(0, count);
}

/** The 8 traits the sign predicts strongest; these are the poll cards. */
export function signatureTraits(sign: SignId): AttributeId[] {
  return [...SIGNS[sign].signature];
}

/** The 8 traits the sign doesn't lead with; offered as optional chips after the poll. */
export function backgroundTraits(sign: SignId): AttributeId[] {
  return [...SIGNS[sign].background];
}

export interface PollCard {
  attribute: AttributeId;
  statement: string;
  /** "Your sign says: {band}". */
  signBand: Band;
}

/** One card per signature trait, top 3 first (most likely to get a "That's me"). */
export function pollCards(sign: SignId): PollCard[] {
  const stats = getSignStats(sign);
  return signatureTraits(sign).map((attribute) => ({
    attribute,
    statement: POLL_STATEMENTS[attribute],
    signBand: bandFor(stats[attribute]),
  }));
}

export interface SignCalled {
  /** Signature traits whose confirmed value stayed in the sign's band. */
  matched: AttributeId[];
  /** Where the user differs from their sign. */
  unique: AttributeId[];
  count: number;
  total: number;
}

/** Counted over the 8 signature traits. */
export function signCalled(sign: SignId, confirmed: Stats): SignCalled {
  const stats = getSignStats(sign);
  const traits = signatureTraits(sign);
  const matched = traits.filter((a) => bandFor(confirmed[a]) === bandFor(stats[a]));
  return { matched, unique: traits.filter((a) => !matched.includes(a)), count: matched.length, total: traits.length };
}
