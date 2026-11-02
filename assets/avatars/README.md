# Archetype portraits

`archetypes.webp` is a bundled, transparent illustration atlas. It contains four columns and three rows of square cells, read left to right:

- Trailblazer (Aries), Builder (Taurus), Messenger (Gemini), Guardian (Cancer)
- Champion (Leo), Analyst (Virgo), Diplomat (Libra), Investigator (Scorpio)
- Explorer (Sagittarius), Architect (Capricorn), Inventor (Aquarius), Dreamer (Pisces)

The coordinated portraits were generated for Born For and encoded as WebP with alpha transparency. `ArchetypePortrait.tsx` clips one cell at display time, so the app loads and caches one local asset. The existing avatar medallion, size and five progression layers remain independent of the portrait. No remote image service is required.
