import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import { GLOB_TS, GLOB_TSX } from '../global'
import { OptionsFiles, OptionsOverrides, OptionsComponentExts, Config } from "src/types";

export function typescript(options: OptionsFiles & OptionsComponentExts & OptionsOverrides): Config {

    const {
        overrides = {},
        componentExts = [],
    } = options

    const files = options.files ?? [
        GLOB_TS,
        GLOB_TSX,
        ...componentExts.map((ext: string) => `**/*.${ext}`),
    ]

    return {
        files,
        languageOptions: {
            parser: typescriptParser,
        },
        plugins: {
            "ts": typescriptPlugin,
        },
        rules: {
            'ts/no-unused-vars': 'error',
            ...overrides
        }
    }
}