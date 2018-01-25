import * as _ from 'lodash'

// import {Plugin} from '.'
import {expect} from './chai'

export interface CatchOptions {
  raiseIfNotThrown?: boolean
}

export default ((arg: RegExp | string | ((err: Error) => any), opts: CatchOptions = {}) => {
  const plugin = (() => {
    if (opts.raiseIfNotThrown !== false) {
      throw new Error('expected error to be thrown')
    }
  }) as any
  plugin.catch = (context: any) => {
    const err = context.error
    if (_.isRegExp(arg)) {
      expect(err.message).to.match(arg)
    } else if (_.isString(arg)) {
      expect(err.message).to.equal(arg)
    } else if (arg) {
      arg(err)
    } else {
      throw new Error('no arg provided to catch')
    }
  }
  return plugin
})
