import {isString, isRegExp} from 'lodash'

import {expect} from './chai'

export default (arg: RegExp | string | ((err: Error) => any), opts: {raiseIfNotThrown?: boolean} = {}) => ({
  run() {
    if (opts.raiseIfNotThrown !== false) {
      throw new Error('expected error to be thrown')
    }
  },
  catch(ctx: {error: Error}) {
    const err = ctx.error
    if (isRegExp(arg)) {
      expect(err.message).to.match(arg)
    } else if (isString(arg)) {
      expect(err.message).to.equal(arg)
    } else if (arg) {
      arg(err)
    } else {
      throw new Error('no arg provided to catch')
    }
  },
})
