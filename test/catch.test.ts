// tslint:disable no-console

import {expect, fancy} from '../src'

describe('catch', () => {
  // from readme
  fancy()
  .run(() => { throw new Error('foobar') })
  .catch(/foo/)
  .end('uses regex')

  fancy()
  .run(() => { throw new Error('foobar') })
  .catch('foobar')
  .end('uses string')

  fancy()
  .run(() => { throw new Error('foobar') })
  .catch(err => expect(err.message).to.match(/foo/))
  .end('uses function')

  fancy()
  // this would normally raise because there is no error being thrown
  .catch('foobar', {raiseIfNotThrown: false})
  .end('do not error if not thrown')
  // from readme

  fancy()
  .run(() => { throw new Error('foobar') })
  .catch()
  .catch('no arg provided to catch')
  .end('errors if no args passed')

  fancy()
  .catch()
  .catch('expected error to be thrown')
  .end('errors if no error thrown')

  fancy()
  .stdout()
  .run(() => { throw new Error('x') })
  .catch('x')
  .run(() => console.log('foobar'))
  .end('continues running', ctx => {
    expect(ctx.stdout).to.equal('foobar\n')
  })
})
