import {expect, fancy} from '../src'

// eslint-disable-next-line no-promise-executor-return
const wait = (ms = 10) => new Promise(resolve => setTimeout(resolve, ms))

describe('timeout', () => {
  fancy
  .timeout(100)
  .it('sets timeout var', async function () {
    expect(this._runnable._timeout).to.equal(100)
    await wait(1)
  })

  fancy
  .timeout(100)
  .it('sets timeout with done fn', (_, done) => {
    wait(1).then(done).catch(done)
  })
})
