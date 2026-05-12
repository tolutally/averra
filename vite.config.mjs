import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Simplified config for development and Vercel deployments
export default defineConfig({
  build: {
    outDir: "dist",
  },
  plugins: [tsconfigPaths(), react()],
  server: {
    port: 5173,
    host: "localhost",
  },
});