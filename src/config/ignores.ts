import type { Config } from '../types'

import { GLOB_EXCLUDE } from '../global'

export function ignores(userIgnores: string[] = []): Config {
  return {
    ignores: [
      ...GLOB_EXCLUDE,
      ...userIgnores,
    ],
  }
}
