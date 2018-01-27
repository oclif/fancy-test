// tslint:disable no-console

import {expect, fancy} from '../src'

process.env.PREDEFINED = '1'

describe('env', () => {
  // from readme
  fancy
  .env({FOO: 'BAR'})
  .end('mocks FOO', () => {
    expect(process.env.FOO).to.equal('BAR')
    expect(process.env).to.not.deep.equal({FOO: 'BAR'})
  })

  fancy
  .env({FOO: 'BAR'}, {clear: true})
  .end('clears all env vars', () => {
    expect(process.env).to.deep.equal({FOO: 'BAR'})
  })

  fancy
  .env({FOO: 'BAR'})
  .stdout()
  .end('works with stdout', output => {
    console.log(process.env.FOO)
    expect(output.stdout).to.equal('BAR\n')
  })

  fancy
  .env({PREDEFINED: undefined})
  .end('can set things to be undefined', () => {
    expect(process.env.PREDEFINED).to.equal(undefined)
  })
})
