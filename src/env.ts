import {Plugin} from './base'

export interface EnvOptions {
  clear?: boolean
}

export interface Env extends Plugin<{envs: (typeof process.env)[]}> {}

export default (env: {[k: string]: string | undefined}, opts: EnvOptions = {}) => ({
  run(ctx) {
    ctx.envs = ctx.envs || []
    ctx.envs.push(process.env)
    if (opts.clear) process.env = {...env}
    else process.env = {...process.env, ...env}
  },
  finally(ctx) {
    const env = ctx.envs.pop()
    if (env) process.env = env
  },
}) as Env
