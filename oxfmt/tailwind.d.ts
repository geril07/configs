export interface TailwindSortOptions {
  stylesheet?: string
  config?: string
  functions?: string[]
  attributes?: string[]
  preserveWhitespace?: boolean
  preserveDuplicates?: boolean
}

export interface TailwindSortConfig {
  sortTailwindcss: TailwindSortOptions
}

export declare function tailwind(options?: TailwindSortOptions): TailwindSortConfig
export default tailwind
