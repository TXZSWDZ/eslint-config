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
   * Enable stylistic rules
   *
   * @default
   * true
   */

  stylistic?: boolean | (StylisticConfig & OptionsOverrides)

  /**
   * Enable format files.
   *
   * Requires installing:
   * -`eslint-plugin-format`
   *
   * @default
   * false
   */
  formatters?: boolean | OptionsFormatters

  /**
   * Enable Vue support
   *
   * @default
   * Automatically detected according to package.json
   */
  vue?: boolean | OptionsOverrides

  overrides?: {
    javascript?: Config['rules']
    typescript?: Config['rules']
    vue?: Config['rules']
  }
}
