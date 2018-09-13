// tslint:disable no-console

import {expect, fancy} from '../src'

describe('catch', () => {
  // from readme
  fancy
    .do(() => { throw new Error('foobar') })
    .catch(/foo/)
    .end('uses regex')

  fancy
    .do(() => { throw new Error('foobar') })
    .catch('foobar')
    .end('uses string')

  fancy
    .do(() => { throw new Error('foobar') })
    .catch(err => expect(err.message).to.match(/foo/))
    .end('uses function')

  fancy
  // this would normally raise because there is no error being thrown
    .catch('foobar', {raiseIfNotThrown: false})
    .end('do not error if not thrown')
  // from readme

  fancy
    .do(() => { throw new Error('foobar') })
    .catch()
    .catch('no arg provided to catch')
    .end('errors if no args passed')

  fancy
    .catch()
    .catch('expected error to be thrown')
    .end('errors if no error thrown')

  fancy
    .stdout()
    .do(() => { throw new Error('x') })
    .catch('x')
    .do(() => console.log('foobar'))
    .end('continues running', ctx => {
      expect(ctx.stdout).to.equal('foobar\n')
    })
})
