import * as Nock from 'nock'

import {Plugin} from './base'

export type NockCallback = (nock: Nock.Scope) => any

export default (host: string, cb: NockCallback) => {
  const nock: typeof Nock = require('nock')
  const intercepter = nock(host)
  const plugin = (async ctx => {
    await cb(intercepter)
    const count = (ctx.nock as number || 0) + 1
    return {nock: count}
  }) as Plugin<{nock: number}>
  plugin.finally = ctx => {
    if (!ctx.error) intercepter.done()
    ctx.nock--
    if (ctx.nock === 0) nock.cleanAll()
  }
  return plugin
}

export {Scope as NockScope} from 'nock'
