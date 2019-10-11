import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import accounts from '../responses/v2-get-accounts.json'

const log = debug('starling:account-test')

describe('Account', () => {
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v2/accounts')
    .reply(200, accounts)

  test('should retrieve the customer\'s account details', done => {
    starlingCli
      .getAccounts(accessToken)
      .then(function ({ data }) {
        expect(data.accounts).toHaveLength(1)
        expect(data.accounts[0].accountUid).toBe('b0b20c9d-3b6b-42f1-a7d0-e70d4538e0d9')
        expect(data.accounts[0].defaultCategory).toBe('cc2d03f9-9438-4c7b-a426-ba3199740d73')
        expect(data.accounts[0].currency).toBe('GBP')
        expect(data.accounts[0].createdAt).toBe('2017-05-08T12:34:21.000Z')

        log(JSON.stringify(data))

        done()
      })
  })
})
