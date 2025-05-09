import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'
import type { Linter } from 'eslint'

export type Awaitable<T> = T | Promise<T>

export type Rules = Record<string, any>

export type Config = Omit<Linter.Config<Linter.RulesRecord & Rules>, 'plugins'> & {
  plugins?: Record<string, any>
}

export type Configs = Config[]

export interface OptionsOverrides {
  overrides?: Config['rules']
}

export interface OptionsFiles {
  /**
   * 自定义文件范围
   */
  files?: string[]
}

export interface OptionsComponentExts {
  /**
   * 组件的附加扩展
   *
   * @example ['vue']
   * @default
   * []
   */
  componentExts?: string[]
}

export interface OptionsTypeScriptWithTypes {
  tsconfigPath?: string
}

export type OptionsTypescript = OptionsTypeScriptWithTypes & OptionsOverrides

export interface StylisticConfig
  extends Pick<StylisticCustomizeOptions, 'indent' | 'quotes' | 'jsx' | 'semi'> {
}

export interface OptionsStylistic {
  stylistic?: boolean | StylisticConfig
}

export interface OptionsFormatters {
  // html
  html?: boolean
  // css、less、sass、scss
  css?: boolean
  less?: boolean
  scss?: boolean

}

export interface OptionsVue extends OptionsOverrides {
  /**
   * Vue version. Apply different rules set from `eslint-plugin-vue`.
   *
   * @default
   * 3
   */
  vueVersion?: 2 | 3
  /**
   * Help check a11y issue. Apply rules set from `eslint-plugin-vuejs-accessibility`.
   *
   * @default
   * false
   */
  a11y?: boolean
}

export interface OptionsUnocss extends OptionsOverrides {
  /**
   * @default
   * true
   */
  attributify?: boolean

  /**
   * @default
   * false
   */
  strict?: boolean

}

export interface OptionsConfig extends OptionsComponentExts {
  ignores?: string[]

  /**
   * Core rules. Can't be disabled.
   */
  javascript?: OptionsOverrides

  /**
   * Enable typescript rules
   *
   * @default
   * Automatically detected according to package.json
   */
  typescript?: boolean | OptionsTypescript
  /**
   * Enable j\tsx files
   *
   * @default
   * false
   */
  jsx?: boolean

  /**
   * Enable stylistic rules
   *
   * @default
   * true
   */

  stylistic?: boolean | (StylisticConfig & OptionsOverrides)

  /**
   * Enable format files.
   *
   * Requires installing: `eslint-plugin-format`
   *
   * @default
   * false
   */
  formatters?: boolean | OptionsFormatters

  /**
   * Enable imports rules
   *
   * @default
   * true
   */
  imports?: boolean | OptionsOverrides

  /**
   * Enable perfectionist rules
   *
   * @default
   * true
   */
  perfectionist?: boolean | OptionsOverrides

  /**
   * Enable jsonc rules
   *
   * @default
   * true
   */
  jsonc?: boolean | OptionsOverrides

  /**
   * Enable YML support
   *
   * @default
   * true
   */
  yaml?: boolean | OptionsOverrides

  /**
   * Enable Vue support
   *
   * @default
   * Automatically detected according to package.json
   */
  vue?: boolean | OptionsVue

  /**
   * Enable Vue support
   *
   * @default
   * false
   */
  react?: boolean | OptionsOverrides

  /**
   * Enable UnoCSS support
   *
   * @default
   * false
   */
  unocss?: boolean | OptionsUnocss

  overrides?: {
    javascript?: Config['rules']
    typescript?: Config['rules']
    imports?: Config['rules']
    perfectionist?: Config['rules']
    jsonc?: Config['rules']
    yaml?: Config['rules']
    vue?: Config['rules']
    react?: Config['rules']
    unocss?: Config['rules']
  }
}
