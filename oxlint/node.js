export const node = {
  plugins: ["node", "promise"],
  rules: {
    "node/no-path-concat": "error",
    "node/no-exports-assign": "error",
    "promise/always-return": "error",
    "promise/catch-or-return": "warn",
    "promise/no-multiple-resolved": "error",
    "promise/no-new-statics": "error",
    "promise/no-return-in-finally": "warn",
  },
}

export default node
