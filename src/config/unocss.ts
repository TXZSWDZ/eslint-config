import type { Config, OptionsUnocss } from '../types'

import { ensurePackages, interopDefault } from '../utils/index'

export async function unocss(options: OptionsUnocss = {}): Promise<Config> {
  const {
    attributify = true,
    strict = false,
  } = options

  await ensurePackages([
    '@unocss/eslint-plugin',
  ])

  const pluginUnoCSS = await interopDefault(import('@unocss/eslint-plugin'))

  return {
    files: ['**/*.vue', '**/*.html'],
    plugins: {
      unocss: pluginUnoCSS,
    },
    rules: {
      'unocss/order': 'warn',
      ...attributify
        ? {
            'unocss/order-attributify': 'warn',
          }
        : {},
      ...strict
        ? {
            'unocss/blocklist': 'error',
          }
        : {},
    },
  }
}
