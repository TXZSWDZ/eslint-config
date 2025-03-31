import type { Config, Configs, OptionsConfig, OptionsOverrides } from './types'

import { defineConfig } from 'eslint/config'
import { isPackageExists } from 'local-pkg'

import { base, formatters, ignores, imports, javascript, perfectionist, stylistic, typescript } from './config/index'

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
    stylistic: enableStylistic = true,
    imports: enableImports = true,
    perfectionist: enablePerfectionist = true,
    vue: enableVue = VuePackages.some(i => isPackageExists(i)),
  } = options

  const configs: Configs = []

  configs.push(
    base(),
    ignores(options.ignores),
    javascript({ overrides: getOverrides(options, 'javascript') }),
  )

  if (enableVue) {
    componentExts.push('vue')
  }

  const typescriptOptions = resolveSubOptions(options, 'typescript')
  if (enableTypeScript) {
    configs.push(await typescript({
      ...typescriptOptions,
      overrides: getOverrides(options, 'typescript'),
      componentExts,
    }))
  }

  const stylisticOptions = resolveSubOptions(options, 'stylistic')
  if (enableStylistic) {
    configs.push(await stylistic({
      ...stylisticOptions,
      overrides: getOverrides(options, 'stylistic'),
    }))
  }

  if (options.formatters) {
    configs.push(...await formatters(options.formatters, typeof stylisticOptions === 'boolean' ? {} : stylisticOptions))
  }

  if (enableImports) {
    configs.push(await imports({ overrides: getOverrides(options, 'imports') }))
  }

  if (enablePerfectionist) {
    configs.push(await perfectionist({ overrides: getOverrides(options, 'perfectionist') }))
  }

  return defineConfig(configs.concat(userConfigs))
}
