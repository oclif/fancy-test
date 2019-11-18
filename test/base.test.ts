import {expect, fancy} from '../src'

let count = 0

// note that .register() MUST be called on a non-instantiated fancy object.
const myFancy = fancy
.register('count', (prefix?: string) => {
  return {
    run(ctx: {count: number; testLabel: string}) {
      ctx.count = ++count
      ctx.testLabel = `${prefix}${count}`
    },
  }
})

describe('register', () => {
  myFancy
  .count('test-')
  .it('is test #1', context => {
    expect(context.count).to.equal(1)
    expect(context.testLabel).to.equal('test-1')
  })

  myFancy
  .count('test-')
  .it('is test #2', context => {
    expect(context.count).to.equal(2)
    expect(context.testLabel).to.equal('test-2')
  })
})
