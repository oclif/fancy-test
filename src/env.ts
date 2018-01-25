import {Plugin} from '.'

export interface EnvOptions {
  clear?: boolean
}

export default (env: {[k: string]: string | undefined}, opts: EnvOptions = {}) => {
  const original = process.env
  const plugin = (() => {
    if (opts.clear) process.env = {...env}
    else process.env = {...original, ...env}
  }) as Plugin
  plugin.finally = () => {
    process.env = original
  }
  return plugin
}
