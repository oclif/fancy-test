import * as mock from 'stdout-stderr'

export interface Stdout {
  before(): {stdout: string}
  after(): void
  catch(): void
  finally(): void
}

export interface Stderr {
  before(): {stderr: string}
  after(): void
  catch(): void
  finally(): void
}

const create = <T extends 'stdout' | 'stderr'>(std: T) => () => {
  const _finally = () => mock[std].stop()
  return {
    before() {
      mock[std].start()
      if (std === 'stdout') {
        return {
          get stdout() { return mock.stdout.output }
        }
      }
      return {
        get stderr() { return mock.stderr.output }
      }
    },
    after: _finally,
    catch: _finally,
    finally: _finally,
  }
}

export const stdout = create('stdout') as () => Stdout
export const stderr = create('stderr') as () => Stderr
