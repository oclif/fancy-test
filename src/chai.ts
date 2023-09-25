const tryRequire = (module: string) => {
  try {
    return require(module)
  } catch {}
}

const chai: Chai.ChaiStatic = tryRequire('chai')

export const expect = (chai && chai.expect) || (() => {
  throw new Error('install chai')
})
