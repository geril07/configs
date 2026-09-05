export const next = {
  plugins: ["nextjs"],
  rules: {
    "nextjs/no-html-link-for-pages": "error",
    "nextjs/no-sync-scripts": "error",
    "nextjs/inline-script-id": "error",
    "nextjs/no-async-client-component": "error",
    "nextjs/no-assign-module-variable": "error",
    "nextjs/no-document-import-in-page": "error",
    "nextjs/no-duplicate-head": "error",
    "nextjs/no-head-import-in-document": "error",
    "nextjs/no-script-component-in-head": "error",
    "nextjs/no-unwanted-polyfillio": "error",
    "nextjs/google-font-display": "warn",
    "nextjs/google-font-preconnect": "warn",
    "nextjs/next-script-for-ga": "warn",
    "nextjs/no-before-interactive-script-outside-document": "warn",
    "nextjs/no-head-element": "warn",
    "nextjs/no-img-element": "warn",
  },
}

export default next
