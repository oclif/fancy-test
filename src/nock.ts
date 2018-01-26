import * as Nock from 'nock'

export {Scope as NockScope} from 'nock'

export default (host: string, cb: (nock: Nock.Scope) => any) => {
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
