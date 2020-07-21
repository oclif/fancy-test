import * as sinon from 'sinon'

/**
 * mocks an object's property
 */
export default function<T extends object, K extends keyof T> (object: T, path: K, value: any) {
  if (object === undefined || path === undefined) throw new Error('should not be undefined')

  return {
    run(ctx: {sandbox: sinon.SinonSandbox}) {
      const sandbox = ctx.sandbox = ctx.sandbox || sinon.createSandbox()
      sandbox.stub(object, path).value(value)
    }, finally(ctx: {sandbox: sinon.SinonSandbox}) {
      ctx.sandbox.restore()
    },
  }
}