// tslint:disable no-console

import {expect, test} from '../src'

describe('stdout', () => {
  test
  .env({foo: 'BARBAZ'})
  .stdout()
  .it('logs', output => {
    console.log(process.env.foo)
    expect(output.stdout).to.equal('BARBAZ\n')
  })
})
