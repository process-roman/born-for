import { writeFile, copyFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { build } from "esbuild";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { SIGNS, SIGN_IDS } = require("../../src/content/signs.ts");
const {
  ATTRIBUTE_LABELS,
  ATTRIBUTE_DESCRIPTIONS,
  FAMILIES,
} = require("../../src/content/attributes.ts");
const { CAREERS, CAREER_IDS } = require("../../src/content/careers.ts");
const { LIVES } = require("../../src/content/life.ts");
const { WORLDS } = require("../../src/content/worlds.ts");
const root = new URL("../", import.meta.url);
await mkdir(new URL("src/generated/", root), { recursive: true });
await mkdir(new URL("public/art/", root), { recursive: true });
const data = {
  sourceCommit: execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim(),
  signs: SIGNS,
  signIds: SIGN_IDS,
  labels: ATTRIBUTE_LABELS,
  descriptions: ATTRIBUTE_DESCRIPTIONS,
  families: FAMILIES,
  worlds: WORLDS,
  careers: CAREER_IDS.map((id) => {
    const c = CAREERS[id];
    const life = LIVES[id];
    return {
      id,
      name: c.name,
      oneLiner: c.oneLiner,
      worlds: c.worlds,
      requirements: c.requirements,
      dayToDay: c.dayToDay,
      opening: (() => {
        const e = life?.events.find(
          (e) =>
            e.kind === "opener" &&
            !e.conditions?.flagsAll?.includes("track_changer"),
        );
        return e
          ? {
              title: e.title,
              text: e.text,
              choices: e.choices.map(({ id, label, hint }) => ({
                id,
                label,
                hint,
              })),
            }
          : null;
      })(),
    };
  }),
};
await writeFile(
  new URL("src/generated/app-data.json", root),
  JSON.stringify(data),
);
await build({
  entryPoints: [
    new URL("../../src/logic/birthday.ts", import.meta.url).pathname,
  ],
  bundle: true,
  format: "esm",
  platform: "browser",
  outfile: new URL("src/generated/birthday.js", root).pathname,
  banner: {
    js: "// Generated from the app on main. Refresh with npm run sync:app.",
  },
});
await copyFile(
  new URL("../assets/avatars/archetypes.webp", root),
  new URL("public/art/archetypes.webp", root),
);
await copyFile(
  new URL("../assets/scenery/life-mountains.webp", root),
  new URL("public/art/mountains.webp", root),
);
console.log(
  `Synced ${SIGN_IDS.length} signs and ${CAREER_IDS.length} careers from ${data.sourceCommit.slice(0, 7)}`,
);

await copyFile(
  new URL("../assets/images/Born for logo.png", root),
  new URL("public/brand-logo.png", root),
);
