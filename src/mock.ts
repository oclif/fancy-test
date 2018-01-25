import * as _ from 'lodash'

import {Next} from './base'

/**
 * mocks an object's property
 */
export default async (next: Next<{}>, __: any, object: any, path: string, value: any) => {
  let original = _.get(object, path)
  try {
    _.set(object, path, value)
    await next({})
  } finally {
    _.set(object, path, original)
  }
}
