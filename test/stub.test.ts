// tslint:disable no-console

import * as sinon from 'sinon'

import {expect, fancy} from '../src'

const os = require('os')
const platform = os.platform()

const mrGetter = {
  get foo() {
    return 1
  }
}

describe('stub', () => {
  // from readme
  fancy
  .stub(os, 'platform', () => 'foobar')
  .end('sets os', () => {
    expect(os.platform()).to.equal('foobar')
  })

  fancy
  .stub(os, 'platform', sinon.stub().returns('foobar'))
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
  .stub(mrGetter, 'foo', () => 2)
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
