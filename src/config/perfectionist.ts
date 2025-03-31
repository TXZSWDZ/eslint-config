import type { Config, OptionsOverrides } from '../types'

import { interopDefault } from '../utils'

export async function perfectionist(options: OptionsOverrides): Promise<Config> {
  const { overrides = {} } = options

  const pluginPerfectionist = await interopDefault(import('eslint-plugin-perfectionist'))

  return {
    name: 'imports/sort',
    plugins: {
      perfectionist: pluginPerfectionist,
    },
    rules: {
      'perfectionist/sort-exports': ['error', { order: 'asc', type: 'natural' }],
      'perfectionist/sort-imports': ['error', {
        groups: [
          'type',
          ['parent-type', 'sibling-type', 'index-type', 'internal-type'],
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'side-effect',
          'object',
          'unknown',
        ],
        newlinesBetween: 'always',
        order: 'asc',
        type: 'natural',
      }],
      'perfectionist/sort-named-exports': ['error', { order: 'asc', type: 'natural' }],
      'perfectionist/sort-named-imports': ['error', { order: 'asc', type: 'natural' }],
      ...overrides,
    },
  }
}
