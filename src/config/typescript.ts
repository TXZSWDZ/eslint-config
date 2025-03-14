import process from 'node:process'

import type {
  Config,
  OptionsFiles,
  OptionsOverrides,
  OptionsComponentExts,
  OptionsTypeScriptWithTypes,
} from '../types'

import { GLOB_TS, GLOB_TSX } from '../global'
import { renameRules, interopDefault } from '../utils'

export async function typescript(
  options: OptionsFiles & OptionsComponentExts & OptionsOverrides & OptionsTypeScriptWithTypes,
): Promise<Config> {
  const { overrides = {}, componentExts = [] } = options

  const files = options.files ?? [
    GLOB_TS,
    GLOB_TSX,
    ...componentExts.map((ext: string) => `**/*.${ext}`),
  ]

  const [pluginTs, parserTs] = await Promise.all([
    interopDefault(import('@typescript-eslint/eslint-plugin')),
    interopDefault(import('@typescript-eslint/parser')),
  ] as const)

  const tsconfigPath = options?.tsconfigPath
    ? options.tsconfigPath
    : undefined

  const isTypeAware = !!tsconfigPath

  const typeAwareRules: Config['rules'] = {
    'dot-notation': 'off',
    'no-implied-eval': 'off',
    'ts/await-thenable': 'error',
    'ts/dot-notation': ['error', { allowKeywords: true }],
    'ts/no-floating-promises': 'error',
    'ts/no-for-in-array': 'error',
    'ts/no-implied-eval': 'error',
    'ts/no-misused-promises': 'error',
    'ts/no-unnecessary-type-assertion': 'error',
    'ts/no-unsafe-argument': 'error',
    'ts/no-unsafe-assignment': 'error',
    'ts/no-unsafe-call': 'error',
    'ts/no-unsafe-member-access': 'error',
    'ts/no-unsafe-return': 'error',
    'ts/promise-function-async': 'error',
    'ts/restrict-plus-operands': 'error',
    'ts/restrict-template-expressions': 'error',
    'ts/return-await': ['error', 'in-try-catch'],
    'ts/strict-boolean-expressions': [
      'error',
      { allowNullableBoolean: true, allowNullableObject: true },
    ],
    'ts/switch-exhaustiveness-check': 'error',
    'ts/unbound-method': 'error',
  }

  return {
    files,
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ...isTypeAware
          ? {
              projectService: {
                allowDefaultProject: ['*.js'],
                defaultProject: tsconfigPath,
              },
              tsconfigRootDir: process.cwd(),

            }
          : {},
      },
    },
    plugins: { ts: pluginTs },
    rules: {
      ...renameRules(
        pluginTs.configs['eslint-recommended'].overrides![0].rules!,
        { '@typescript-eslint': 'ts' },
      ),
      ...renameRules(
        pluginTs.configs.strict.rules!,
        { '@typescript-eslint': 'ts' },
      ),
      'no-dupe-class-members': 'off',
      'no-redeclare': 'off',
      'no-use-before-define': 'off',
      'no-useless-constructor': 'off',
      'ts/ban-ts-comment': [
        'error',
        { 'ts-expect-error': 'allow-with-description' },
      ],
      'ts/consistent-type-definitions': ['error', 'interface'],
      'ts/consistent-type-imports': [
        'error',
        {
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports',
          prefer: 'type-imports',
        },
      ],
      'ts/method-signature-style': ['error', 'property'],
      'ts/no-dupe-class-members': 'error',
      'ts/no-dynamic-delete': 'off',
      'ts/no-empty-object-type': ['error', { allowInterfaces: 'always' }],
      'ts/no-explicit-any': 'off',
      'ts/no-extraneous-class': 'off',
      'ts/no-import-type-side-effects': 'error',
      'ts/no-invalid-void-type': 'off',
      'ts/no-non-null-assertion': 'off',
      'ts/no-redeclare': ['error', { builtinGlobals: false }],
      'ts/no-require-imports': 'error',
      'ts/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTaggedTemplates: true,
          allowTernary: true,
        },
      ],
      'ts/no-unused-vars': 'off',
      'ts/no-use-before-define': [
        'error',
        {
          classes: false,
          functions: false,
          variables: true,
        },
      ],
      'ts/no-useless-constructor': 'off',
      'ts/no-wrapper-object-types': 'error',
      'ts/triple-slash-reference': 'off',
      'ts/unified-signatures': 'off',
      ...isTypeAware
        ? typeAwareRules
        : {},
      ...overrides,
    },
  }
}
