// tslint:disable no-console

import {expect, fancy} from '../src'

describe('stdout', () => {
  fancy()
  .stderr()
  .stdout()
  .it('logs', output => {
    console.log('foo')
    console.error('written')
    expect(output.stdout).to.equal('foo\n')
  })

  fancy()
  .stdout()
  .it('logs twice', output => {
    console.log('foo')
    expect(output.stdout).to.equal('foo\n')
    console.log('bar')
    expect(output.stdout).to.equal('foo\nbar\n')
  })

  fancy()
  .stderr()
  .it('writes to stderr', output => {
    console.error('foo')
    expect(output.stderr).to.equal('foo\n')
  })

  fancy()
  .stdout()
  .stderr()
  .it('writes to both', output => {
    console.error('foo')
    console.log('bar')
    expect(output.stderr).to.equal('foo\n')
    expect(output.stdout).to.equal('bar\n')
  })
})
