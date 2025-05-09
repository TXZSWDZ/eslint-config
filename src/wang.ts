import type { Awaitable, Config, Configs, OptionsConfig, OptionsOverrides } from './types'

import { defineConfig } from 'eslint/config'
import { isPackageExists } from 'local-pkg'

import { base, formatters, ignores, imports, javascript, jsonc, jsx, node, perfectionist, react, stylistic, typescript, unocss, vue, yaml } from './config/index'
import { concat } from './utils/index'

const VuePackages = [
  'vue',
]

export function resolveSubOptions<K extends keyof OptionsConfig>(options: OptionsConfig, key: K) {
  return typeof options[key] === 'boolean'
    ? {} as any
    : options[key] || {} as any
}

export function resolveOptions<k extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: k,
): OptionsOverrides {
  if (typeof options[key] === 'boolean')
    return {}
  return (options[key] as OptionsOverrides) || {}
}

export function getOverrides<k extends keyof OptionsConfig>(
  options: OptionsConfig,
  key: k,
): Config['rules'] {
  const currentOptions = resolveOptions(options, key)
  return {
    ...(options.overrides as Config['rules'])?.[key],
    ...'overrides' in currentOptions
      ? currentOptions.overrides
      : {},
  }
}
export async function w(options?: OptionsConfig, ...userConfigs: Configs): Promise<Configs> {
  options = options || {}
  const {
    componentExts = [],
    typescript: enableTypeScript = isPackageExists('typescript'),
    jsx: enableJsx = true,
    stylistic: enableStylistic = true,
    imports: enableImports = true,
    perfectionist: enablePerfectionist = true,
    vue: enableVue = VuePackages.some(i => isPackageExists(i)),
    react: enableReact = false,
    unocss: enableUnocss = false,
  } = options

  const configs: Awaitable<Config | Configs>[] = []

  const typescriptOptions = resolveSubOptions(options, 'typescript')
  const stylisticOptions = resolveSubOptions(options, 'stylistic')
  const vueOptions = resolveSubOptions(options, 'vue')

  configs.push(
    base(),
    ignores(options.ignores),
    javascript({ overrides: getOverrides(options, 'javascript') }),
    await node(),
  )

  if (options.jsonc) {
    configs.push(
      await jsonc({
        stylistic: stylisticOptions,
        overrides: getOverrides(options, 'jsonc'),
      }),
    )
  }

  if (options.yaml) {
    configs.push(
      await yaml({
        stylistic: stylisticOptions,
        overrides: getOverrides(options, 'yaml'),
      }),
    )
  }

  if (enableJsx) {
    configs.push(jsx())
  }

  if (enableVue) {
    componentExts.push('vue')
  }

  if (enableTypeScript) {
    configs.push(await typescript({
      ...typescriptOptions,
      overrides: getOverrides(options, 'typescript'),
      componentExts,
    }))
  }

  if (enableStylistic) {
    configs.push(await stylistic({
      ...stylisticOptions,
      overrides: getOverrides(options, 'stylistic'),
    }))
  }

  if (options.formatters) {
    configs.push(await formatters(options.formatters, typeof stylisticOptions === 'boolean' ? {} : stylisticOptions))
  }

  if (enableImports) {
    configs.push(await imports({ overrides: getOverrides(options, 'imports') }))
  }

  if (enablePerfectionist) {
    configs.push(await perfectionist({ overrides: getOverrides(options, 'perfectionist') }))
  }

  if (enableVue) {
    configs.push(await vue(
      {
        ...vueOptions,
        stylistic: stylisticOptions,
        overrides: getOverrides(options, 'vue'),
        typescript: !!enableTypeScript,
      },
    ))
  }

  if (enableReact) {
    configs.push(await react(
      {
        overrides: getOverrides(options, 'react'),
      },
    ))
  }

  if (enableUnocss) {
    configs.push(await unocss(
      {
        ...resolveSubOptions(options, 'unocss'),
        overrides: getOverrides(options, 'unocss'),
      },
    ))
  }

  return defineConfig(await concat(...configs, ...userConfigs))
}
