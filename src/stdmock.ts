import * as mock from 'stdout-stderr'

import {Plugin} from './base'

export type Return<T extends 'stdout' | 'stderr'> = {
  readonly [P in T]: string
}

const create = <T extends 'stdout' | 'stderr'>(std: T) => (async next => {
  mock[std].start()
  try {
    await next({
      get [std]() { return mock[std].output }
    } as Return<T>)
  } finally {
    mock[std].stop()
  }
}) as Plugin<Return<T>>

export const stdout = create('stdout')
export const stderr = create('stderr')
