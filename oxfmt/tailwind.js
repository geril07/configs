/**
 * Creates an Oxfmt configuration fragment for Tailwind CSS class sorting.
 *
 * @param {Object} options
 * @param {string} [options.stylesheet] Path to Tailwind v4 CSS stylesheet entrypoint (relative to oxfmt config).
 * @param {string} [options.config] Path to Tailwind v3 JavaScript config file (relative to oxfmt config).
 * @param {string[]} [options.functions] Function and template tag names to sort classes within (defaults to clsx, cn, cva, tw).
 * @param {string[]} [options.attributes] HTML / JSX attributes to sort classes within (defaults to class, className).
 * @param {boolean} [options.preserveWhitespace] Preserve whitespace around sorted classes (default: false).
 * @param {boolean} [options.preserveDuplicates] Preserve duplicate class names (default: false).
 */
export function tailwind(options = {}) {
  return {
    sortTailwindcss: {
      stylesheet: options.stylesheet,
      config: options.config,
      functions: options.functions ?? ["clsx", "cn", "cva", "tw"],
      attributes: options.attributes,
      preserveWhitespace: options.preserveWhitespace ?? false,
      preserveDuplicates: options.preserveDuplicates ?? false,
    },
  }
}

export default tailwind
