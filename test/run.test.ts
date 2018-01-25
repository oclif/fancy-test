// tslint:disable no-console

import {expect, fancy} from '../src'

describe('run', () => {
  fancy()
  .stdout()
  .run(() => console.log('foo'))
  .run(({stdout}) => expect(stdout).to.equal('foo\n'))
  .it('runs this callback last', () => {
    // test code
  })
})
