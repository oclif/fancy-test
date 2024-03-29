import {SinonSandbox, SinonStub, createSandbox} from 'sinon'

/**
 * mocks an object's property
 */
export default function <T extends Record<string, unknown>, K extends keyof T> (
  object: T,
  path: K,
  fn: (stub: SinonStub) => SinonStub,
) {
  if (object === undefined || path === undefined)
    throw new Error('should not be undefined')

  let stub: SinonStub
  return {
    run(ctx: { sandbox: SinonSandbox }) {
      ctx.sandbox ||= createSandbox()

      stub = fn(ctx.sandbox.stub(object, path))
    },
    finally() {
      stub?.restore()
    },
  }
}
