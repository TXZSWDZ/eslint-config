import type { Config } from '../types'

import { GLOB_JSX, GLOB_TSX } from '../global'

export function jsx(): Config {
  return {
    files: [GLOB_JSX, GLOB_TSX],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

  }
}
