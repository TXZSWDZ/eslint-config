import type { Linter } from 'eslint'

import type { Awaitable } from '../types'

export async function concat<T extends Linter.Config = Linter.Config>(...configs: Awaitable<T | T[]>[]): Promise<T[]> {
  const resolved = await Promise.all(configs)
  return resolved.flat() as T[]
}
