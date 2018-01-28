import * as _ from 'lodash'

import {EnvOptions} from './types'

export default (env: {[k: string]: string | null | undefined}, opts: EnvOptions = {}) => {
  const envs: (typeof process.env)[] = []
  return {
    run() {
      // normalize to undefined
      const normalizedEnv = _.mapValues(env, v => v === null ? undefined : v)

      // store previous env for finally
      envs.push(process.env)

      if (opts.clear) {
        process.env = {...normalizedEnv}
      } else {
        process.env = {...process.env, ...normalizedEnv}
        Object.entries(normalizedEnv)
        .filter(([, v]) => v === undefined)
        .forEach(([k]) => { delete process.env[k] })
      }
    },
    finally() {
      const env = envs.pop()
      if (env) process.env = env
    },
  }
}
