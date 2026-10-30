/// <reference types="node" />
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Mirror the "@/*" path alias from tsconfig.json so tests can import UI modules.
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
});
