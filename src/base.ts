// tslint:disable callable-types
// tslint:disable no-unused

import * as _ from 'lodash'

export type PluginBuilder<I, A1 = undefined, A2 = undefined, A3 = undefined, A4 = undefined> = (arg1?: A1, arg2?: A2, arg3?: A3, arg4?: A4) => Plugin<I>

export interface Plugin<I> {
  run?(context: I): any
  init?(context: I): any
  finally?(context: I): any
  catch?(context: I): any
}

export interface Context {
  test: (typeof it | typeof it.skip)
  plugins: {[k: string]: PluginBuilder<any, any, any, any, any>}
  expectation?: string
  chain: Plugin<any>[]
  error?: Error & {code?: string}
}

const context: Context = {
  test: it,
  plugins: {},
  chain: [],
}

export interface PluginDef {
  output: object
  a1: any
  a2: any
  a3: any
  a4: any
}

export interface Plugins {[k: string]: PluginDef}

export type Base<I extends Context, T extends Plugins> = {
  it: {
    (expectation: string, cb?: (context: I) => any): void
    (cb?: (context: I) => any): void
  }
  end: {
    (expectation: string, cb?: (context: I) => any): void
    (cb?: (context: I) => any): void
  }
  add<K extends string, O>(key: K, cb: (context: I) => Promise<O> | O): Base<I & {[P in K]: O}, T>
  do(cb: (context: I) => any): Base<I, T>
  register<K extends string, O, A1, A2, A3, A4>(key: K, plugin: (arg1?: A1, arg2?: A2, arg3?: A3, arg4?: A4) => Plugin<O & I>): Base<I, T & {[P in K]: {output: O, a1: A1, a2: A2, a3: A3, a4: A4}}>
} & {[P in keyof T]: (arg1?: T[P]['a1'], arg2?: T[P]['a2'], arg3?: T[P]['a3'], arg4?: T[P]['a4']) => Base<T[P]['output'] & I, T>}

const base = <I extends Context>(context: I): Base<I, {}> => {
  const end = (arg1: any, cb: any) => {
    context = assignWithProps({}, context)
    if (_.isFunction(arg1)) {
      cb = arg1
      arg1 = undefined
    }
    if (!arg1) arg1 = context.expectation || 'test'
    if (cb) {
      context.chain = [...context.chain, {
        run: async (input: any) => {
          await cb(input)
        }
      }]
    }
    return context.test(arg1, async function () {
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
    })
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
