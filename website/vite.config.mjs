import { defineConfig } from "vite";
import { resolve } from "node:path";
import { devLikesApi } from "./server/dev-api.mjs";
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve("index.html"),
        discover: resolve("discover/index.html"),
      },
    },
  },
  plugins: [
    {
      name: "local-like-counter",
      configureServer(server) {
        const api = devLikesApi();
        server.middlewares.use("/api/likes", api.handle);
        server.httpServer?.once("close", api.close);
      },
      configurePreviewServer(server) {
        const api = devLikesApi();
        server.middlewares.use("/api/likes", api.handle);
        server.httpServer?.once("close", api.close);
      },
    },
  ],
});
