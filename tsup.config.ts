import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/index.ts"],
	format: ["esm", "cjs"],
	outDir: "dist",
	splitting: false,
	clean: true,
	dts: true,
});
