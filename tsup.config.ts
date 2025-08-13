import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["./src/index.ts", "./src/http/index.ts", "./src/stdio/index.ts"],
	format: ["esm", "cjs"],
	outDir: "dist",
	splitting: false,
	clean: true,
	dts: true,
});
