import Nock = require('nock')

export function nock(host?: string, options?: nock.Callback | nock.Options, cb?: nock.Callback) {
  if (host === undefined) throw new Error('host is undefined')
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
      }
    }
  }
  const intercepter = nock(host, options)
  return {
    async run(ctx: {nock: number}) {
      ctx.nock = ctx.nock || 0
      await cb!(intercepter)
      ctx.nock++
    },
    finally(ctx: {error?: Error, nock: number}) {
      if (!ctx.error) intercepter.done()
      ctx.nock--
      if (ctx.nock === 0) nock.cleanAll()
    },
  }
}

export namespace nock {
  export interface Scope extends Nock.Scope {}
  export interface Options extends Nock.Options {}
  export type Callback = (nock: Scope) => any
}
