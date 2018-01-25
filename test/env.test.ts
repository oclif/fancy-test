// tslint:disable no-console

import {expect, fancy} from '../src'

describe('env', () => {
  fancy()
  .env({foo: 'BARBAZ'})
  .stdout()
  .it('mocks', output => {
    console.log(process.env.foo)
    expect(output.stdout).to.equal('BARBAZ\n')
  })
})
