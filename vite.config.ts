import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

/**
 * Rollup manual chunks — pull `node_modules` out of the entry chunk for caching and parallel loading.
 * App code under `src/features/*` stays split by `lazy()` route boundaries (see `v4/router.tsx`).
 */
function resolveManualChunk(id: string): string | undefined {
  if (!id.includes("node_modules")) return undefined;
  const n = id.replace(/\\/g, "/");

  // Router before generic `react` match
  if (n.includes("react-router")) return "vendor-router";

  if (n.includes("react-dom") || n.includes("/scheduler/")) return "vendor-react";
  if (/\/node_modules\/react(\/|$)/.test(n)) return "vendor-react";

  /** Keep i18n in the React vendor chunk to avoid vendor-react ↔ i18n circular chunk edges. */
  if (n.includes("i18next")) return "vendor-react";

  if (n.includes("@supabase")) return "vendor-supabase";
  if (n.includes("zustand")) return "vendor-zustand";

  if (n.includes("framer-motion")) return "ui-motion";
  if (n.includes("@radix-ui")) return "ui-radix";
  if (n.includes("recharts")) return "ui-charts";
  if (n.includes("lucide-react")) return "ui-icons";

  if (n.includes("@google/genai")) return "vendor-google-genai";

  /** Let Rollup place remaining `node_modules` deps; a catch-all bucket caused circular chunk warnings with React. */
  return undefined;
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
  build: {
    /** Keep pressure to stay under ~500 kB gzip for the largest chunk (typically entry or a fat vendor). */
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks: resolveManualChunk,
      },
    },
  },
});
