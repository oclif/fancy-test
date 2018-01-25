import * as Nock from 'nock'

import {Next} from './base'

export type NockCallback = (nock: Nock.Scope) => any

export default async (next: Next<{nock: number}>, ctx: any, host: string, cb: NockCallback) => {
  const count = (ctx.nock as number || 0) + 1
  const nock: typeof Nock = require('nock')
  const intercepter = nock(host)
  await cb(intercepter)
  try {
    await next({nock: count})
    intercepter.done()
  } finally {
    if (count === 1) nock.cleanAll()
  }
}

export {Scope as NockScope} from 'nock'
