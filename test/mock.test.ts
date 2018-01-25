// tslint:disable no-console

import * as os from 'os'

import {expect, fancy} from '../src'

const platform = os.platform()

describe('mock', () => {
  fancy()
  .mock(os, 'platform', () => 'foobar')
  .stdout()
  .it('sets os', output => {
    console.log(os.platform())
    expect(output.stdout).to.equal('foobar\n')
  })

  fancy()
  .stdout()
  .it('resets os', output => {
    console.log(os.platform())
    expect(output.stdout).to.equal(`${platform}\n`)
  })
})
