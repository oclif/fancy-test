import * as _ from 'lodash'

/**
 * mocks an object's property
 */
export default function<T extends object, K extends keyof T> (object: T, path: K, value: () => T[K]) {
  if (object === undefined || path === undefined) throw new Error('should not be undefined')
  return {
    run(ctx: {stubs: any[]}) {
      ctx.stubs = ctx.stubs || []
      const descriptor = Object.getOwnPropertyDescriptor(object, path)
      if (descriptor && descriptor.get) {
        ctx.stubs.push(descriptor.get)
        descriptor.get = value
        Object.defineProperty(object, path, descriptor)
      } else {
        ctx.stubs.push(_.get(object, path))
        _.set(object, path, value)
      }
    }, finally(ctx: {stubs: any[]}) {
      const stub = ctx.stubs.pop()
      const descriptor = Object.getOwnPropertyDescriptor(object, path)
      if (descriptor && descriptor.get) {
        descriptor.get = stub
        Object.defineProperty(object, path, descriptor)
      } else {
        _.set(object, path, stub)
      }
    },
  }
}
