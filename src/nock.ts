import Nock = require('nock')

import {NockCallback, NockOptions} from './types'

export function nock(host: string, options: NockCallback | NockOptions, cb?: NockCallback) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }
  if (cb === undefined) throw new Error('callback is undefined')

  let nock: typeof Nock
  try {
    nock = require('nock')
  } catch {
    return {
      run() {
        require('nock')
      },
    }
  }
  const intercepter = nock(host, options)
  return {
    async run(ctx: {nock: number}) {
      ctx.nock = ctx.nock || 0
      await cb!(intercepter)
      ctx.nock++
    },
    finally(ctx: {error?: Error; nock: number}) {
      if (!ctx.error) intercepter.done()
      ctx.nock--
      if (ctx.nock === 0) nock.cleanAll()
    },
  }
}
