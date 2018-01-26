export interface EnvOptions {
  clear?: boolean
}

export default (env: {[k: string]: string | undefined}, opts: EnvOptions = {}) => ({
  run(ctx: {envs: (typeof process.env)[]}) {
    ctx.envs = ctx.envs || []
    ctx.envs.push(process.env)
    if (opts.clear) process.env = {...env}
    else process.env = {...process.env, ...env}
  },
  finally(ctx: {envs: (typeof process.env)[]}) {
    const env = ctx.envs.pop()
    if (env) process.env = env
  },
})
