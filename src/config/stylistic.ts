import type { Config, OptionsOverrides, StylisticConfig } from '../types'

import { pluginAntfu } from '../plugins'
import { interopDefault } from '../utils/index'

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  quotes: 'single',
  semi: false,
}

export async function stylistic(options: StylisticConfig & OptionsOverrides): Promise<Config> {
  const {
    indent,
    jsx,
    quotes,
    semi,
    overrides = {},
  } = { ...StylisticConfigDefaults, ...options }

  const pluginStylistic = await interopDefault(import('@stylistic/eslint-plugin'))

  const customizeConfig = pluginStylistic.configs.customize(({
    pluginName: 'style',
    indent,
    jsx,
    quotes,
    semi,
  }))

  return {
    plugins: {
      antfu: pluginAntfu,
      style: pluginStylistic,
    },
    rules: {
      ...customizeConfig.rules,
      'antfu/consistent-chaining': 'error',
      'antfu/consistent-list-newline': 'error',
      'antfu/curly': 'error',
      'antfu/if-newline': 'error',
      'antfu/top-level-function': 'error',

      'style/no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'style/generator-star-spacing': ['error', { after: true, before: false }],
      'style/yield-star-spacing': ['error', { after: true, before: false }],
      ...overrides,
    },
  }
}
