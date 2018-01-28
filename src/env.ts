import * as _ from 'lodash'

import {Env, EnvOptions} from './types'

export default (env: {[k: string]: string | null | undefined}, opts: EnvOptions = {}) => ({
  run(ctx) {
    // normalize to undefined
    const normalizedEnv = _.mapValues(env, v => v === null ? undefined : v)

    // store previous env for finally
    ctx.envs = ctx.envs || []
    ctx.envs.push(process.env)

    if (opts.clear) {
      process.env = {...normalizedEnv}
    } else {
      process.env = {...process.env, ...normalizedEnv}
      Object.entries(normalizedEnv)
      .filter(([, v]) => v === undefined)
      .forEach(([k]) => { delete process.env[k] })
    }
  },
  finally(ctx) {
    const env = ctx.envs.pop()
    if (env) process.env = env
  },
}) as Env
