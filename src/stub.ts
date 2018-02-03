import * as _ from 'lodash'

/**
 * mocks an object's property
 */
export default function (object?: any, path?: string, value?: any) {
  if (_.isUndefined(object) || _.isUndefined(path))throw new Error('should not be undefined')
  return {
    run(ctx: {stubs: any[]}) {
      ctx.stubs = ctx.stubs || []
      ctx.stubs.push(_.get(object, path))
      _.set(object, path, value)
    },
    finally(ctx: {stubs: any[]}) {
      const stub = ctx.stubs.pop()
      _.set(object, path, stub)
    },
  }
}
