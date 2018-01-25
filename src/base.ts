// tslint:disable callable-types
// tslint:disable no-unused

import * as mocha from 'mocha'

export interface Next<O> {
  (output: O): Promise<void>
}

export interface Plugin<O, A1 = undefined, A2 = undefined, A3 = undefined, A4 = undefined> {
  (next: Next<O>, input: any, arg1?: A1, arg2?: A2, arg3?: A3, arg4?: A4): Promise<any>
}

export interface Plugins {[k: string]: [object]}

export interface Base<T extends Plugins> {
  (): Fancy<{}, T>
  register<K extends string, O, A1, A2, A3, A4>(k: K, v: Plugin<O, A1, A2, A3, A4>): Base<T & {[P in K]: [O, A1, A2, A3, A4]}>
}

export interface Callback<T, U> {
  (this: T, context: U): any
}
export interface MochaCallback<U> extends Callback<mocha.ITestCallbackContext, U> {}

export type Fancy<I extends object, T extends Plugins> = {
  it: {
    (expectation: string, callback?: MochaCallback<I>): mocha.ITest
    only(expectation: string, callback?: MochaCallback<I>): mocha.ITest
    skip(expectation: string, callback?: MochaCallback<I>): void
  }
  run<O extends object>(opts: {addToContext: true}, cb: (context: I) => Promise<O> | O): Fancy<I & O, T>
  run(cb: (context: I) => any): Fancy<I, T>
} & {[P in keyof T]: (arg1?: T[P][1], arg2?: T[P][2], arg3?: T[P][3], arg4?: T[P][4]) => Fancy<I & T[P][0], T>}

const fancy = <I extends object, T extends Plugins>(plugins: any, chain: Chain = []): Fancy<I, T> => {
  const __it = (fn: typeof it) => (expectation: string, callback: MochaCallback<I>): any => {
    return fn(expectation, async function () {
      let ctx = {plugins}
      const run = (extra = {}): any => {
        ctx = assignWithProps({}, ctx, extra)
        const [next, args] = chain.shift() || [null, null]
        if (next) return next(run, ctx, ...args as any[])
        if (callback) return callback.call(this, ctx)
      }
      await run()
    })
  }
  const _it = __it(it) as Fancy<I, T>['it']
  _it.only = __it(it.only as any)
  _it.skip = __it(it.skip as any)
  return {
    ...Object.entries(plugins)
    .reduce((fns, [k, v]) => {
      fns[k] = (...args: any[]) => {
        return fancy(plugins, [...chain, [v, args]])
      }
      return fns
    }, {} as any),
    run(opts: any, cb: any) {
      if (!cb) {
        cb = opts
        opts = {}
      }
      return fancy(plugins, [...chain, [async (next: any, input: any) => {
        let output = await cb(input)
        if (opts.addToContext) next(output)
        else next()
      }, []]])
    },
    it: _it,
  }
}

function base<T extends Plugins>(plugins: any): Base<T> {
  const f = (() => fancy(plugins)) as any
  f.register = (k: string, v: any) => base({...plugins as any, [k]: v})
  return f
}

export type Chain = [Plugin<any, any, any, any, any>, any[]][]

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
