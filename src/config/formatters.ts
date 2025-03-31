import type { Configs, OptionsFormatters, StylisticConfig } from '../types'

import { StylisticConfigDefaults } from '../config/stylistic'
import { GLOB_CSS, GLOB_HTML, GLOB_LESS, GLOB_POSTCSS, GLOB_SCSS } from '../global'
import { ensurePackages, interopDefault } from '../utils/index'

export async function formatters(
  options: OptionsFormatters | true = {} as OptionsFormatters,
  stylistic: StylisticConfig = {},
): Promise<Configs> {
  if (options === true) {
    options = {
      html: true,
      css: true,
      less: true,
      scss: true,
    }
  }

  await ensurePackages(['eslint-plugin-format'])

  const {
    indent,
    quotes,
    semi,
  } = {
    ...StylisticConfigDefaults,
    ...stylistic,
  }

  const prettierOptions = Object.assign(
    {
      endOfLine: 'auto',
      printWidth: 120,
      semi,
      singleQuote: quotes === 'single',
      tabWidth: typeof indent === 'number' ? indent : 2,
      trailingComma: 'all',
      useTabs: indent === 'tab',
    },
    {},
  )

  const pluginFormat = await interopDefault(import('eslint-plugin-format'))

  const configs: Configs = [
    {

      plugins: {
        format: pluginFormat,
      },
    },
  ]

  if (options.html) {
    configs.push({
      files: [GLOB_HTML],
      languageOptions: {
        parser: pluginFormat.parserPlain,
      },
      name: 'formatter/html',
      rules: {
        'format/prettier': ['error', { parser: 'html', ...prettierOptions }],
      },
    })
  }

  if (options.css || options.less || options.scss) {
    configs.push(
      {
        files: [GLOB_CSS, GLOB_POSTCSS],
        languageOptions: {
          parser: pluginFormat.parserPlain,
        },
        name: 'formatter/css',
        rules: {
          'format/prettier': ['error', { parser: 'css', ...prettierOptions }],
        },
      },
    )
  }

  if (options.less) {
    configs.push(
      {
        files: [GLOB_LESS],
        languageOptions: {
          parser: pluginFormat.parserPlain,
        },
        name: 'formatter/less',
        rules: {
          'format/prettier': ['error', { parser: 'less', ...prettierOptions }],
        },
      },
    )
  }

  if (options.scss) {
    configs.push(
      {
        files: [GLOB_SCSS],
        languageOptions: {
          parser: pluginFormat.parserPlain,
        },
        name: 'formatter/scss',
        rules: {
          'format/prettier': ['error', { parser: 'scss', ...prettierOptions }],
        },
      },
    )
  }

  return configs
}
