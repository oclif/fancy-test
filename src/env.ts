import {Plugin} from '.'

export interface EnvOptions {
  clear?: boolean
}

export default (async (next, _, env, opts = {}) => {
  const original = process.env
  if (opts.clear) process.env = {...env}
  else process.env = {...original, ...env}
  try {
    await next({})
  } finally {
    process.env = original
  }
}) as Plugin<{}, {[k: string]: string}, EnvOptions>
