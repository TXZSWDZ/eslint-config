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

export interface OptionsTypeScriptWithTypes {
    tsconfigPath?: string
}


export type OptionsTypescript = OptionsTypeScriptWithTypes & OptionsOverrides


export interface OptionsComponentExts {
    /**
     * 组件的附加扩展
     * 
     * @example ['vue']
     * @default []
     */
    componentExts?: string[]
}

export interface OptionsConfig extends OptionsComponentExts {
    ignores?: string[]
    javascript?: OptionsOverrides
    /**
     * 是否启用typescript
     * 
     * @default 基于依赖项的自动检测
     */
    typescript?: boolean | OptionsTypescript

    /**
     * 是否启用vue
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