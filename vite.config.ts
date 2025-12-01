import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/static/" : "/",
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      input: {
        auth: path.resolve(__dirname, "auth.html"),
        onboarding: path.resolve(__dirname, "onboarding.html"),
        dashboard: path.resolve(__dirname, "dashboard.html"),
        profile: path.resolve(__dirname, "profile.html"),
      },
      output: {
        manualChunks: undefined,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
