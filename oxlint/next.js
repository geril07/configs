export const next = {
  plugins: ["nextjs"],
  rules: {
    "nextjs/no-html-link-for-pages": "error",
    "nextjs/no-sync-scripts": "error",
    "nextjs/google-font-display": "warn",
    "nextjs/google-font-preconnect": "warn",
    "nextjs/next-script-for-ga": "warn",
    "nextjs/no-before-interactive-script-outside-document": "warn",
    "nextjs/no-css-tags": "warn",
    "nextjs/no-head-element": "warn",
    "nextjs/no-img-element": "warn",
    "nextjs/no-page-custom-font": "warn",
    "nextjs/no-unwanted-polyfillio": "warn",
  },
}

export default next
