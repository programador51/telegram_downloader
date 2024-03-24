import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        contentScripts: "src/background.ts",
      },
      output: {
        entryFileNames: `background.js`,
      },
    },
  },
});
