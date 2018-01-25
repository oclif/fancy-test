// tslint:disable no-console

import {expect, fancy} from '../src'

describe('run', () => {
  fancy()
  .stdout()
  .run(() => console.log('foo'))
  .run(({stdout}) => expect(stdout).to.equal('foo\n'))
  .end('runs this callback last', () => {
    // test code
  })
})

describe('add', () => {
  fancy()
  .add(() => Promise.resolve({foo: 'foo'}))
  .add(() => Promise.resolve({bar: 'bar'}))
  .run(ctx => expect(ctx).to.include({foo: 'foo', bar: 'bar'}))
  .end('adds the properties')
})
