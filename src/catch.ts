import * as _ from 'lodash'

import {Plugin} from '.'
import {expect} from './chai'

export default (async (next, __, arg) => {
  try {
    await next({})
  } catch (err) {
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
}) as Plugin<{}, RegExp | string | ((err: Error) => any)>
