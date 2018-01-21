import * as mock from 'stdout-stderr'

const create = <T extends 'stdout' | 'stderr'>(std: T) => () => {
  const _finally = () => mock[std].stop()
  return {
    before() {
      mock[std].start()
      return {
        get [std]() { return mock[std].output }
      } as {[P in T]: string}
    },
    after: _finally,
    catch: _finally,
    finally: _finally,
  }
}

export const stdout = create('stdout')
export const stderr = create('stderr')
