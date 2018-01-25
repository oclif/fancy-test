// tslint:disable callable-types
// tslint:disable no-unused

import * as _ from 'lodash'
import * as mocha from 'mocha'

export interface Next<O> {
  (output: O): Promise<void>
}

export interface PluginBuilder<O, InitO, A1 = undefined, A2 = undefined, A3 = undefined, A4 = undefined> {
  (arg1?: A1, arg2?: A2, arg3?: A3, arg4?: A4): Plugin<O, InitO>
}
export interface Plugin<O = {}, InitO = {}> {
  (context: any): Promise<O> | O | void
  init?(context: any): InitO
  finally?(context: any): any
  catch?(context: any): any
}

export interface Plugins {[k: string]: [object]}

export interface Base<T extends Plugins> {
  (): Fancy<{ test: typeof it, error?: Error }, T>
  register<K extends string, O, InitO, A1, A2, A3, A4>(k: K, v: PluginBuilder<O, InitO, A1, A2, A3, A4>): Base<T & {[P in K]: [O, InitO, A1, A2, A3, A4]}>
}

export interface Callback<T, U> {
  (this: T, context: U): any
}
export interface MochaCallback<U> extends Callback<mocha.ITestCallbackContext, U> {}

export type Fancy<I extends object, T extends Plugins> = {
  end(expectation: string, cb?: (context: I) => any): void
  end(cb?: (context: I) => any): void
  add<K extends string, O>(key: K, cb: (context: I) => Promise<O> | O): Fancy<I & {[P in K]: O}, T>
  run(cb: (context: I) => any): Fancy<I, T>
} & {[P in keyof T]: (arg1?: T[P][2], arg2?: T[P][3], arg3?: T[P][4], arg4?: T[P][5]) => Fancy<I & T[P][0], T>}

const fancy = <I extends object, T extends Plugins>(context: any, plugins: any, chain: Plugin<any, any>[] = []): Fancy<I, T> => {
  return {
    ...Object.entries(plugins)
    .reduce((fns, [k, v]) => {
      fns[k] = (...args: any[]) => {
        const plugin = v(...args)
        if (plugin.init) context = assignWithProps({}, context, v.init(context))
        return fancy(context, plugins, [...chain, plugin])
      }
      return fns
    }, {} as any),
    run(cb) {
      return fancy(context, plugins, [...chain, async (input: any) => {
        await cb(input)
      }])
    },
    add(key, cb) {
      return fancy(context, plugins, [...chain, async (input: any) => {
        const output = await cb(input)
        return {[key]: output}
      }])
    },
    end(arg1: any, cb: any) {
      if (_.isFunction(arg1)) {
        cb = arg1
        arg1 = undefined
      }
      if (!arg1) arg1 = context.expectation || 'test'
      if (cb) {
        chain = [...chain, async (input: any) => {
          await cb(input)
        }]
      }
      return context.test(arg1, async function () {
        for (let i = 0; i < chain.length; i++) {
          const handleError = async (err: Error): Promise<boolean> => {
            context.error = err
            i++
            const handler = chain[i]
            if (!handler || !handler.catch) return false
            try {
              await handler.catch(context)
              delete context.error
              return true
            } catch (err) {
              return handleError(err)
            }
          }
          const next = chain[i]
          try {
            context = assignWithProps({}, context, await next(context))
          } catch (err) {
            if (!await handleError(err)) break
          }
        }
        for (let p of chain.reverse()) {
          if (p.finally) await p.finally(context)
        }
        if (context.error) throw context.error
      })
    },
  }
}

function base<T extends Plugins>(plugins: any): Base<T> {
  const f = (() => fancy({
    test: it,
  }, plugins)) as any
  f.register = (k: string, v: any) => base({...plugins as any, [k]: v})
  return f
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

export default base<{}>({})
.register('skip', () => {
  const plugin = (() => {}) as any
  plugin.init = () => ({test: it.skip})
  return plugin
})
.register('only', () => {
  const plugin = (() => {}) as any
  plugin.init = () => ({test: it.only})
  return plugin
})
