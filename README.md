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

Table of Contents
-----------------

* [Why](#why)
* [Usage](#usage)
* [Stdout/Stderr Mocking](#stdoutstderr-mocking)
* [Environment Variables](#environment-variables)
* [Nock](#nock)
* [Run](#run)
* [Mock](#mock)
* [Catch](#catch)
* [Chai](#chai)
* [Chaining](#chaining)

Why
---

Mocha out of the box often requires a lot of setup and teardown code in beforeEach/afterEach filters. Using this library, you can get rid of those entirely and build your tests declaratively and easily share the setup and teardown logic as well as common matchers and really anything you might do in a test. It will greatly reduce the amount of repetition in your codebase.

Usage
-----

Setup is pretty easy, just install mocha and fancy-mocha, then you can use any of the examples below.

Assume the following is before all the examples:

```js
import {fancy} from 'fancy-mocha'
import {expect} from 'chai'
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
  .it('mocks stdout', output => {
    console.log('foobar')
    expect(output.stdout).to.equal('foobar\n')
  })

  fancy()
  .stderr()
  .it('mocks stderr', output => {
    console.error('foobar')
    expect(output.stderr).to.equal('foobar\n')
  })

  fancy()
  .stdout()
  .stderr()
  .it('mocks stdout and stderr', output => {
    console.log('foo')
    console.error('bar')
    expect(output.stdout).to.equal('foo\n')
    expect(output.stderr).to.equal('bar\n')
  })
})
```

Nock
----

(not to be confused with [mock](#mock))

Uses [nock](https://github.com/node-nock/nock) to mock out HTTP calls to external APIs.
Automatically calls `done()` to ensure the calls were made and `cleanAll()` to remove any pending requests.

```js
describe('nock tests', () => {
  fancy()
  .nock('https://api.github.com', nock => {
    nock
    .get('/me')
    .reply(200, {name: 'jdxcode'})
  })
  .it('mocks http call to github', async () => {
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
  .it('mocks FOO', () => {
    expect(process.env.FOO).to.equal('BAR')
    expect(process.env).to.not.deep.equal({FOO: 'BAR'})
  })

  fancy()
  .env({FOO: 'BAR'}, {clear: true})
  .it('clears all env vars', () => {
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
  .it('runs this callback last', () => {
    // test code
  })

  // add to context object
  fancy()
  .run({addToContext: true}, () => { return {a: 1}})
  .run({addToContext: true}, () => { return {b: 2}})
  // context will be {a: 1, b: 2}
  .it('does something with context', context => {
    // test code
  })
})
```

Mock
----

(not to be confused with [nock](#nock))

Mock any object. Like all fancy plugins, it ensures that it is reset to normal after the test runs.
```js
import * as os from 'os'

describe('mock tests', () => {
  fancy()
  .mock(os, 'platform', () => 'foobar')
  .it('sets os', () => {
    expect(os.platform()).to.equal('foobar')
  })

  fancy()
  .mock(os, 'platform', sinon.stub().returns('foobar'))
  .it('uses sinon', () => {
    expect(os.platform()).to.equal('foobar')
    expect(os.platform.called).to.equal(true)
  })
})
```

Catch
-----

catch errors in a declarative way. By default, ensures they are actually thrown as well.

```js
describe('catch', () => {
  fancy()
  .catch(/foo/)
  .it('uses regex', () => {
    throw new Error('foobar')
  })

  fancy()
  .catch('foobar')
  .it('uses string', () => {
    throw new Error('foobar')
  })

  fancy()
  .catch(err => {
    expect(err.message).to.match(/foo/)
  })
  .it('uses function', () => {
    throw new Error('foobar')
  })

  fancy()
  .catch('foobar', {raiseIfNotThrown: false})
  .it('do not error if not thrown', () => {
    // this would raise because there is no error being thrown
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
  .it('expects FOO=bar', () => {
    expect(process.env.FOO).to.equal('BAR')
  })
})
```

Chaining
--------

Everything here is chainable. You can also store parts of a chain to re-use later on.

For example:

```js
describe('my suite', () => {
  let setupDB = fancy()
                .run(() => setupDB())
                .env({FOO: 'FOO'})

  setupDB
  .stdout()
  .it('tests with stdout mocked', () => {
    // test code
  })

  setupDB
  .env({BAR: 'BAR'})
  .it('also mocks the BAR environment variable', () => {
    // test code
  })
})
```

Using [run](#run) you can really maximize this ability. In fact, you don't even need to pass a callback to it if you prefer this syntax:

```js
describe('my suite', () => {
  let setupDB = fancy()
                .run(() => setupDB())
                .run(() => setupDeps())

  let testMyApp = testInfo => {
    return setupDB.run()
    .run({addToContext: true}, () => { return {a: 1}})
    .run({addToContext: true}, () => { return {b: 2}})
    // context will be {a: 1, b: 2}
    .run(context => myApp(testInfo, context))
  }

  testMyApp({info: 'test run a'})
  .it('tests a')

  testMyApp({info: 'test run b'})
  .it('tests b')
})
```
