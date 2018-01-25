import * as Nock from 'nock'

import {Next} from './base'

export interface NockHosts {[host: string]: Nock.Scope}

export type NockCallback = (nock: Nock.Scope) => any

export default async (next: Next<{nock: NockHosts}>, ctx: any, host: string, cb: NockCallback) => {
  const hosts: NockHosts = ctx.nock || {}
  const nock: typeof Nock = require('nock')
  const api = hosts[host] || nock(host)
  await cb(api)
  await next({nock: hosts})
  api.done()
}

export {Scope as NockScope} from 'nock'
