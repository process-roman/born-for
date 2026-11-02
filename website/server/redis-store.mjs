export const LIKE_SCRIPT = `
redis.call('SETNX', KEYS[1], 117)
local added = 0
if ARGV[1] == 'like' then
  added = redis.call('SADD', KEYS[2], ARGV[2])
  if added == 1 then redis.call('INCR', KEYS[1]) end
end
return {tonumber(redis.call('GET', KEYS[1])), redis.call('SISMEMBER', KEYS[2], ARGV[2])}
`;
export function redisStore({ url, token, namespace = "bornfor:website:v1" }) {
  if (!url || !token)
    throw new Error("Shared counter storage is not configured.");
  return {
    async visit(id, like) {
      const response = await fetch(url.replace(/\/$/, ""), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          "EVAL",
          LIKE_SCRIPT,
          "2",
          `${namespace}:count`,
          `${namespace}:visitors`,
          like ? "like" : "read",
          id,
        ]),
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error("Counter storage unavailable");
      const { result, error } = await response.json();
      if (
        error ||
        !Array.isArray(result) ||
        !Number.isSafeInteger(result[0]) ||
        result[0] < 117
      )
        throw new Error("Invalid counter result");
      return { count: result[0], liked: result[1] === 1 };
    },
  };
}
