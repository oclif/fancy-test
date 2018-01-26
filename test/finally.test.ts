// tslint:disable no-console

import {fancy} from '../src'

describe('finally', () => {
  // from readme
  // fancy
  // .do(() => { throw new Error('x') })
  // .finally(() => console.log('foo'))
  // .end('always calls finally')
  // from readme

  fancy
  // not sure how to actually test this
  .finally(() => {})
  .it('finally')
})

describe('done', () => {
  // fancy
  // .do(() => {throw new Error('x')})
  // .it('calls done', (_, done) => {
  //   done('foo')
  // })
  // fancy
  // .it('calls done', (_, done) => {
  //   done('foo')
  // })
  fancy
  .it('calls done', (_, done) => {
    done()
  })
})
