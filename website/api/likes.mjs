import { createLikesHandler } from "../server/likes.mjs";
import { redisStore } from "../server/redis-store.mjs";
let handler;
export default async function likes(req, res) {
  try {
    handler ??= createLikesHandler({
      secret: process.env.LIKE_COOKIE_SECRET,
      store: redisStore({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
        namespace: process.env.LIKES_NAMESPACE || "bornfor:website:v1",
      }),
    });
    return await handler(req, res);
  } catch {
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");
    res.end(
      JSON.stringify({
        error: "The live count is temporarily unavailable. Please try again.",
      }),
    );
  }
}
