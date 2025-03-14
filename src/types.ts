import type { Linter } from 'eslint'
import type { StylisticCustomizeOptions } from '@stylistic/eslint-plugin'

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
     * @default []
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

export interface OptionsConfig extends OptionsComponentExts {
  ignores?: string[]
  /**
     * Core rules. Can't be disabled.
     */
  javascript?: OptionsOverrides
  /**
     * Enable typescript rules
     *
     * @default 基于依赖项的自动检测
     */
  typescript?: boolean | OptionsTypescript

  /**
     * Enable stylistic rules
     *
     * @default true
     */

  stylistic?: boolean | (StylisticConfig & OptionsOverrides)

  /**
     * Enable Vue support
     *
     * @default 基于依赖项的自动检测
     */
  vue?: boolean

  overrides?: {
    javascript?: Config['rules']
    typescript?: Config['rules']
    vue?: Config['rules']
  }
}
