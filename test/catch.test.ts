// tslint:disable no-console

import {expect, fancy} from '../src'

describe('catch', () => {
  // from readme
  fancy()
  .catch(/foo/)
  .it('uses regex', () => {
    throw new Error('foobar')
  })

  fancy()
  .catch('foobar')
  .it('uses string', () => {
    throw new Error('foobar')
  })

  fancy()
  .catch(err => {
    expect(err.message).to.match(/foo/)
  })
  .it('uses function', () => {
    throw new Error('foobar')
  })

  fancy()
  .catch('foobar', {raiseIfNotThrown: false})
  .it('do not error if not thrown', () => {
    // this would raise because there is no error being thrown
  })
})
