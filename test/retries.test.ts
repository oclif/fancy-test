import {fancy} from '../src'

let count = 3

describe('retries', () => {
  // from readme
  fancy
  .retries(2)
  .do(() => {
    count--
    if (count > 0) throw new Error('x')
  })
  .it('retries 3 times')
  // from readme
})
