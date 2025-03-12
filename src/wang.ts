import { base, ignores, javascript, typescript } from './config/index'
import { defineConfig } from "eslint/config";
import { Config, Configs,OptionsConfig, OptionsOverrides } from './types';
import { isPackageExists } from "local-pkg"

const VuePackages = [
    'vue'
]

export function resolveOptions<k extends keyof OptionsConfig>(
    options: OptionsConfig,
    key: k,
): OptionsOverrides {
    if (typeof options[key] === 'boolean') return {}
    return (options[key] as OptionsOverrides) || {}
}

export function getOverrides<k extends keyof OptionsConfig>(
    options: OptionsConfig,
    key: k,
): Config['rules'] {
    const typescriptOptions = resolveOptions(options, key)
    return {
        ...(options.overrides as any)?.[key],
        ...'overrides' in typescriptOptions
            ? typescriptOptions.overrides
            : {},
    }
}
export function w(options?: OptionsConfig, ...userConfigs: Configs): Configs {
    options = options || {}
    const {
        componentExts = [],
        typescript: enableTypeScript = isPackageExists('typescript'),
        vue: enableVue = VuePackages.some(i => isPackageExists(i))
    } = options

    const configs: Configs = []

    configs.push(
        base(),
        ignores(options.ignores),
        javascript({ overrides: getOverrides(options, 'javascript') })
    )

    if (enableVue) {
        componentExts.push('vue')
    }

    const typescriptOptions = getOverrides(options, 'typescript')
    if (enableTypeScript) {
        configs.push(typescript({ ...typescriptOptions, overrides: getOverrides(options, 'typescript'), componentExts }))
    }

    return defineConfig(configs.concat(userConfigs))

}