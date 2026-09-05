import { build } from "esbuild"

await build({
  entryPoints: ["plugins/anti-slop/index.ts"],
  bundle: true,
  format: "esm",
  platform: "node",
  outfile: "plugins/anti-slop/index.js",
  banner: {
    js: "// Generated from index.ts. Keep this JavaScript bundle in sync with the vendored source.",
  },
})
