import HTTP from 'http-call'

import {expect, fancy} from '../src'

describe('nock', () => {
  // from readme
  fancy
    .nock('https://api.github.com', nock => {
      nock
        .get('/me')
        .reply(200, {name: 'jdxcode'})
    })
    .end('mocks http call to github', async () => {
      const {body: user} = await HTTP.get('https://api.github.com/me')
      expect(user).to.have.property('name', 'jdxcode')
    })
  // from readme

  fancy
    .nock('https://api.github.com', {reqheaders: {foo: 'bar'}}, nock => {
      nock
        .get('/me')
        .reply(200, {name: 'jdxcode'})
    })
    .end('passes options', async () => {
      const {body: user} = await HTTP.get('https://api.github.com/me', {headers: {foo: 'bar'}})
      expect(user).to.have.property('name', 'jdxcode')
    })
})
