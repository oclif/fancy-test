import * as _ from 'lodash'
import * as Nock from 'nock'

export function nock(host?: string, cb?: (nock: NockScope) => any) {
  if (_.isUndefined(host)) throw new Error('host is undefined')
  if (_.isUndefined(cb)) throw new Error('callback is undefined')

  const nock: typeof Nock = require('nock')
  const intercepter = nock(host)
  return {
    async run(ctx: {nock: number}) {
      ctx.nock = ctx.nock || 0
      await cb(intercepter)
      ctx.nock++
    },
    finally(ctx: {error?: Error, nock: number}) {
      if (!ctx.error) intercepter.done()
      ctx.nock--
      if (ctx.nock === 0) nock.cleanAll()
    },
  }
}

export interface NockScope extends Nock.Scope {}
