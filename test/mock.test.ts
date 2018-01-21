// tslint:disable no-console

import * as os from 'os'

import {expect, test} from '../src'

const platform = os.platform()

describe('stdout', () => {
  test
  .mock(os, 'platform', () => 'foobar')
  .stdout()
  .it('sets os', output => {
    console.log(os.platform())
    expect(output.stdout).to.equal('foobar\n')
  })

  test
  .stdout()
  .it('resets os', output => {
    console.log(os.platform())
    expect(output.stdout).to.equal(`${platform}\n`)
  })
})
