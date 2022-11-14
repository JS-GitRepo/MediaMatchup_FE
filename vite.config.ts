import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react";
import svgrPlugin from "vite-plugin-svgr";

export default defineConfig({
  // root: "public",
  build: {
    outDir: "../build",
  },
  plugins: [reactRefresh(), svgrPlugin({ svgrOptions: { icon: true } })],
});
