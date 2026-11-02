import { describe, expect, it } from 'vitest';
import { CAREERS, CAREER_IDS } from '../src/content/careers';
import { accessoryArtFor } from '../src/ui/careerAccessoryArt';

describe('career accessory artwork coverage', () => {
  it.each(CAREER_IDS)('%s has an illustration for its named earned item', (id) => {
    expect(accessoryArtFor(CAREERS[id].item), `${id}: ${CAREERS[id].item}`).toBeDefined();
  });

  it('careers in the same world can have different item drawings', () => {
    expect(accessoryArtFor(CAREERS.ux_design.item)).not.toEqual(accessoryArtFor(CAREERS.graphic_designer.item));
    expect(accessoryArtFor(CAREERS.electrician.item)).not.toEqual(accessoryArtFor(CAREERS.carpenter.item));
  });

});
