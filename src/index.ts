import base, {Base, Fancy, Next, Plugin} from './base'
import _catch, {CatchOptions} from './catch'
import env, {EnvOptions} from './env'
import mock from './mock'
import nock, {NockHosts} from './nock'
import {stderr, StdmockOptions, stdout} from './stdmock'

export const fancy = base
.register('catch', _catch)
.register('env', env)
.register('mock', mock)
.register('nock', nock)
.register('stderr', stderr)
.register('stdout', stdout)

export {
  Base,
  Fancy,
  Plugin,
  Next,
  CatchOptions,
  EnvOptions,
  NockHosts,
  StdmockOptions,
}
export default fancy
export * from './chai'
