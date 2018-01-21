import * as _ from 'lodash'

/**
 * mocks an object's property
 */
export default (object: any, path: string, value: any) => {
  let original = _.get(object, path)
  return {
    before() {
      original = _.get(object, path)
      _.set(object, path, value)
    },
    finally() {
      _.set(object, path, original)
    }
  }
}
