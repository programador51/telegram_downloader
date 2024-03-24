import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        contentScripts: "src/content_script.ts",
      },
      output: {
        entryFileNames: `content_script.js`,
      },
    },
  },
});
