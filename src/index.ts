import base, {Base, Fancy, Next, Plugin} from './base'
import _catch, {CatchOptions} from './catch'
import env, {EnvOptions} from './env'
import nock, {NockScope} from './nock'
import {stderr, StdmockOptions, stdout} from './stdmock'
import stub from './stub'

export const fancy = base
.register('catch', _catch)
.register('env', env)
.register('stub', stub)
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
  NockScope,
  StdmockOptions,
}
export default fancy
export * from './chai'
