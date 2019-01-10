import base from './base'
import _catch from './catch'
import {expect} from './chai'
import env from './env'
import * as Nock from './nock'
import {stderr, stdin, stdout} from './stdmock'
import stub from './stub'
import timeout from './timeout'
import * as FancyTypes from './types'

export const fancy = base
.register('catch', _catch)
.register('env', env)
.register('stub', stub)
.register('stdin', stdin)
.register('stderr', stderr)
.register('stdout', stdout)
.register('nock', Nock.nock)
.register('timeout', timeout)

export type Fancy = typeof fancy

export {
  expect,
  FancyTypes,
}
export default fancy
