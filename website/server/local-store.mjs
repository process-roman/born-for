import { DatabaseSync } from "node:sqlite";
export function localStore(path) {
  const db = new DatabaseSync(path);
  db.exec(
    "PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS counter(id INTEGER PRIMARY KEY CHECK(id=1), value INTEGER NOT NULL); INSERT OR IGNORE INTO counter VALUES(1,117); CREATE TABLE IF NOT EXISTS likes(visitor TEXT PRIMARY KEY);",
  );
  return {
    async visit(id, like) {
      db.exec("BEGIN IMMEDIATE");
      try {
        if (
          like &&
          db.prepare("INSERT OR IGNORE INTO likes(visitor) VALUES(?)").run(id)
            .changes
        )
          db.exec("UPDATE counter SET value=value+1 WHERE id=1");
        const count = db
          .prepare("SELECT value FROM counter WHERE id=1")
          .get().value;
        const liked = Boolean(
          db.prepare("SELECT 1 FROM likes WHERE visitor=?").get(id),
        );
        db.exec("COMMIT");
        return { count, liked };
      } catch (error) {
        db.exec("ROLLBACK");
        throw error;
      }
    },
    close: () => db.close(),
  };
}
