import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  publicDir: "../public",
  base: "/mySite/",
  build: {
    outDir: "../docs",
    emptyOutDir: true,
  },
});
