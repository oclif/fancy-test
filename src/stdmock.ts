import * as mock from 'stdout-stderr'

const create = <T extends 'stdout' | 'stderr'>(std: T) => (opts: {print?: boolean, stripColor?: boolean} = {}) => ({
  run(ctx: {readonly [P in T]: string}) {
    mock[std].start()
    mock[std].print = opts.print || process.env.TEST_OUTPUT === '1'
    mock[std].stripColor = opts.stripColor !== false
    if (ctx[std] as any !== undefined) return
    Object.defineProperty(ctx, std, {
      get: () => mock[std].output
    })
  },
  finally() {
    mock[std].stop()
  },
})

export const stdout = create('stdout')
export const stderr = create('stderr')
export const stdin = (input: string, delay = 0) => {
  let stdin: any
  return {
    run: () => {
      stdin = require('mock-stdin').stdin()
      setTimeout(() => stdin.send(input), delay)
    },
    finally() {
      stdin.restore()
    },
  }
}
