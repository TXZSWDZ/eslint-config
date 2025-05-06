import type { Config, OptionsOverrides } from '../types'

import { pluginAntfu } from '../plugins'
import { interopDefault } from '../utils/index'

export async function imports(options: OptionsOverrides): Promise<Config> {
  const { overrides = {} } = options

  const pluginImport = await interopDefault(import('eslint-plugin-import-x'))

  return {
    name: 'imports/rules',
    plugins: {
      antfu: pluginAntfu,
      import: pluginImport,
    },
    rules: {
      'antfu/import-dedupe': 'error',
      'antfu/no-import-dist': 'error',
      'antfu/no-import-node-modules-by-path': 'error',

      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-named-default': 'error',
      'import/no-self-import': 'error',
      'import/no-webpack-loader-syntax': 'error',
      'import/newline-after-import': ['error', { count: 1 }],
      ...overrides,
    },
  }
}
