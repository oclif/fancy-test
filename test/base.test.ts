import {expect, fancy} from '../src'

let count = 0

const counter = (prefix: string) => () => {
  count++
  return {count, testLabel: `${prefix}${count}`}
}

// note that .register() MUST be called on a non-instantiated fancy object.
const myFancy = fancy
.register('count', counter)

describe('register', () => {
  myFancy()
  .count('test-')
  .end('is test #1', context => {
    expect(context.count).to.equal(1)
    expect(context.testLabel).to.equal('test-1')
  })

  myFancy()
  .count('test-')
  .end('is test #2', context => {
    expect(context.count).to.equal(2)
    expect(context.testLabel).to.equal('test-2')
  })
})
