export const antiSlop = {
  jsPlugins: ["@geril/configs/plugin/anti-slop"],
  rules: {
    "anti-slop/no-chained-type-assertions": "error",
    "anti-slop/no-conditional-empty-object-spread": "error",
    "anti-slop/no-widen-then-assert": "error",
    "anti-slop/no-unknown-type-aliases": "error",
    "anti-slop/no-unsafe-dictionary-type": "error",
    "anti-slop/no-known-value-widening": "error",
    "anti-slop/no-reflect-get": "error",
    "anti-slop/no-reflect-apply": "error",
    "anti-slop/no-runtime-typeof": [
      "error",
      {
        allowInTypeGuards: true,
      },
    ],
  },
}

export default antiSlop
