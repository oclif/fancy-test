// tslint:disable no-console

import {expect, fancy} from '../src'

describe('run', () => {
  fancy
  .stdout()
  .do(() => console.log('foo'))
  .do(({stdout}) => expect(stdout).to.equal('foo\n'))
  .end('runs this callback last', () => {
    // test code
  })
})

describe('add', () => {
  fancy
  .add('foo', () => 'foo')
  .add('bar', () => Promise.resolve('bar'))
  .do(ctx => expect(ctx).to.include({foo: 'foo', bar: 'bar'}))
  .end('adds the properties')
})
