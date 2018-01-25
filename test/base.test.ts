import {expect, fancy, Plugin} from '../src'

let count = 0

const counter: Plugin<{count: number, testLabel: string}, string> = async (next, _, prefix) => {
  count++
  await next({count, testLabel: `${prefix}${count}`})
}

// note that .register() MUST be called on a non-instantiated fancy object.
const myFancy = fancy
.register('count', counter)

describe('register', () => {
  myFancy()
  .count('test-')
  .it('is test #1', context => {
    expect(context.count).to.equal(1)
    expect(context.testLabel).to.equal('test-1')
  })

  myFancy()
  .count('test-')
  .it('is test #2', context => {
    expect(context.count).to.equal(2)
    expect(context.testLabel).to.equal('test-2')
  })
})
