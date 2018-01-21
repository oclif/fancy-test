import * as mocha from 'mocha'

import env from './env'
import mock from './mock'
import {stderr, stdout} from './stdmock'

export type Extension<O extends object, A1 = void, A2 = void, A3 = void, A4 = void> = (a1: A1, a2: A2, a3: A3, a4: A4) => Filters<O>
export interface Filters<C extends object> {
  before?(input: any): Promise<C> | C | void
  after?(context: C): Promise<any> | any
  catch?(context: C, err: Error): Promise<any> | any
  finally?(context: C): Promise<any> | any
}

export type MochaDone = (error?: any) => any

// export type TestCallback<T, C, TR> = (this: T, context: C & {done: MochaDone}) => TR
export type TestCallback<T, C, TR> = (this: T, context: C) => TR
export type ItCallback<C = any> = TestCallback<mocha.ITestCallbackContext, C, Promise<any> | any>
export type DescribeCallback = TestCallback <mocha.ISuiteCallbackContext, {}, void>

export type Extensions = [{[k: string]: object}, {[k: string]: [object, any]}]

export interface It<C> {
  (expectation: string, cb?: ItCallback<C>): mocha.ITest
  only(expectation: string, cb?: ItCallback<C>): mocha.ITest
  skip(expectation: string, cb?: ItCallback<C>): void
}

export interface Describe {
  (expectation: string, cb: DescribeCallback): mocha.ISuite
  only(expectation: string, cb: DescribeCallback): mocha.ISuite
  skip(expectation: string, cb?: (this: mocha.ISuiteCallbackContext) => void): void
}

export interface TestBase<E extends Extensions, C = {}> {
  /**
   * wrapper for mocha's describe()
   */
  describe: Describe
  /**
   * wrapper for mocha's it()
   */
  it: It<C>
  /**
   * currently loaded filters
   */
  filters: Filters<any>[]
  /**
   * add your own filters
   *
   * @example
   * import test from 'fancy-mocha'
   *
   * // this will run before each command and add {foo: 100} to the context object in the callback
   * test.extend(myopts => {
   *  return {
   *    before(): {
   *      console.log('do something with myopts')
   *      return {foo: 100}
   *    }
   *  }
   * })
   */
  extend<K extends string, O extends object>(key: K, filter: Extension<O>): Test<AddExtension0<E, K, O>, C>
  extend<K extends string, O extends object, A1>(key: K, filter: Extension<O, A1>): Test<AddExtension1<E, K, O, A1>, C>
  extend<K extends string, O extends object, A1, A2>(key: K, filter: Extension<O, A1, A2>): Test<AddExtension2<E, K, O, A1, A2>, C>
  extend<K extends string, O extends object, A1, A2, A3>(key: K, filter: Extension<O, A1, A2, A3>): Test<AddExtension3<E, K, O, A1, A2, A3>, C>
  extend<K extends string, O extends object, A1, A2, A3, A4>(key: K, filter: Extension<O, A1, A2, A3, A4>): Test<AddExtension4<E, K, O, A1, A2, A3, A4>, C>
}
export type Test<E extends Extensions, C> = TestBase<E, C> &
  {[P in keyof E[0]]: FilterFn0<E, C, E[0][P]>} &
  {[P in keyof E[1]]: FilterFn1<E, C, E[1][P][0], E[1][P][1]>} &
  {[P in keyof E[1]]: FilterFn2<E, C, E[1][P][0], E[1][P][1], E[1][P][2]>} &
  {[P in keyof E[1]]: FilterFn3<E, C, E[1][P][0], E[1][P][1], E[1][P][2], E[1][P][3]>} &
  {[P in keyof E[1]]: FilterFn4<E, C, E[1][P][0], E[1][P][1], E[1][P][2], E[1][P][3], E[1][P][4]>}

export type AddExtension0<E extends Extensions, K extends string, O> = [E[0] & {[P in K]: O}, E[1]]
export type AddExtension1<E extends Extensions, K extends string, O, A1> = [E[0], E[1] & {[P in K]: [O, A1]}]
export type AddExtension2<E extends Extensions, K extends string, O, A1, A2> = [E[0], E[1] & {[P in K]: [O, A1, A2]}]
export type AddExtension3<E extends Extensions, K extends string, O, A1, A2, A3> = [E[0], E[1] & {[P in K]: [O, A1, A2, A3]}]
export type AddExtension4<E extends Extensions, K extends string, O, A1, A2, A3, A4> = [E[0], E[1] & {[P in K]: [O, A1, A2, A3, A4]}]
export type FilterFn0<E extends Extensions, C, O extends object> = () => Test<E, C & O>
export type FilterFn1<E extends Extensions, C, O extends object, A1> = (a1?: A1) => Test<E, C & O>
export type FilterFn2<E extends Extensions, C, O extends object, A1, A2> = (a1?: A1, a2?: A2) => Test<E, C & O>
export type FilterFn3<E extends Extensions, C, O extends object, A1, A2, A3> = (a1?: A1, a2?: A2, a3?: A3) => Test<E, C & O>
export type FilterFn4<E extends Extensions, C, O extends object, A1, A2, A3, A4> = (a1?: A1, a2?: A2, a3?: A3, a4?: A4) => Test<E, C & O>

// This is an assign function that copies full descriptors
function completeAssign(target: any, ...sources: any[]) {
  if (!target) target = sources.find(f => !!f)
  sources.forEach(source => {
    if (!source) return
    let descriptors: any = Object.keys(source).reduce((descriptors: any, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key)
      return descriptors
    }, {})
    // by default, Object.assign copies enumerable Symbols too
    Object.getOwnPropertySymbols(source).forEach(sym => {
      let descriptor: any = Object.getOwnPropertyDescriptor(source, sym)
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor
      }
    })
    Object.defineProperties(target, descriptors)
  })
  return target
}

const test = <F extends Extensions = [{}, {}]>(previous?: Test<any, any>): TestBase<F> => {
  const filters: Filters<any>[] = previous ? previous.filters : []
  const before = async () => {
    let context = {}
    for (let f of filters) {
      if (f.before) {
        context = completeAssign(context, await f.before(context))
      }
    }
    return context
  }
  const _catch = async (err: Error, context?: object) => {
    let handled = false
    for (let f of filters) {
      if (f.catch) {
        await f.catch(context, err)
        handled = true
      }
    }
    return handled
  }
  const _finally = async (context?: object) => {
    for (let f of filters) {
      if (f.finally) await f.finally(context)
    }
  }
  const after = async (context?: object) => {
    for (let f of filters) {
      if (f.after) await f.after(context)
    }
  }

  const __it = (cb?: ItCallback) => async function (this: mocha.ITestCallbackContext) {
    let error
    try {
      const context = await before()
      if (cb) await cb.call(this, context)
      await after(context)
    } catch (err) {
      error = err
      if (await _catch(err)) {
        error = false
      }
    } finally {
      await _finally()
    }
    if (error) throw error
  }
  const _it = Object.assign((expectation: string, cb?: ItCallback): Mocha.ITest => {
    return it(expectation, __it(cb))
  }, {
    only(expectation: string, cb?: ItCallback): Mocha.ITest {
      return it.only(expectation, __it(cb))
    },
    skip(expectation: string, cb?: ItCallback): void {
      return it.skip(expectation, cb)
    },
  })

  const __describe = (cb?: ItCallback) => async function (this: mocha.ITestCallbackContext) {
    let error
    beforeEach(before)
    afterEach(after)
    try {
      if (cb) await cb.call(this)
    } catch (err) {
      error = err
      await _catch(err)
    } finally {
      await _finally()
    }
    if (error) throw error
  }
  const _describe = Object.assign((expectation: string, cb: DescribeCallback): Mocha.ISuite => {
    return describe(expectation, __describe(cb))
  }, {
    only(expectation: string, cb: DescribeCallback): Mocha.ISuite {
      return describe.only(expectation, __describe(cb))
    },
    skip(expectation: string, cb: (this: mocha.ISuiteCallbackContext) => void): void {
      return describe.skip(expectation, cb)
    },
  })

  return {
    ...previous,
    it: _it,
    describe: _describe,
    filters,
    extend(this: any, key: string, extension: Extension<object, any, any, any, any>) {
      return test({
        ...this,
        [key](...opts: any[]) {
          return test({
            ...this,
            filters: this.filters.concat([(extension as any)(...opts)]),
          } as any)
        }
      })
    },
  } as any
}

export default test()
.extend('env', env)
.extend('mock', mock)
.extend('stdout', stdout)
.extend('stderr', stderr)
