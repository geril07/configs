# @geril07/configs

A minimal, composable repository of configuration primitives for **TypeScript**, **Oxlint**, and **Oxfmt**.

---

## Primitives Menu

### 1. TypeScript (`tsconfig.json`)

The base is strictly typed by default (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`). Choose the runtime configuration for your project:

| Export                        | Target                         | Key Properties                                                                                                                                                                                                                                                                            |
| ----------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@geril07/configs/ts/base`    | Universal strict baseline      | `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`, `noImplicitOverride: true`, `noFallthroughCasesInSwitch: true`, `noPropertyAccessFromIndexSignature: true`, `skipLibCheck: true`, `forceConsistentCasingInFileNames: true`, `isolatedModules: true` |
| `@geril07/configs/ts/bundler` | Frontend apps (Vite / Next.js) | Extends `base`. Adds `module: "preserve"`, `moduleResolution: "bundler"`, `noEmit: true`. _(JSX intentionally omitted for framework flexibility)._                                                                                                                                        |
| `@geril07/configs/ts/node`    | Node.js backend services       | Extends `base`. Adds `module: "nodenext"`, `moduleResolution: "nodenext"`, `types: ["node"]`.                                                                                                                                                                                             |

_Note:_ Always declare `include`, `exclude`, and framework-specific `jsx` (e.g. `"jsx": "react-jsx"`) in your project-local `tsconfig.json`.

---

### 2. Oxlint (`oxlint.config.ts` or `.oxlintrc.json`)

Oxlint configurations are exported as composable JavaScript objects.

| Export                              | Scope                | Included Checks                                                                                                                                                                       |
| ----------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@geril07/configs/oxlint/base`      | Universal            | `typescript`, `unicorn`, and `oxc` plugins. Core correctness, `eqeqeq`, `no-unused-vars` (ignoring `_` prefixes), safe Unicorn checks.                                                |
| `@geril07/configs/oxlint/react`     | React applications   | `react/rules-of-hooks`, `react/exhaustive-deps`, `react/jsx-key`, `react/jsx-no-duplicate-props`, `react/no-danger-with-children`. _Experimental compiler checks omitted._            |
| `@geril07/configs/oxlint/next`      | Next.js applications | `nextjs/no-html-link-for-pages` (error), `nextjs/no-sync-scripts` (error), font display, image and head element checks.                                                               |
| `@geril07/configs/oxlint/node`      | Node.js services     | `node/no-path-concat`, `node/no-exports-assign`, `promise/no-multiple-resolved`, `promise/no-new-statics`, `promise/no-return-in-finally`.                                            |
| `@geril07/configs/oxlint/typed`     | Type-aware linting   | Enables `options.typeAware: true`. Checks `no-floating-promises`, `no-misused-promises`, and `switch-exhaustiveness-check`. _(Requires `oxlint-tsgolint`)_                            |
| `@geril07/configs/oxlint/anti-slop` | Anti-slop / AI guard | Enables Dillon Mulroy's type-evidence rules: `no-chained-type-assertions`, `no-widen-then-assert`, `no-unknown-type-aliases`, `no-unsafe-dictionary-type`, `no-known-value-widening`. |

---

### 3. Oxfmt (`oxfmt.config.ts`)

| Export                            | Description                                                                                                                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@geril07/configs/oxfmt/base`     | Modern formatting: `printWidth: 100`, `semi: false`, `tabWidth: 2`, `useTabs: false`, `singleQuote: false`, `trailingComma: "all"`, `endOfLine: "lf"`, `sortPackageJson: true`. |
| `@geril07/configs/oxfmt/tailwind` | Helper factory `tailwind({ stylesheet, config, functions })` for built-in Tailwind CSS class sorting.                                                                           |

---

## Usage Examples

### Example A: React + Vite Application

**`tsconfig.json`:**

```json
{
  "extends": "@geril07/configs/ts/bundler",
  "compilerOptions": {
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

**`oxlint.config.ts`:**

```ts
import { defineConfig } from "oxlint"
import { base, react } from "@geril07/configs/oxlint"

export default defineConfig({
  extends: [base, react],
  ignorePatterns: ["dist/**"],
})
```

**`oxfmt.config.ts`:**

```ts
import { defineConfig } from "oxfmt"
import { base, tailwind } from "@geril07/configs/oxfmt"

export default defineConfig({
  ...base,
  ...tailwind({
    stylesheet: "./src/index.css",
  }),
  ignorePatterns: ["dist/**"],
})
```

---

### Example B: Next.js App Router

**`tsconfig.json`:**

```json
{
  "extends": "@geril07/configs/ts/bundler",
  "compilerOptions": {
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"]
}
```

**`oxlint.config.ts`:**

```ts
import { defineConfig } from "oxlint"
import { base, react, next } from "@geril07/configs/oxlint"

export default defineConfig({
  extends: [base, react, next],
  ignorePatterns: [".next/**", "out/**"],
})
```

---

### Example C: Node.js Backend Service

**`tsconfig.json`:**

```json
{
  "extends": "@geril07/configs/ts/node",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

**`oxlint.config.ts`:**

```ts
import { defineConfig } from "oxlint"
import { base, node } from "@geril07/configs/oxlint"

export default defineConfig({
  extends: [base, node],
  env: {
    node: true,
  },
  ignorePatterns: ["dist/**"],
})
```

---

## Critical Merge Semantics

1. **`settings`, `env`, `globals`, and `ignorePatterns` do NOT merge across Oxlint `extends`.**
   If a child configuration specifies `env` or `ignorePatterns`, inherited values are overwritten. Keep environment flags and ignores in your project-local root configuration.
2. **React Compiler checks are separated.**
   In Oxlint v1.81.0, React Compiler rules are categorized as `correctness`. The `oxlint/react` primitive explicitly selects classic Hooks and JSX rules to prevent unreviewed compiler diagnostics.
3. **Tailwind sorting path requirement.**
   Tailwind class sorting requires either `stylesheet` (Tailwind v4 CSS file) or `config` (Tailwind v3 JS file). Provide this path relative to your `oxfmt.config.ts`.
