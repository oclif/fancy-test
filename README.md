fancy-mocha
===========

extends mocha with helpful, chainable extensions

[![Version](https://img.shields.io/npm/v/fancy-mocha.svg)](https://npmjs.org/package/fancy-mocha)
[![CircleCI](https://circleci.com/gh/jdxcode/fancy-mocha/tree/master.svg?style=svg)](https://circleci.com/gh/jdxcode/fancy-mocha/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/jdxcode/fancy-mocha?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/fancy-mocha/branch/master)
[![Codecov](https://codecov.io/gh/jdxcode/fancy-mocha/branch/master/graph/badge.svg)](https://codecov.io/gh/jdxcode/fancy-mocha)
[![Greenkeeper](https://badges.greenkeeper.io/jdxcode/fancy-mocha.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/npm/fancy-mocha/badge.svg)](https://snyk.io/test/npm/fancy-mocha)
[![Downloads/week](https://img.shields.io/npm/dw/fancy-mocha.svg)](https://npmjs.org/package/fancy-mocha)
[![License](https://img.shields.io/npm/l/fancy-mocha.svg)](https://github.com/jdxcode/fancy-mocha/blob/master/package.json)

<!-- toc -->

- [Why](#why)
- [Usage](#usage)
  * [Mock](#mock)
  * [Catch](#catch)
  * [Nock](#nock)
  * [Environment Variables](#environment-variables)
  * [Run](#run)
  * [Stdout/Stderr Mocking](#stdoutstderr-mocking)
  * [Chai](#chai)
- [Chaining](#chaining)
- [Custom Plugins](#custom-plugins)

<!-- tocstop -->

Why
===

Mocha out of the box often requires a lot of setup and teardown code in `beforeEach`/`afterEach` filters. Using this library, you can get rid of those entirely and build your tests declaratively by chaining functionality together. Using the builtin plugins and your own, you create bits of functionality and chain them together with a concise syntax. It will greatly reduce the amount of repetition in your codebase.

It might be compatible with other testing libraries as well (e.g. jest), but would require a couple small changes. Let me know if you'd be interested in this.

As an example, here is what a test file might look like for an application setup with fancy-mocha. This chain could partially be stored to a variable for reuse.

```js
describe('api', () => {
  fancy()
  // [custom plugin] initializes the db
  .initDB({withUser: mockDBUser})

  // [custom plugin] uses nock to mock out github API
  .mockGithubAPI({user: mockGithubUser})

  // [custom plugin] that calls the API of the app
  .call('POST', '/api/user/foo', {id: mockDBUser.id})

  // add adds to the context object
  // fetch the newly created data from the API (can return a promise)
  .add('user', ctx => ctx.db.fetchUserAsync(mockDBUser.id))

  // run just runs arbitary code
  // check to ensure the operation was successful
  .run(ctx => expect(ctx.user.foo).to.equal('bar'))

  // end is essentially mocha's it(expectation, callback)
  // start the test and provide a description
  .end('POST /api/user/foo updates the user')
})
```

Usage
=====

Setup is pretty easy, just install mocha and fancy-mocha, then you can use any of the examples below.

Assume the following is before all the examples:

```js
import {fancy} from 'fancy-mocha'
import {expect} from 'chai'
```

Stub
----

Stub any object. Like all fancy plugins, it ensures that it is reset to normal after the test runs.
```js
import * as os from 'os'

describe('stub tests', () => {
  fancy()
  .stub(os, 'platform', () => 'foobar')
  .end('sets os', () => {
    expect(os.platform()).to.equal('foobar')
  })

  fancy()
  .stub(os, 'platform', sinon.stub().returns('foobar'))
  .end('uses sinon', () => {
    expect(os.platform()).to.equal('foobar')
    expect(os.platform.called).to.equal(true)
  })
})
```

Catch
-----

catch errors in a declarative way. By default, ensures they are actually thrown as well.

```js
describe('catch tests', () => {
  fancy()
  .run(() => { throw new Error('foobar') })
  .catch(/foo/)
  .end('uses regex')

  fancy()
  .run(() => { throw new Error('foobar') })
  .catch('foobar')
  .end('uses string')

  fancy()
  .run(() => { throw new Error('foobar') })
  .catch(err => expect(err.message).to.match(/foo/))
  .end('uses function')

  fancy()
  // this would normally raise because there is no error being thrown
  .catch('foobar', {raiseIfNotThrown: false})
  .end('do not error if not thrown')
})
```

Without fancy, you could check an error like this:

```js
it('dont do this', () => {
  try {
    myfunc()
  } catch (err) {
    expect(err.message).to.match(/my custom errorr/)
  }
})
```

But this has a common flaw, if the test does not error, the test will still pass. Chai and other assertion libraries have helpers for this, but they still end up with somewhat messy code.

Nock
----

Uses [nock](https://github.com/node-nock/nock) to mock out HTTP calls to external APIs. You'll need to also install nock in your `devDependencies`.
Automatically calls `done()` to ensure the calls were made and `cleanAll()` to remove any pending requests.

```js
describe('nock tests', () => {
  fancy()
  .nock('https://api.github.com', nock => {
    nock
    .get('/me')
    .reply(200, {name: 'jdxcode'})
  })
  .end('mocks http call to github', async () => {
    const {body: user} = await HTTP.get('https://api.github.com/me')
    expect(user).to.have.property('name', 'jdxcode')
  })
})
```

Environment Variables
---------------------

Sometimes it's helpful to clear out environment variables before running tests or override them to something common.

```js
describe('env tests', () => {
  fancy()
  .env({FOO: 'BAR'})
  .end('mocks FOO', () => {
    expect(process.env.FOO).to.equal('BAR')
    expect(process.env).to.not.deep.equal({FOO: 'BAR'})
  })

  fancy()
  .env({FOO: 'BAR'}, {clear: true})
  .end('clears all env vars', () => {
    expect(process.env).to.deep.equal({FOO: 'BAR'})
  })
})
```

Run
---

Run some arbitrary code within the pipeline. Useful to create custom logic and debugging.

```js
describe('run', () => {
  fancy()
  .stdout()
  .run(() => console.log('foo'))
  .run(({stdout}) => expect(stdout).to.equal('foo\n'))
  .end('runs this callback last', () => {
    // test code
  })

  // add to context object
  fancy()
  .add('a', () => 1)
  .add('b', () => 2)
  // context will be {a: 1, b: 2}
  .end('does something with context', context => {
    // test code
  })
})
```

Stdout/Stderr Mocking
---------------------

This is used for tests that ensure that certain stdout/stderr messages are made.
By default this also trims the output from the screen.

You can use the library [stdout-stderr](https://npm.im/stdout-stderr) directly for doing this, but you have to be careful to always reset it after the tests run. We do that work for you so you don't have to worry about mocha's output being hidden.

```js
import chalk from 'chalk'

describe('stdmock tests', () => {
  fancy()
  .stdout()
  .end('mocks stdout', output => {
    console.log('foobar')
    expect(output.stdout).to.equal('foobar\n')
  })

  fancy()
  .stderr()
  .end('mocks stderr', output => {
    console.error('foobar')
    expect(output.stderr).to.equal('foobar\n')
  })

  fancy()
  .stdout()
  .stderr()
  .end('mocks stdout and stderr', output => {
    console.log('foo')
    console.error('bar')
    expect(output.stdout).to.equal('foo\n')
    expect(output.stderr).to.equal('bar\n')
  })
})
```

Chai
----

This library includes [chai](https://npm.im/chai) preloaded with [chai-as-promised](https://npm.im/chai-as-promised) for convenience:

```js
import {expect, fancy} from 'fancy-mocha'

describe('has chai', () => {
  fancy()
  .env({FOO: 'BAR'})
  .end('expects FOO=bar', () => {
    expect(process.env.FOO).to.equal('BAR')
  })
})
```

Chaining
========

Everything here is chainable. You can also store parts of a chain to re-use later on.

For example:

```js
describe('my suite', () => {
  let setupDB = fancy()
                .run(() => setupDB())
                .env({FOO: 'FOO'})

  setupDB
  .stdout()
  .end('tests with stdout mocked', () => {
    // test code
  })

  setupDB
  .env({BAR: 'BAR'})
  .end('also mocks the BAR environment variable', () => {
    // test code
  })
})
```

Using [run](#run) you can really maximize this ability. In fact, you don't even need to pass a callback to it if you prefer this syntax:

```js
describe('my suite', () => {
  let setupDB = fancy()
                .run(() => setupDB())
                .catch(/spurious db error/)
                .run(() => setupDeps())

  let testMyApp = testInfo => {
    return setupDB.run()
    .run(context => myApp(testInfo, context))
  }

  testMyApp({info: 'test run a'})
  .end('tests a')

  testMyApp({info: 'test run b'})
  .end('tests b')
})
```

Custom Plugins
==============

It's easy to create your own plugins to extend fancy. In [dxcli](https://github.com/dxcli/dxcli) we use fancy to create [custom command testers](https://github.com/dxcli/example-multi-cli-typescript/blob/master/test/commands/hello.test.ts).

A plugin is a function that receives a `next` callback that it must call to execute the next plugin in the chain.

Here is an example that creates a counter that could be used to label each test run. See the [actual test](test/base.test.ts) to see the TypeScript types needed.

```js
let count = 0

const counter = prefix => () => {
  count++
  return {count, testLabel: `${prefix}${count}`}
}

// note that .register() MUST be called on a non-instantiated fancy object.
const myFancy = fancy
.register('count', counter)

describe('register', () => {
  myFancy()
  .count('test-')
  .end('is test #1', context => {
    expect(context.count).to.equal(1)
    expect(context.testLabel).to.equal('test-1')
  })

  myFancy()
  .count('test-')
  .end('is test #2', context => {
    expect(context.count).to.equal(2)
    expect(context.testLabel).to.equal('test-2')
  })
})
)
```
