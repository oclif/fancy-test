import * as sinon from 'sinon'

/**
 * mocks an object's property
 */
export default function <T extends object, K extends keyof T> (
  object: T,
  path: K,
  fn: (stub: sinon.SinonStub) => sinon.SinonStub,
) {
  if (object === undefined || path === undefined)
    throw new Error('should not be undefined')

  let stub: sinon.SinonStub
  return {
    run(ctx: { sandbox: sinon.SinonSandbox }) {
      if (!ctx.sandbox) {
        ctx.sandbox = sinon.createSandbox()
      }
      stub = fn(ctx.sandbox.stub(object, path))
    },
    finally() {
      stub.restore()
    },
  }
}
