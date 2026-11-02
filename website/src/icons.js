const paths = {
  star: '<path d="M12 1c0 8 3 11 11 11-8 0-11 3-11 11C12 15 9 12 1 12 9 12 12 9 12 1Z"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  heart:
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  moon: '<path d="M20.8 13.1A9 9 0 0 1 10.9 3.2 9 9 0 1 0 20.8 13.1Z"/>',
  compass:
    '<circle cx="12" cy="12" r="9"/><path d="m16.3 7.7-2.8 5.8-5.8 2.8 2.8-5.8 5.8-2.8Z"/>',
  spark: '<path d="m12 3 2 6 6 3-6 2-2 7-2-7-7-2 7-3 2-6ZM20 3v4m-2-2h4"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  back: '<path d="M20 12H5m6-6-6 6 6 6"/>',
  book: '<path d="M12 6C8 3 4 3 2 4v15c4-1 7 0 10 2m0-15c4-3 8-3 10-2v15c-4-1-7 0-10 2V6Z"/>',
};
export const icon = (name, cls = "") =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.star}</svg>`;
export const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
export const portrait = (sign) => {
  const ids = [
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
    "capricorn",
    "aquarius",
    "pisces",
  ];
  const i = ids.indexOf(sign);
  return `<span class="portrait" aria-hidden="true" style="--col:${i % 4};--row:${Math.floor(i / 4)}"><img src="/art/archetypes.webp" width="1448" height="1086" alt="" /></span>`;
};
export const sky = (cls = "") =>
  `<div class="sky ${cls}" aria-hidden="true"><span class="sky-stars">✦<i>✧</i><b>✦</b><em>·</em></span><span class="moon"></span><span class="sun"></span><img class="mountains" src="/art/mountains.webp" alt="" width="1774" height="886" /></div>`;
