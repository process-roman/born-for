import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { resolve } from "node:path";
import { localStore } from "./local-store.mjs";
import { createLikesHandler } from "./likes.mjs";
export function devLikesApi() {
  const dir = resolve(".data");
  mkdirSync(dir, { recursive: true });
  const secretFile = resolve(dir, "cookie-secret");
  if (!existsSync(secretFile))
    writeFileSync(secretFile, randomBytes(32).toString("hex"), { mode: 0o600 });
  const store = localStore(resolve(dir, "likes.sqlite"));
  return {
    handle: createLikesHandler({
      store,
      secret: readFileSync(secretFile, "utf8"),
      secure: false,
    }),
    close: () => store.close(),
  };
}
