import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
export const BASE_COUNT = 117;
const COOKIE = "bf_visitor";
export function createLikesHandler({ store, secret, secure = true }) {
  if (!secret || secret.length < 32)
    throw new Error(
      "The like-cookie secret must contain at least 32 characters.",
    );
  const sign = (id) =>
    createHmac("sha256", secret).update(id).digest("base64url");
  return async (req, res) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    const send = (status, body) => {
      res.statusCode = status;
      res.end(JSON.stringify(body));
    };
    if (!["GET", "POST"].includes(req.method)) {
      res.setHeader("Allow", "GET, POST");
      return send(405, { error: "Method not allowed" });
    }
    if (req.method === "POST") {
      const origin = req.headers.origin;
      const host = req.headers.host;
      let originHost;
      try {
        originHost = origin ? new URL(origin).host : host;
      } catch {
        return send(403, { error: "Invalid origin" });
      }
      if (req.headers["sec-fetch-site"] === "cross-site" || originHost !== host)
        return send(403, { error: "Please like from the Born For website." });
    }
    const raw =
      req.headers.cookie
        ?.split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith(COOKIE + "="))
        ?.slice(COOKIE.length + 1) ?? "";
    const [candidate, signature] = raw.split(".");
    const expected = candidate ? sign(candidate) : "";
    const valid =
      /^[a-f0-9-]{36}$/.test(candidate ?? "") &&
      /^[A-Za-z0-9_-]{43}$/.test(signature ?? "") &&
      signature.length === expected.length &&
      timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
    const id = valid ? candidate : randomUUID();
    if (!valid)
      res.setHeader(
        "Set-Cookie",
        `${COOKIE}=${id}.${sign(id)}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${secure ? "; Secure" : ""}`,
      );
    try {
      return send(200, await store.visit(id, req.method === "POST"));
    } catch {
      return send(503, {
        error: "The live count is temporarily unavailable. Please try again.",
      });
    }
  };
}
