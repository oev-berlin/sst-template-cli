import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  minify: true,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ["esm"],
  target: "esnext",
  outDir: "dist",
});
