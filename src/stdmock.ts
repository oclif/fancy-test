import * as mock from 'stdout-stderr'

import {Plugin} from './base'

export type Return<T extends 'stdout' | 'stderr'> = {
  readonly [P in T]: string
}

export interface StdmockOptions {
  print?: boolean
  stripColor?: boolean
}

const create = <T extends 'stdout' | 'stderr'>(std: T) => (async (next, _, opts: StdmockOptions = {}) => {
  mock[std].start()
  mock[std].print = opts.print === true
  mock[std].stripColor = opts.stripColor !== false
  try {
    await next({
      get [std]() { return mock[std].output }
    } as Return<T>)
  } finally {
    mock[std].stop()
  }
}) as Plugin<Return<T>, StdmockOptions>

export const stdout = create('stdout')
export const stderr = create('stderr')
