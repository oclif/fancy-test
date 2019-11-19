// tslint:disable no-console

import {expect, fancy} from '../src'

describe('do', () => {
  fancy
  .stdout()
  .do(() => console.log('foo'))
  .do(({stdout}) => expect(stdout).to.equal('foo\n'))
  .end('runs this callback last', () => {
    // test code
  })

  fancy
  .stdout()
  .do((ctx: {n: number}) => {
    ctx.n = 101
  })
  .do(ctx => console.log(ctx.n))
  .do(ctx => expect(ctx.stdout).to.equal('101\n'))
  .end('runs this callback last')
})

describe('add', () => {
  fancy
  .add('foo', () => 'foo')
  .add('bar', () => Promise.resolve('bar'))
  .do(ctx => expect(ctx).to.include({foo: 'foo', bar: 'bar'}))
  .end('adds the properties')
})
