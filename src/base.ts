import * as _ from 'lodash'

import * as Types from './types'

const context: Types.Context = {
  test: it,
  plugins: {},
  chain: [],
}

function assignWithProps(target: any, ...sources: any[]) {
  sources.forEach(source => {
    if (!source) return
    const descriptors = Object.keys(source).reduce((descriptors: any, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key)
      return descriptors
    }, {})
    // by default, Object.assign copies enumerable Symbols too
    Object.getOwnPropertySymbols(source).forEach(sym => {
      const descriptor = Object.getOwnPropertyDescriptor(source, sym) as any
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor
      }
    })
    Object.defineProperties(target, descriptors)
  })
  return target
}

const base = <I extends Types.Context>(context: I): Types.Base<I, {}> => {
  const end = (arg1: any, cb: Types.MochaCallback<I>) => {
    const originalContext = context
    if (_.isFunction(arg1)) {
      cb = arg1
      arg1 = undefined
    }
    if (!arg1) arg1 = context.expectation || 'test'
    async function run(this: Types.ITestCallbackContext, done?: Types.MochaDone) {
      context = assignWithProps({}, originalContext)
      if (context.retries) this.retries(context.retries)
      if (cb) {
        context.chain = [...context.chain, {
          run: async (input: any) => {
            await cb.call(this, input, done!)
          },
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
          } catch (error: any) {
            return handleError(error)
          }
        }
        const next = context.chain[i]
        try {
          // eslint-disable-next-line no-await-in-loop
          if (next.run) await next.run(context)
        } catch (error: any) {
          // eslint-disable-next-line no-await-in-loop
          if (!await handleError(error)) break
        }
      }
      for (const p of context.chain.reverse()) {
        // eslint-disable-next-line no-await-in-loop
        if (p.finally) await p.finally(context)
      }
      if (context.error) throw context.error
    }
    return context.test(arg1, (cb && cb.length === 2) ? function (done) {
      if (context.timeout) this.timeout(context.timeout)
      run.call(this, done).catch(done)
    } : function () {
      if (context.timeout) this.timeout(context.timeout)
      return run.call(this)
    })
  }
  return {
    ...Object.entries(context.plugins)
    .reduce((plugins, [k, v]) => {
      plugins[k] = (...args: any[]) => {
        const plugin = v(...args)
        // clone context first
        const c = {...context as any}
        if (plugin.init) plugin.init(c)
        return base({
          ...c,
          chain: [...c.chain, plugin],
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
        chain: [...context.chain, {run: (input: any) => cb(input)}],
      })
    },
    finally(cb) {
      return base({
        ...context as any,
        chain: [...context.chain, {finally: (input: any) => cb(input)}],
      })
    },
    add(key, v) {
      return base({
        ...context as any,
        chain: [...context.chain, {
          run: async (ctx: any) => {
            // eslint-disable-next-line require-atomic-updates
            ctx[key] = await (_.isFunction(v) ? v(ctx) : v)
          },
        }],
      })
    },
    end,
    it: end,
  }
}

export default base(context)
.register('skip', () => ({
  init: ctx => {
    ctx.test = it.skip
  },
}))
.register('only', () => ({
  init: ctx => {
    ctx.test = it.only
  },
}))
.register('retries', (count: number) => ({
  init: ctx => {
    ctx.retries = count
  },
}))
