import base, {Base, Fancy, Next, Plugin} from './base'
import _catch from './catch'
import env from './env'
import mock from './mock'
import {stderr, StdmockOptions, stdout} from './stdmock'

export const fancy = base
.register('stdout', stdout)
.register('stderr', stderr)
.register('mock', mock)
.register('env', env)
.register('catch', _catch)

export {
  Base,
  Fancy,
  Plugin,
  Next,
  StdmockOptions,
}
export default fancy
export * from './chai'
