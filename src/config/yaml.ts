import type { Configs, OptionsOverrides, OptionsStylistic } from '../types'

import { GLOB_YAML } from '../global'
import { interopDefault } from '../utils/index'

export async function yaml(options: OptionsOverrides & OptionsStylistic): Promise<Configs> {
  const { overrides = {}, stylistic = true } = options

  const {
    indent = 2,
    quotes = 'single',
  } = typeof stylistic === 'boolean' ? {} : stylistic

  const [
    pluginYaml,
    parserYaml,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-yml')),
    interopDefault(import('yaml-eslint-parser')),
  ] as const)

  return [
    {
      files: [GLOB_YAML],
      languageOptions: {
        parser: parserYaml,
        parserOptions: {
          defaultYAMLVersion: '1.2',
        },
      },
      plugins: {
        yaml: pluginYaml,
      },
      rules: {
        'style/spaced-comment': 'off',

        'yaml/block-mapping': 'error',
        'yaml/block-sequence': 'error',
        'yaml/no-empty-key': 'error',
        'yaml/no-empty-sequence-entry': 'error',
        'yaml/no-irregular-whitespace': 'error',
        'yaml/plain-scalar': 'error',

        'yaml/vue-custom-block/no-parsing-error': 'error',

        ...stylistic
          ? {
              'yaml/no-tab-indent': 'error',
              'yaml/quotes': ['error', { prefer: quotes }],
              'yaml/indent': ['error', indent],
              'yaml/flow-mapping-curly-newline': 'error',
              'yaml/flow-mapping-curly-spacing': 'error',
              'yaml/flow-sequence-bracket-newline': 'error',
              'yaml/flow-sequence-bracket-spacing': 'error',
              'yaml/key-spacing': 'error',
              'yaml/no-multiple-empty-lines': 'error',
              'yaml/spaced-comment': 'error',
            }
          : {},
        ...overrides,
      },
    },
    {
      files: ['pnpm-workspace.yaml'],
      rules: {
        'yaml/sort-keys': [
          'error',
          {
            order: [
              'packages',
              'overrides',
              'patchedDependencies',
              'hoistPattern',
              'catalog',
              'catalogs',

              'allowedDeprecatedVersions',
              'allowNonAppliedPatches',
              'configDependencies',
              'ignoredBuiltDependencies',
              'ignoredOptionalDependencies',
              'neverBuiltDependencies',
              'onlyBuiltDependencies',
              'onlyBuiltDependenciesFile',
              'packageExtensions',
              'peerDependencyRules',
              'supportedArchitectures',
            ],
            pathPattern: '^$',
          },
          {
            order: { type: 'asc' },
            pathPattern: '.*',
          },
        ],
      },
    },
  ]
}
