export const node = {
  plugins: ["node", "promise"],
  rules: {
    "node/no-path-concat": "error",
    "node/no-exports-assign": "error",
    "promise/no-multiple-resolved": "error",
    "promise/no-new-statics": "error",
    "promise/no-return-in-finally": "error",
  },
}

export default node
