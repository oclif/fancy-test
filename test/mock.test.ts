// tslint:disable no-console

import * as sinon from 'sinon'

import {expect, fancy} from '../src'

const os = require('os')
const platform = os.platform()

describe('mock', () => {
  // from readme
  fancy()
  .mock(os, 'platform', () => 'foobar')
  .it('sets os', () => {
    expect(os.platform()).to.equal('foobar')
  })

  fancy()
  .mock(os, 'platform', sinon.stub().returns('foobar'))
  .it('uses sinon', () => {
    expect(os.platform()).to.equal('foobar')
    expect(os.platform.called).to.equal(true)
  })
  // from readme

  fancy()
  .stdout()
  .it('resets os', output => {
    console.log(os.platform())
    expect(output.stdout).to.equal(`${platform}\n`)
  })
})
