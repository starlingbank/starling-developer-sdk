import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import balance from '../responses/v1-get-balance.json'

const log = debug('starling:balance-test')

describe('Balance', () => {
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v1/accounts/balance')
    .reply(200, balance)

  test('should retrieve the customer\'s account details', done => {
    starlingCli
      .getBalance(accessToken)
      .then(function ({ data }) {
        expect(data.amount).toBe(253)
        expect(data.currency).toBe('GBP')

        log(JSON.stringify(data))

        done()
      })
  })
})
