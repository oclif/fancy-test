import HTTP from 'http-call'

import {expect, fancy} from '../src'

describe('nock', () => {
  // from readme
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
  // from readme

  fancy()
  .catch('Mocks not yet satisfied:\nGET https://api.github.com:443/me')
  .nock('https://api.github.com', nock => {
    nock
    .get('/me')
    .reply(200, {name: 'jdxcode'})
  })
  .it('calls .done()')
})
