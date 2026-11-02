import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  signFromBirthday,
  isValidBirthDate,
} from "../src/generated/birthday.js";
const data = JSON.parse(
  readFileSync(new URL("../src/generated/app-data.json", import.meta.url)),
);
test("the preview uses all main-branch signs and careers with real opening choices", () => {
  assert.equal(data.signIds.length, 12);
  assert.equal(data.careers.length, 99);
  assert.equal(data.signs.leo.archetype, "The Champion");
  assert.ok(
    data.careers.every((c) => c.opening?.title && c.opening?.choices.length),
  );
  assert.ok(
    data.careers.every(
      (c) => c.requirements.length && c.worlds.every((w) => data.worlds[w]),
    ),
  );
});
test("date logic supports birthdays, leap years and app cusp detection", () => {
  assert.deepEqual(signFromBirthday({ year: 2000, month: 8, day: 10 }), {
    kind: "sign",
    sign: "leo",
  });
  assert.deepEqual(signFromBirthday({ year: 2000, month: 7, day: 8 }), {
    kind: "sign",
    sign: "cancer",
  });
  assert.equal(isValidBirthDate({ year: 2000, month: 2, day: 29 }), true);
  assert.equal(isValidBirthDate({ year: 2001, month: 2, day: 29 }), false);
  assert.equal(
    signFromBirthday({ year: 2000, month: 3, day: 20 }).kind,
    "cusp",
  );
});
