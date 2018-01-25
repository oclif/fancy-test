// tslint:disable no-console

import {expect, fancy} from '../src'

describe('catch', () => {
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
})
