export const base = {
  plugins: ["typescript", "unicorn", "oxc"],
  categories: {
    correctness: "warn",
  },
  rules: {
    eqeqeq: "error",
    "no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    "oxc/no-accumulating-spread": "error",
    "unicorn/no-await-in-promise-methods": "error",
    "unicorn/no-invalid-fetch-options": "error",
    "unicorn/no-invalid-remove-event-listener": "error",
    "unicorn/no-new-array": "error",
    "unicorn/no-single-promise-in-promise-methods": "error",
    "unicorn/no-thenable": "error",
    "unicorn/no-useless-fallback-in-spread": "error",
    "unicorn/no-useless-length-check": "error",
    "unicorn/prefer-set-size": "error",
  },
}

export default base
