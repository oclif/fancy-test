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

stdout/stderr mocking
---------------------

This is used for tests that ensure that certain stdout/stderr messages are made.
By default this also trims the output from the screen.

```js
import {expect} from 'chai'
import fancy from 'fancy-mocha'
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

environment variables
---------------------

```js
import {expect} from 'chai'
import fancy from 'fancy-mocha'

describe('stdmock tests', () => {
  fancy()
  .stdout()
  .it('mocks stdout', output => {
    console.log('foobar')
    expect(output.stdout).to.equal('foobar\n')
  })

  fancy()
  .stdout({print: true})
  .it('mocks stdout but also prints to screen', output => {
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

  fancy()
  .stdout({stripColor: false})
  .it('mocks stdout but does not strip the color codes', output => {
    console.log(chalk.red('foobar'))
    expect(output.stdout).to.contain(chalk.red('foobar'))
  })
})
```
