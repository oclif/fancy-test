// tslint:disable no-console

import chalk from 'chalk'

import {expect, fancy} from '../src'

describe('stdout', () => {
  fancy
  .stderr()
  .stdout()
  .end('logs', output => {
    console.log('foo')
    console.error('written')
    expect(output.stdout).to.equal('foo\n')
  })

  fancy
  .stdout()
  .end('logs twice', output => {
    console.log('foo')
    expect(output.stdout).to.equal('foo\n')
    console.log('bar')
    expect(output.stdout).to.equal('foo\nbar\n')
  })

  fancy
  .stderr()
  .end('writes to stderr', output => {
    console.error('foo')
    expect(output.stderr).to.equal('foo\n')
  })

  fancy
  .stdout()
  .stderr()
  .end('writes to both', output => {
    console.error('foo')
    console.log('bar')
    expect(output.stderr).to.equal('foo\n')
    expect(output.stdout).to.equal('bar\n')
  })

  fancy
  .stdout()
  .end('strips colors by default', output => {
    console.log(chalk.red('foobar'))
    expect(output.stdout).to.equal('foobar\n')
  })

  // from readme
  fancy
  .stdout()
  .end('mocks stdout', output => {
    console.log('foobar')
    expect(output.stdout).to.equal('foobar\n')
  })

  fancy
  .stdout({print: true})
  .end('mocks stdout but also prints to screen', output => {
    console.log('foobar')
    expect(output.stdout).to.equal('foobar\n')
  })

  fancy
  .stderr()
  .end('mocks stderr', output => {
    console.error('foobar')
    expect(output.stderr).to.equal('foobar\n')
  })

  fancy
  .stdout()
  .stderr()
  .end('mocks stdout and stderr', output => {
    console.log('foo')
    console.error('bar')
    expect(output.stdout).to.equal('foo\n')
    expect(output.stderr).to.equal('bar\n')
  })

  fancy
  .stdout({stripColor: false})
  .end('mocks stdout but does not strip the color codes', output => {
    console.log(chalk.red('foobar'))
    expect(output.stdout).to.contain(chalk.red('foobar'))
  })

  fancy
  .stdout()
  .do(() => console.log('foo'))
  .do(c => expect(c.stdout).to.equal('foo\n'))
  .stdout()
  .do(() => console.log('bar'))
  .do(c => expect(c.stdout).to.equal('bar\n'))
  .it('resets stdout')
})

describe('stdin', () => {
  fancy
  .stdin('whoa there, broseph\n')
  .stdout()
  .it('mocks', (_, done) => {
    process.stdin.setEncoding('utf8')
    process.stdin.once('data', data => {
      done(data === 'whoa there, broseph\n' ? undefined : 'invalid stdin')
    })
  })

  fancy
  .stdin('whoa there again, broseph\n')
  .stdout()
  .it('mocks again', (_, done) => {
    process.stdin.setEncoding('utf8')
    process.stdin.once('data', data => {
      done(data === 'whoa there again, broseph\n' ? undefined : 'invalid stdin')
    })
  })
})
