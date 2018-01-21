// tslint:disable no-unused

const tryRequire = (module: string) => {
  try {
    return require(module)
  } catch (_) {
  }
}

const chai: Chai.ChaiStatic = tryRequire('chai')

const chaiAsPromised = tryRequire('chai-as-promised')
if (chai && chaiAsPromised) chai.use(chaiAsPromised)

export const expect = chai && chai.expect
