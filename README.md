# @geril07/configs

Minimal, composable configuration primitives for **TypeScript**, **Oxlint**, and **Oxfmt**.

## TypeScript

The base config is strict by default. Choose the runtime profile for the project:

| Export                        | Target                           | Main settings                                                                                                                                                                   |
| ----------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@geril07/configs/ts/base`    | Universal strict baseline        | `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `noPropertyAccessFromIndexSignature`, `isolatedModules` |
| `@geril07/configs/ts/bundler` | Vite and other frontend bundlers | Extends `base`; uses `module: "preserve"`, `moduleResolution: "bundler"`, and `noEmit: true`                                                                                    |
| `@geril07/configs/ts/node`    | Node.js services                 | Extends `base`; uses `module: "nodenext"`, `moduleResolution: "nodenext"`, and `types: ["node"]`                                                                                |

Declare `include`, `exclude`, and framework-specific `jsx` in the project-local config. The bundler profile intentionally does not choose a JSX transform.

## Oxlint

Import the presets as JavaScript objects and compose them with `extends`:

| Export                              | Scope                       | Policy                                                                                                                                                                                                                           |
| ----------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@geril07/configs/oxlint/base`      | Universal                   | Correctness warnings plus explicit errors for high-confidence TypeScript, Oxc, and Unicorn defects. Includes `no-explicit-any`, invalid built-in arguments, unsafe type declarations, and accumulating-spread performance traps. |
| `@geril07/configs/oxlint/react`     | React                       | Hooks and JSX correctness. React Compiler rules are explicitly disabled here; enable them in a reviewed project-specific profile.                                                                                                |
| `@geril07/configs/oxlint/next`      | Next.js                     | Link, script, client-component, document/head, image, and polyfill correctness checks. Some font and Pages Router checks remain warnings.                                                                                        |
| `@geril07/configs/oxlint/node`      | Node.js services            | Node module/path checks and Promise control-flow checks. `promise/catch-or-return` and `promise/no-return-in-finally` are warnings because intentional exceptions exist.                                                         |
| `@geril07/configs/oxlint/typed`     | Type-aware linting          | `no-floating-promises`, `no-misused-promises`, and `switch-exhaustiveness-check`. Requires `oxlint-tsgolint` and a TypeScript 7-compatible project.                                                                              |
| `@geril07/configs/oxlint/anti-slop` | Opt-in type-evidence policy | Vendored Dillon Mulroy rules for assertions, widening, unknown boundaries, dictionaries, reflection, and runtime `typeof` checks.                                                                                                |

### React + Vite

```ts
import { defineConfig } from "oxlint"
import { base, react } from "@geril07/configs/oxlint"

export default defineConfig({
  extends: [base, react],
  ignorePatterns: ["dist/**"],
})
```

### Next.js

```ts
import { defineConfig } from "oxlint"
import { base, react, next } from "@geril07/configs/oxlint"

export default defineConfig({
  extends: [base, react, next],
  ignorePatterns: [".next/**", "out/**"],
})
```

### Node.js

```ts
import { defineConfig } from "oxlint"
import { base, node } from "@geril07/configs/oxlint"

export default defineConfig({
  extends: [base, node],
  env: { node: true },
  ignorePatterns: ["dist/**"],
})
```

### Type-aware linting

Install the backend separately:

```sh
npm install --save-dev oxlint-tsgolint@7
```

Then compose `typed` at the root configuration level:

```ts
import { defineConfig } from "oxlint"
import { base, typed } from "@geril07/configs/oxlint"

export default defineConfig({
  extends: [base, typed],
})
```

Type-aware linting builds TypeScript programs. It can use more memory and time, especially in monorepos. Configure project references and build referenced packages before linting. `no-misused-promises` often needs project-specific options for DOM callbacks, JSX attributes, and test APIs.

## Oxfmt

| Export                            | Description                                                                                          |
| --------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `@geril07/configs/oxfmt/base`     | Modern defaults: `printWidth: 100`, `semi: false`, `tabWidth: 2`, double quotes, and trailing commas |
| `@geril07/configs/oxfmt/tailwind` | `tailwind({ stylesheet, config, functions })` helper for Tailwind class sorting                      |

```ts
import { defineConfig } from "oxfmt"
import { base } from "@geril07/configs/oxfmt"

export default defineConfig({
  ...base,
})
```

## Configuration semantics

1. `categories.correctness: "warn"` applies to all enabled built-in plugins. Explicit rules override the category. The base keeps this evolving warning layer, then promotes selected high-confidence defects to errors.
2. React Compiler rules are not part of the React preset. They are explicitly set to `off` because Oxlint applies correctness categories to enabled React rules. Audit new compiler rules when upgrading Oxlint.
3. `env`, `globals`, `settings`, and `ignorePatterns` do not merge safely across `extends`. Keep project-specific values in the root config.
4. The anti-slop plugin is exported as a bundled JavaScript file. The package does not expose the raw TypeScript entry as its runtime plugin export.

See [`RULESET_AUDIT.md`](./RULESET_AUDIT.md) for the source-backed rule review and rejected alternatives.
