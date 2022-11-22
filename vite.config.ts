import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // root: "public",
  build: {
    outDir: "./build",
  },
  plugins: [
    reactRefresh(),
    svgrPlugin({ svgrOptions: { icon: true } }),
    VitePWA({ registerType: "autoUpdate", devOptions: { enabled: true } }),
  ],
});
