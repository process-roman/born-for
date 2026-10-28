// Reveal highlights, confirm-poll cards and "Your sign called X of 8" (Signs & Onboarding Spec §2, §4).

import { ATTRIBUTE_IDS, POLL_STATEMENTS, type AttributeId, type Band, type Stats } from '../content/attributes';
import { getSignStats, type SignId } from '../content/signs';
import { bandFor } from './stats';

export const TOP_ATTRIBUTE_COUNT = 3;

/**
 * The sign's strongest probable attributes, highest first. Ties keep attribute order,
 * which resolves Leo's Independence/Persistence tie in favor of Independence as the spec suggests.
 */
export function topAttributes(sign: SignId, count = TOP_ATTRIBUTE_COUNT): AttributeId[] {
  const stats = getSignStats(sign);
  return [...ATTRIBUTE_IDS].sort((a, b) => stats[b] - stats[a]).slice(0, count);
}

export interface PollCard {
  attribute: AttributeId;
  statement: string;
  /** "Your sign says: {band}". */
  signBand: Band;
}

/** Top 3 first (most likely to get a "That's me"), then the rest in attribute order. */
export function pollCards(sign: SignId): PollCard[] {
  const stats = getSignStats(sign);
  const top = topAttributes(sign);
  const order = [...top, ...ATTRIBUTE_IDS.filter((a) => !top.includes(a))];
  return order.map((attribute) => ({
    attribute,
    statement: POLL_STATEMENTS[attribute],
    signBand: bandFor(stats[attribute]),
  }));
}

export interface SignCalled {
  /** Attributes whose confirmed value stayed in the sign's band. */
  matched: AttributeId[];
  /** Where the user differs from their sign. */
  unique: AttributeId[];
  count: number;
  total: number;
}

export function signCalled(sign: SignId, confirmed: Stats): SignCalled {
  const stats = getSignStats(sign);
  const matched = ATTRIBUTE_IDS.filter((a) => bandFor(confirmed[a]) === bandFor(stats[a]));
  return {
    matched,
    unique: ATTRIBUTE_IDS.filter((a) => !matched.includes(a)),
    count: matched.length,
    total: ATTRIBUTE_IDS.length,
  };
}
