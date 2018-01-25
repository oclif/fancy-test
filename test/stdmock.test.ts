// tslint:disable no-console

import chalk from 'chalk'

import {expect, fancy} from '../src'

describe('stdout', () => {
  fancy()
  .stderr()
  .stdout()
  .it('logs', output => {
    console.log('foo')
    console.error('written')
    expect(output.stdout).to.equal('foo\n')
  })

  fancy()
  .stdout()
  .it('logs twice', output => {
    console.log('foo')
    expect(output.stdout).to.equal('foo\n')
    console.log('bar')
    expect(output.stdout).to.equal('foo\nbar\n')
  })

  fancy()
  .stderr()
  .it('writes to stderr', output => {
    console.error('foo')
    expect(output.stderr).to.equal('foo\n')
  })

  fancy()
  .stdout()
  .stderr()
  .it('writes to both', output => {
    console.error('foo')
    console.log('bar')
    expect(output.stderr).to.equal('foo\n')
    expect(output.stdout).to.equal('bar\n')
  })

  fancy()
  .stdout()
  .it('strips colors by default', output => {
    console.log(chalk.red('foobar'))
    expect(output.stdout).to.equal('foobar\n')
  })

  // from readme
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
