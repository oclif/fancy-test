// tslint:disable no-unused

const tryRequire = (module: string) => {
  try {
    return require(module)
  } catch (_) {
  }
}

const chai: Chai.ChaiStatic = tryRequire('chai')

export const expect = (chai && chai.expect) || (() => { throw new Error('install chai') })
