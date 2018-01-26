// tslint:disable callable-types
// tslint:disable no-unused

import * as _ from 'lodash'

import * as Types from './types'

const context: Types.Context = {
  test: it,
  plugins: {},
  chain: [],
}

const base = <I extends Types.Context>(context: I): Types.Base<I, {}> => {
  const end = (arg1: any, cb: any) => {
    context = assignWithProps({}, context)
    if (_.isFunction(arg1)) {
      cb = arg1
      arg1 = undefined
    }
    if (!arg1) arg1 = context.expectation || 'test'
    async function run(done?: Types.MochaDone) {
      if (cb) {
        context.chain = [...context.chain, {
          run: async (input: any) => {
            await cb(input, done)
          }
        }]
      }
      for (let i = 0; i < context.chain.length; i++) {
        const handleError = async (err: Error): Promise<boolean> => {
          context.error = err
          i++
          const handler = context.chain[i]
          if (!handler || !handler.catch) return false
          try {
            await handler.catch(context)
            delete context.error
            return true
          } catch (err) {
            return handleError(err)
          }
        }
        const next = context.chain[i]
        try {
          if (next.run) await next.run(context)
        } catch (err) {
          if (!await handleError(err)) break
        }
      }
      for (let p of context.chain.reverse()) {
        if (p.finally) await p.finally(context)
      }
      if (context.error) throw context.error
    }
    function runWithDone(done: MochaDone) {
      run(done).catch(done)
    }
    return context.test(arg1, (cb && cb.length === 2) ? runWithDone : () => run())
  }
  return {
    ...Object.entries(context.plugins)
    .reduce((plugins, [k, v]) => {
      plugins[k] = (...args: any[]) => {
        const plugin = v(...args)
        if (plugin.init) plugin.init(context)
        return base({
          ...context as any,
          chain: [...context.chain, plugin],
        })
      }
      return plugins
    }, {} as any),
    register(k: any, v: any) {
      return base({
        ...context as any,
        plugins: {
          ...context.plugins,
          [k]: v,
        },
      })
    },
    do(cb) {
      return base({
        ...context as any,
        chain: [...context.chain, {run: (input: any) => cb(input)}]
      })
    },
    finally(cb) {
      return base({
        ...context as any,
        chain: [...context.chain, {finally: (input: any) => cb(input)}]
      })
    },
    add(key, cb) {
      return base({
        ...context as any,
        chain: [...context.chain, {
          run: async (ctx: any) => {
            ctx[key] = await cb(ctx)
          }
        }]
      })
    },
    end,
    it: end,
  }
}

function assignWithProps(target: any, ...sources: any[]) {
  sources.forEach(source => {
    if (!source) return
    let descriptors = Object.keys(source).reduce((descriptors: any, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key)
      return descriptors
    }, {})
    // by default, Object.assign copies enumerable Symbols too
    Object.getOwnPropertySymbols(source).forEach(sym => {
      let descriptor = Object.getOwnPropertyDescriptor(source, sym) as any
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor
      }
    })
    Object.defineProperties(target, descriptors)
  })
  return target
}

export default base(context)
.register('skip', () => ({
  init: ctx => {ctx.test = it.skip}
}))
.register('only', () => ({
  init: ctx => {ctx.test = it.only}
}))
