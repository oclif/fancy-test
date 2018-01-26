import * as _ from 'lodash'

/**
 * mocks an object's property
 */
export default (object: any, path: string, value: any) => ({
  run(ctx: {stubs: any[]}) {
    ctx.stubs = ctx.stubs || []
    ctx.stubs.push(_.get(object, path))
    _.set(object, path, value)
  },
  finally(ctx: {stubs: any[]}) {
    const stub = ctx.stubs.pop()
    _.set(object, path, stub)
  },
})
