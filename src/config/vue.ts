import type { OptionsOverrides, OptionsStylistic, OptionsVue } from '../types'

import { GLOB_VUE } from '../global'
import { ensurePackages, interopDefault } from '../utils/index'

export async function vue(options: OptionsVue & OptionsStylistic & { typescript: boolean } & OptionsOverrides): Promise<any> {
  const {
    overrides = {},
    stylistic = true,
    vueVersion = 3,
    a11y = false,
  } = options

  const {
    indent = 2,
  } = typeof stylistic === 'boolean' ? {} : stylistic

  if (a11y) {
    await ensurePackages([
      'eslint-plugin-vuejs-accessibility',
    ])
  }

  const [
    pluginVue,
    parserVue,
    pluginVueA11y,
  ] = await Promise.all([
    interopDefault(import('eslint-plugin-vue')),
    interopDefault(import('vue-eslint-parser')),
    ...a11y ? [interopDefault(import('eslint-plugin-vuejs-accessibility'))] : [],
  ] as const)

  return [
    {

      languageOptions: {
        globals: {
          computed: 'readonly',
          defineEmits: 'readonly',
          defineExpose: 'readonly',
          defineProps: 'readonly',
          onMounted: 'readonly',
          onUnmounted: 'readonly',
          reactive: 'readonly',
          ref: 'readonly',
          shallowReactive: 'readonly',
          shallowRef: 'readonly',
          toRef: 'readonly',
          toRefs: 'readonly',
          watch: 'readonly',
          watchEffect: 'readonly',
        },
      },
      plugins: {
        vue: pluginVue,
        ...a11y ? { 'vue-a11y': pluginVueA11y } : {},
      },
    },
    {
      files: [GLOB_VUE],
      languageOptions: {
        parser: parserVue,
        parserOptions: {
          ecmaFeatures: {
            jsx: true,
          },
          extraFileExtensions: ['.vue'],
          parser: options.typescript
            ? await interopDefault(import('@typescript-eslint/parser')) as any
            : null,
          sourceType: 'module',
        },
      },
      processor: pluginVue.processors['.vue'],
      rules: {
        ...pluginVue.configs.base.rules,
        ...vueVersion === 2
          ? {
              ...pluginVue.configs['vue2-essential'].rules as any,
              ...pluginVue.configs['vue2-strongly-recommended'].rules as any,
              ...pluginVue.configs['vue2-recommended'].rules as any,
            }
          : {
              ...pluginVue.configs['flat/essential'].map(c => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}) as any,
              ...pluginVue.configs['flat/strongly-recommended'].map(c => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}) as any,
              ...pluginVue.configs['flat/recommended'].map(c => c.rules).reduce((acc, c) => ({ ...acc, ...c }), {}) as any,
            },

        'antfu/no-top-level-await': 'off',
        // 'node/prefer-global/process': 'off',
        'ts/explicit-function-return-type': 'off',

        'vue/block-order': ['error', {
          order: ['script', 'template', 'style'],
        }],
        'vue/component-name-in-template-casing': ['error', 'PascalCase'],
        'vue/component-options-name-casing': ['error', 'PascalCase'],
        // this is deprecated
        'vue/component-tags-order': 'off',
        'vue/custom-event-name-casing': ['error', 'camelCase'],
        'vue/define-macros-order': ['error', {
          order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
        }],
        'vue/dot-location': ['error', 'property'],
        'vue/dot-notation': ['error', { allowKeywords: true }],
        'vue/eqeqeq': ['error', 'smart'],
        'vue/html-indent': ['error', indent],
        'vue/html-quotes': ['error', 'double'],
        'vue/max-attributes-per-line': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/no-dupe-keys': 'off',
        'vue/no-empty-pattern': 'error',
        'vue/no-irregular-whitespace': 'error',
        'vue/no-loss-of-precision': 'error',
        'vue/no-restricted-syntax': [
          'error',
          'DebuggerStatement',
          'LabeledStatement',
          'WithStatement',
        ],
        'vue/no-restricted-v-bind': ['error', '/^v-/'],
        'vue/no-setup-props-reactivity-loss': 'off',
        'vue/no-sparse-arrays': 'error',
        'vue/no-unused-refs': 'error',
        'vue/no-useless-v-bind': 'error',
        'vue/no-v-html': 'off',
        'vue/object-shorthand': [
          'error',
          'always',
          {
            avoidQuotes: true,
            ignoreConstructors: false,
          },
        ],
        'vue/prefer-separate-static-class': 'error',
        'vue/prefer-template': 'error',
        'vue/prop-name-casing': ['error', 'camelCase'],
        'vue/require-default-prop': 'off',
        'vue/require-prop-types': 'off',
        'vue/space-infix-ops': 'error',
        'vue/space-unary-ops': ['error', { nonwords: false, words: true }],

        ...stylistic
          ? {
              'vue/array-bracket-spacing': ['error', 'never'],
              'vue/arrow-spacing': ['error', { after: true, before: true }],
              'vue/block-spacing': ['error', 'always'],
              'vue/block-tag-newline': ['error', {
                multiline: 'always',
                singleline: 'always',
              }],
              'vue/brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
              'vue/comma-dangle': ['error', 'always-multiline'],
              'vue/comma-spacing': ['error', { after: true, before: false }],
              'vue/comma-style': ['error', 'last'],
              'vue/html-comment-content-spacing': ['error', 'always', {
                exceptions: ['-'],
              }],
              'vue/key-spacing': ['error', { afterColon: true, beforeColon: false }],
              'vue/keyword-spacing': ['error', { after: true, before: true }],
              'vue/object-curly-newline': 'off',
              'vue/object-curly-spacing': ['error', 'always'],
              'vue/object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
              'vue/operator-linebreak': ['error', 'before'],
              'vue/padding-line-between-blocks': ['error', 'always'],
              'vue/quote-props': ['error', 'consistent-as-needed'],
              'vue/space-in-parens': ['error', 'never'],
              'vue/template-curly-spacing': 'error',
            }
          : {},

        ...a11y
          ? {
              'vue-a11y/alt-text': 'error',
              'vue-a11y/anchor-has-content': 'error',
              'vue-a11y/aria-props': 'error',
              'vue-a11y/aria-role': 'error',
              'vue-a11y/aria-unsupported-elements': 'error',
              'vue-a11y/click-events-have-key-events': 'error',
              'vue-a11y/form-control-has-label': 'error',
              'vue-a11y/heading-has-content': 'error',
              'vue-a11y/iframe-has-title': 'error',
              'vue-a11y/interactive-supports-focus': 'error',
              'vue-a11y/label-has-for': 'error',
              'vue-a11y/media-has-caption': 'warn',
              'vue-a11y/mouse-events-have-key-events': 'error',
              'vue-a11y/no-access-key': 'error',
              'vue-a11y/no-aria-hidden-on-focusable': 'error',
              'vue-a11y/no-autofocus': 'warn',
              'vue-a11y/no-distracting-elements': 'error',
              'vue-a11y/no-redundant-roles': 'error',
              'vue-a11y/no-role-presentation-on-focusable': 'error',
              'vue-a11y/no-static-element-interactions': 'error',
              'vue-a11y/role-has-required-aria-props': 'error',
              'vue-a11y/tabindex-no-positive': 'warn',
            }
          : {},

        ...overrides,
      },
    },
  ]
}
