import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:http";
import { localStore } from "../server/local-store.mjs";
import { createLikesHandler } from "../server/likes.mjs";
import { redisStore } from "../server/redis-store.mjs";
const secret = "test-secret-with-more-than-thirty-two-characters";
function tempStore() {
  const dir = mkdtempSync(join(tmpdir(), "bornfor-test-"));
  const path = join(dir, "counter.sqlite");
  return { dir, path, store: localStore(path) };
}
async function serverFor(handler) {
  const server = createServer(handler);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { server, url: `http://127.0.0.1:${server.address().port}` };
}
test("117 base, durable counts and idempotent visitors", async () => {
  const { dir, path, store } = tempStore();
  try {
    assert.deepEqual(await store.visit("one", false), {
      count: 117,
      liked: false,
    });
    const results = await Promise.all(
      Array.from({ length: 30 }, () => store.visit("one", true)),
    );
    assert.ok(results.every((r) => r.count === 118 && r.liked));
    assert.deepEqual(await store.visit("two", true), {
      count: 119,
      liked: true,
    });
    store.close();
    const reopened = localStore(path);
    assert.deepEqual(await reopened.visit("one", true), {
      count: 119,
      liked: true,
    });
    reopened.close();
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
test("HTTP counter signs a cookie, rejects cross-site writes and survives repeated posts", async () => {
  const { dir, store } = tempStore();
  const { server, url } = await serverFor(
    createLikesHandler({ store, secret, secure: false }),
  );
  try {
    const initial = await fetch(url);
    assert.equal(initial.status, 200);
    assert.equal((await initial.json()).count, 117);
    const cookie = initial.headers.get("set-cookie").split(";")[0];
    assert.match(cookie, /bf_visitor=/);
    const forbidden = await fetch(url, {
      method: "POST",
      headers: { origin: "https://elsewhere.example", cookie },
    });
    assert.equal(forbidden.status, 403);
    const post = () =>
      fetch(url, { method: "POST", headers: { origin: url, cookie } }).then(
        (r) => r.json(),
      );
    assert.deepEqual(await post(), { count: 118, liked: true });
    assert.deepEqual(await post(), { count: 118, liked: true });
    const read = await fetch(url, { headers: { cookie } });
    assert.deepEqual(await read.json(), { count: 118, liked: true });
    const tampered = await fetch(url, {
      headers: { cookie: cookie.slice(0, -3) + "abc" },
    });
    assert.ok(tampered.headers.get("set-cookie"));
    assert.equal((await tampered.json()).liked, false);
    const malformed = await fetch(url, {
      method: "POST",
      headers: { origin: "not-a-url", cookie },
    });
    assert.equal(malformed.status, 403);
    const unsupported = await fetch(url, { method: "DELETE" });
    assert.equal(unsupported.status, 405);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    store.close();
    rmSync(dir, { recursive: true, force: true });
  }
});
test("storage failures return an unavailable state, never a pretend increment", async () => {
  const { server, url } = await serverFor(
    createLikesHandler({
      secret,
      secure: false,
      store: {
        visit() {
          throw Error("down");
        },
      },
    }),
  );
  try {
    const r = await fetch(url, { method: "POST" });
    assert.equal(r.status, 503);
    assert.ok((await r.json()).error);
    assert.match(r.headers.get("cache-control"), /no-store/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
test("Redis adapter sends one atomic script with private authentication and checks service errors", async () => {
  const original = globalThis.fetch;
  let command;
  globalThis.fetch = async (url, init) => {
    assert.equal(url, "https://example.upstash.io");
    assert.equal(init.headers.Authorization, "Bearer test-token");
    command = JSON.parse(init.body);
    return Response.json({ result: [118, 1] });
  };
  try {
    const store = redisStore({
      url: "https://example.upstash.io/",
      token: "test-token",
    });
    assert.deepEqual(await store.visit("visitor", true), {
      count: 118,
      liked: true,
    });
    assert.equal(command[0], "EVAL");
    assert.equal(command[2], "2");
    assert.equal(command[5], "like");
    assert.equal(command[6], "visitor");
    globalThis.fetch = async () =>
      Response.json({ error: "service unavailable" });
    await assert.rejects(store.visit("visitor", false));
  } finally {
    globalThis.fetch = original;
  }
});
