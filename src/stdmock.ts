import * as mock from 'stdout-stderr'

import {Plugin} from './base'

export type Return<T extends 'stdout' | 'stderr'> = {
  readonly [P in T]: string
}

export interface StdmockOptions {
  print?: boolean
  stripColor?: boolean
}

const create = <T extends 'stdout' | 'stderr'>(std: T) => (opts: StdmockOptions = {}) => {
  const plugin = (async () => {
    mock[std].start()
    mock[std].print = opts.print === true
    mock[std].stripColor = opts.stripColor !== false
    return {
      get [std]() { return mock[std].output }
    } as Return<T>
  }) as Plugin<Return<T>>
  plugin.finally = () => {
    mock[std].stop()
  }
  return plugin
}

export const stdout = create('stdout')
export const stderr = create('stderr')
