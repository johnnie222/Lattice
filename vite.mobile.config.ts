// Static client-only build for the Android app (Capacitor). The web build in
// vite.config.ts is untouched; this one has no server, so quote fetching is
// swapped for the native-HTTP version.
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const src = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  root: "mobile",
  base: "./",
  publicDir: false,
  envDir: "..",
  resolve: {
    alias: [
      { find: "@/lib/quote-source", replacement: `${src}/lib/quote-source.native.ts` },
      { find: /^@\//, replacement: `${src}/` },
    ],
  },
  build: {
    outDir: "../dist-mobile",
    emptyOutDir: true,
  },
  plugins: [tailwindcss(), viteReact()],
});
