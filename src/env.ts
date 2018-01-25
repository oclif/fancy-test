import {Plugin} from '.'

export default (async (next, _, env) => {
  const original = process.env
  process.env = {...env}
  try {
    await next({})
  } finally {
    process.env = original
  }
}) as Plugin<{}, {[k: string]: string}>
