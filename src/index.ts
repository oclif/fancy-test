import base, {Base, Context, Plugin} from './base'
import _catch from './catch'
import env, {EnvOptions} from './env'
import nock, {NockScope} from './nock'
import {stderr, stdout} from './stdmock'
import stub from './stub'

export const fancy = base
.register('catch', _catch)
.register('env', env)
.register('stub', stub)
.register('nock', nock)
.register('stderr', stderr)
.register('stdout', stdout)

export type Fancy = typeof fancy

export {
  Context,
  Base,
  Plugin,
  EnvOptions,
  NockScope,
}
export default fancy
export * from './chai'
