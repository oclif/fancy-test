import {expect, fancy} from '../src'

const os = require('node:os')
const platform = os.platform()

const mrGetter = {
  get foo() {
    return 1
  },
}

describe('stub', () => {
  // from readme
  fancy
  .stub(os, 'platform', stub => stub.callsFake(() => 'foobar'))
  .end('sets os', () => {
    expect(os.platform()).to.equal('foobar')
  })

  fancy
  .stub(os, 'platform', stub => stub.callsFake(() => 'foobar'))
  .end('uses sinon', () => {
    expect(os.platform()).to.equal('foobar')
    expect(os.platform.called).to.equal(true)
  })
  // from readme

  fancy
  .stdout()
  .end('resets os', output => {
    console.log(os.platform())
    expect(output.stdout).to.equal(`${platform}\n`)
  })

  fancy
  .stdout()
  .stub(mrGetter, 'foo', stub => stub.get(() => 2))
  .end('resets getter', output => {
    console.log(mrGetter.foo)
    expect(output.stdout).to.equal('2\n')
  })

  fancy
  .stdout()
  .end('reverts getter back to original', output => {
    console.log(mrGetter.foo)
    expect(output.stdout).to.equal('1\n')
  })
})
