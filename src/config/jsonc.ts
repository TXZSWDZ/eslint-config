import type { Config, OptionsOverrides, OptionsStylistic } from '../types'

import { GLOB_JSON, GLOB_JSON5, GLOB_JSONC } from '../global'
import { interopDefault } from '../utils/index'

export async function jsonc(options: OptionsOverrides & OptionsStylistic): Promise<Config> {
  const {
    stylistic = true,
    overrides = {},
  } = options

  const {
    indent = 2,
  } = typeof stylistic === 'boolean' ? {} : stylistic

  const [
    pluginJsonc,
    parserJsonc,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-jsonc')),
    interopDefault(import('jsonc-eslint-parser')),
  ] as const)

  return {
    files: [GLOB_JSON, GLOB_JSON5, GLOB_JSONC],
    languageOptions: {
      parser: parserJsonc,
    },
    plugins: {
      jsonc: pluginJsonc,
    },
    rules: {
      'jsonc/no-bigint-literals': 'error',
      'jsonc/no-binary-expression': 'error',
      'jsonc/no-binary-numeric-literals': 'error',
      'jsonc/no-dupe-keys': 'error',
      'jsonc/no-escape-sequence-in-identifier': 'error',
      'jsonc/no-floating-decimal': 'error',
      'jsonc/no-hexadecimal-numeric-literals': 'error',
      'jsonc/no-infinity': 'error',
      'jsonc/no-multi-str': 'error',
      'jsonc/no-nan': 'error',
      'jsonc/no-number-props': 'error',
      'jsonc/no-numeric-separators': 'error',
      'jsonc/no-octal': 'error',
      'jsonc/no-octal-escape': 'error',
      'jsonc/no-octal-numeric-literals': 'error',
      'jsonc/no-parenthesized': 'error',
      'jsonc/no-plus-sign': 'error',
      'jsonc/no-regexp-literals': 'error',
      'jsonc/no-sparse-arrays': 'error',
      'jsonc/no-template-literals': 'error',
      'jsonc/no-undefined-value': 'error',
      'jsonc/no-unicode-codepoint-escapes': 'error',
      'jsonc/no-useless-escape': 'error',
      'jsonc/space-unary-ops': 'error',
      'jsonc/valid-json-number': 'error',
      'jsonc/vue-custom-block/no-parsing-error': 'error',

      ...stylistic
        ? {
            'jsonc/array-bracket-spacing': ['error', 'never'],
            'jsonc/comma-dangle': ['error', 'never'],
            'jsonc/comma-style': ['error', 'last'],
            'jsonc/indent': ['error', indent],
            'jsonc/key-spacing': ['error', {
              beforeColon: false,
              afterColon: true,

            }],
            'jsonc/object-curly-newline': 'error',
            'jsonc/object-curly-spacing': ['error', 'never'],
            'jsonc/quote-props': ['error', 'always'],
            'jsonc/quotes': ['error', 'double'],
          }
        : {},

      ...overrides,
    },
  }
}
