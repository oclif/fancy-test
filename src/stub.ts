import * as _ from 'lodash'

import {Plugin} from './base'

/**
 * mocks an object's property
 */
export default (object: any, path: string, value: any) => {
  let original = _.get(object, path)
  const plugin = (() => {
    _.set(object, path, value)
  }) as Plugin

  plugin.finally = () => {
    _.set(object, path, original)
  }

  return plugin
}
