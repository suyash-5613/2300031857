import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@notification-logger": path.resolve(__dirname, "../logging_middleware/src/index.ts"),
    },
  },
  server: {
    port: 3000,
    fs: {
      allow: [path.resolve(__dirname, "..")],
    },
  },
});