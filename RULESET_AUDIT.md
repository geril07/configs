# Ruleset audit

Date of review: 2026-09-05  
Oxlint baseline: `1.81.0`  
Repository baseline: `378649b`

This audit reviewed the exported Oxlint presets, the TypeScript profiles, Oxfmt only for packaging context, and the vendored anti-slop plugin.

## Method

Ten independent librarian studies reviewed:

1. Oxlint categories and configuration semantics.
2. The Oxc plugin.
3. The Unicorn plugin.
4. The TypeScript plugin.
5. Type-aware linting and `oxlint-tsgolint`.
6. Node and Promise plugins.
7. React and Next.js plugins.
8. Maintainer-owned configurations.
9. Rule-level ecosystem adoption.
10. Anti-slop source, behavior, and package loading.

Evidence priority was:

1. Oxlint and upstream rule source/tests.
2. Maintainer documentation and release notes.
3. Current configurations from Oxc, Vite, Next.js, Nx, OpenClaw, Expo, Ultracite, and other active projects.
4. GitHub code-search adoption signals and npm package downloads.

Adoption is not treated as proof of quality. GitHub search is not a census. It misses rules inherited through categories, `extends`, generated configs, and aliases. npm downloads measure package traffic, not rule quality.

## Executive decisions

### Keep the evolving correctness category

Oxlint applies `categories.correctness` to every enabled built-in plugin. Individual rules override the category. Keeping `correctness: "warn"` gives the base useful coverage as Oxlint adds rules without requiring a manual copy of the entire catalog.

This has one important consequence: adding the React plugin also exposes React Compiler correctness rules. The React preset now disables the known Compiler rules explicitly. They remain an opt-in decision rather than an accidental default.

Sources:

- [Oxlint configuration](https://oxc.rs/docs/guide/usage/linter/config.html)
- [Oxlint configuration reference](https://oxc.rs/docs/guide/usage/linter/config-file-reference.html)
- [Oxlint built-in plugins](https://oxc.rs/docs/guide/usage/linter/plugins.html)
- [Oxlint v1.79 React Compiler release](https://oxc.rs/blog/2026-08-18-react-compiler-support.html)

### Base: promote high-confidence defects

The base now explicitly treats these as errors:

- TypeScript escape hatches and unsafe declarations:
  - `typescript/no-explicit-any`
  - `typescript/no-empty-object-type`
  - `typescript/no-unsafe-function-type`
  - `typescript/no-extra-non-null-assertion`
  - `typescript/no-non-null-asserted-nullish-coalescing`
  - `typescript/no-non-null-asserted-optional-chain`
  - `typescript/no-misused-new`
  - `typescript/no-unsafe-declaration-merging`
  - `typescript/no-wrapper-object-types`
- Oxc runtime and performance defects:
  - `oxc/bad-array-method-on-arguments`
  - `oxc/bad-char-at-comparison`
  - `oxc/bad-comparison-sequence`
  - `oxc/bad-match-all-arg`
  - `oxc/bad-min-max-func`
  - `oxc/bad-object-literal-comparison`
  - `oxc/bad-replace-all-arg`
  - `oxc/const-comparisons`
  - `oxc/double-comparisons`
  - `oxc/erasing-op`
  - `oxc/missing-throw`
  - `oxc/no-accumulating-spread`
  - `oxc/no-const-enum`
  - `oxc/number-arg-out-of-range`
  - `oxc/uninvoked-array-callback`
- The existing high-confidence Unicorn rules remain errors.

`oxc/no-const-enum` is included because the TypeScript baseline uses `isolatedModules`, where const enums are a bundler and single-file compilation hazard.

The base leaves heuristic or policy-heavy rules at category warning level. In particular, `unicorn/no-useless-length-check` is no longer promoted to an error, and `oxc/no-map-spread` is not enabled universally.

Sources:

- [Oxlint rule catalog](https://oxc.rs/docs/guide/usage/linter/rules.html)
- [Oxc rule registry](https://github.com/oxc-project/oxc/blob/main/crates/oxc_linter/src/rules.rs)
- [Oxc `no-accumulating-spread`](https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-accumulating-spread)
- [Oxc `no-const-enum`](https://oxc.rs/docs/guide/usage/linter/rules/oxc/no-const-enum)
- [TypeScript `no-explicit-any`](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-explicit-any)
- [TypeScript `no-empty-object-type`](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-empty-object-type)
- [TypeScript `no-unsafe-function-type`](https://oxc.rs/docs/guide/usage/linter/rules/typescript/no-unsafe-function-type)

### Unicorn: keep the runtime traps, avoid style drift

Keep as errors:

- `no-await-in-promise-methods`
- `no-invalid-fetch-options`
- `no-invalid-remove-event-listener`
- `no-new-array`
- `no-single-promise-in-promise-methods`
- `no-thenable`
- `prefer-set-size`

Keep `no-useless-fallback-in-spread` as a warning. `no-useless-length-check` remains covered by the broad correctness warning but is not promoted.

`prefer-set-size` has a shadowed-`Set` false-positive fix in Oxlint 1.81. The package peer floor is now `oxlint >=1.81.0`.

Potential scoped additions, not included in the universal base:

- `unicorn/no-accessor-recursion` for general runtime safety.
- `unicorn/no-new-buffer` and `unicorn/no-process-exit` for Node profiles.
- `unicorn/require-post-message-target-origin` for browser or extension profiles.
- `unicorn/prefer-set-has` for a performance profile.

Sources:

- [Unicorn rule source and tests](https://github.com/oxc-project/oxc/tree/apps_v1.81.0/crates/oxc_linter/src/rules/unicorn)
- [Unicorn upstream rules](https://github.com/sindresorhus/eslint-plugin-unicorn/tree/v72.0.0/docs/rules)
- [Unicorn/Oxlint compatibility issue](https://github.com/oxc-project/oxc/issues/684)

### Node and Promise: separate runtime concerns from style

The Node preset keeps:

- `node/no-path-concat`: error.
- `node/no-exports-assign`: error.
- `promise/no-multiple-resolved`: error.
- `promise/no-new-statics`: error.
- `promise/always-return`: error.
- `promise/catch-or-return`: warning.
- `promise/no-return-in-finally`: warning.

The last two are warnings because fire-and-forget work and intentional `finally` rejection overrides exist. `node/no-sync` and callback rules remain scoped or optional because they depend strongly on whether the file is a server, CLI, build script, or adapter.

Sources:

- [Node plugin rules](https://oxc.rs/docs/guide/usage/linter/rules.html)
- [Promise plugin](https://github.com/eslint-community/eslint-plugin-promise)
- [Node error handling](https://nodejs.org/api/errors.html)
- [Node process events](https://nodejs.org/api/process.html)

### React: classic rules by default

Keep:

- `react/rules-of-hooks`: error.
- `react/exhaustive-deps`: warning.
- `react/jsx-key`: error.
- `react/jsx-no-duplicate-props`: error.
- `react/jsx-no-undef`: error.
- `react/no-children-prop`: error.
- `react/no-danger-with-children`: error.
- `react/no-unknown-property`: warning.

The React Compiler rules are explicitly off in the preset. They are useful for a separate reviewed profile, but they are experimental, can be opinionated, and are enabled indirectly by the base correctness category when the React plugin is present.

Sources:

- [React rules in Oxlint](https://oxc.rs/docs/guide/usage/linter/rules.html)
- [React Hooks guidance](https://react.dev/reference/eslint-plugin-react-hooks)
- [Oxlint React Compiler support](https://oxc.rs/blog/2026-08-18-react-compiler-support.html)
- [Vite React template](https://github.com/vitejs/vite/blob/456901bb64de/packages/create-vite/template-react/_oxlintrc.json)

### Next.js: add real framework failures, remove stale generic checks

The Next preset now promotes these to errors:

- `no-html-link-for-pages`
- `no-sync-scripts`
- `inline-script-id`
- `no-async-client-component`
- `no-assign-module-variable`
- `no-document-import-in-page`
- `no-duplicate-head`
- `no-head-import-in-document`
- `no-script-component-in-head`
- `no-unwanted-polyfillio`

Font, image, and document placement checks remain warnings because they depend on Router mode and application policy. `no-page-custom-font` and `no-css-tags` were removed from the generic preset because they are Pages Router or usage-pattern specific and can report valid App Router code.

Sources:

- [Next plugin rules](https://oxc.rs/docs/guide/usage/linter/rules.html)
- [Next no-html-link-for-pages](https://nextjs.org/docs/messages/no-html-link-for-pages)
- [Next font guidance](https://nextjs.org/docs/pages/getting-started/fonts)
- [Next.js 16 lint changes](https://nextjs.org/blog/next-16)

### Type-aware preset: opt in and document the cost

The existing three-rule selection is defensible:

- `typescript/no-floating-promises`: typed preset baseline.
- `typescript/no-misused-promises`: typed preset, often needs callback/JSX tuning.
- `typescript/switch-exhaustiveness-check`: typed preset, useful for discriminated unions.

Type-aware linting requires `oxlint-tsgolint` and TypeScript 7-compatible project configuration. The package now declares `oxlint-tsgolint >=7` as an optional peer. Consumers still install it explicitly because the preset is opt-in.

Sources:

- [Oxlint type-aware linting](https://oxc.rs/docs/guide/usage/linter/type-aware.html)
- [tsgolint](https://github.com/oxc-project/tsgolint)
- [Type-aware linting stable release](https://oxc.rs/blog/2026-07-22-type-aware-linting-stable.html)
- [TypeScript noFloating-style rule source](https://github.com/oxc-project/tsgolint/tree/main/internal/rules)

### Anti-slop: opt-in, vendored, and bundled

The vendored source comes from Dillon Mulroy’s [`anti-slop`](https://github.com/dmmulroy/anti-slop) commit [`e8c4880`](https://github.com/dmmulroy/anti-slop/commit/e8c4880471b23ab7f216fba7b27d173a6ef07d4c).

Enabled rules:

- `no-chained-type-assertions`
- `no-conditional-empty-object-spread`
- `no-widen-then-assert`
- `no-unknown-type-aliases`
- `no-unsafe-dictionary-type`
- `no-known-value-widening`
- `no-reflect-get`
- `no-reflect-apply`
- `no-runtime-typeof` with `allowInTypeGuards: true`

Naming, mocking, and mandatory safety-comment rules remain available in the vendored source but are not universal preset defaults. They are organization policy.

The package export points to a bundled JavaScript plugin. This avoids Node’s `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING` for TypeScript files under `node_modules`. The raw TypeScript remains as vendored source; it is not the runtime export. The checked-in bundle can be regenerated with `npm run build:anti-slop`.

Sources:

- [anti-slop upstream](https://github.com/dmmulroy/anti-slop)
- [Ultracite vendored anti-slop implementation](https://github.com/haydenbleasel/ultracite/tree/main/packages/cli/config/oxlint/anti-slop)
- [Oxlint JS plugins](https://oxc.rs/docs/guide/usage/linter/js-plugins.html)
- [Node TypeScript dependencies](https://nodejs.org/api/typescript.html#type-stripping-in-dependencies)

## Adoption signals

Representative current configurations show recurring use of:

- `typescript/no-explicit-any`, `no-floating-promises`, `no-misused-promises`, and `switch-exhaustiveness-check`.
- React Hooks rules.
- Next link and script rules.
- Oxc comparison, invalid-argument, missing-throw, and spread-performance rules.
- Node path/export and Promise resolution rules.

Examples include [Oxc](https://github.com/oxc-project/oxc/blob/526c2b3fc419/oxlintrc.json), [OpenClaw](https://github.com/openclaw/openclaw/blob/2ac40dedbedd/.oxlintrc.json), [Nx](https://github.com/nrwl/nx/blob/968f56817d82/.oxlintrc.json), [Vite](https://github.com/vitejs/vite/blob/456901bb64de/packages/create-vite/template-react/_oxlintrc.json), [Expo](https://github.com/expo/expo/blob/main/docs/.oxlintrc.json), and [Ultracite](https://github.com/haydenbleasel/ultracite/blob/main/packages/cli/config/oxlint/core/index.mjs).

Adoption is a secondary signal. It does not replace rule source, tests, or false-positive review.
