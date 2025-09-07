import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Simplified config for development
export default defineConfig({
  build: {
    outDir: "build",
  },
  plugins: [tsconfigPaths(), react()],
  server: {
    port: 5173,
    host: "localhost",
  },
});