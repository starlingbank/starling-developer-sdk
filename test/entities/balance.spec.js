import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import balance from '../responses/v2-get-balance.json'

const log = debug('starling:balance-test')

describe('Balance', () => {
  const accessToken = '0123456789'
  const accountUid = 'b0b20c9d-3b6b-42f1-a7d0-e70d4538e0d9'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get(`/api/v2/accounts/${accountUid}/balance`)
    .reply(200, balance)

  test('should retrieve the customer\'s account details', done => {
    starlingCli
      .getBalance(accessToken, accountUid)
      .then(function ({ data }) {
        expect(data.clearedBalance.currency).toBe('GBP')
        expect(data.effectiveBalance.currency).toBe('GBP')
        expect(data.pendingTransactions.currency).toBe('GBP')
        expect(data.acceptedOverdraft.currency).toBe('GBP')
        expect(data.amount.currency).toBe('GBP')

        expect(data.clearedBalance.minorUnits).toBe(1111)
        expect(data.effectiveBalance.minorUnits).toBe(2222)
        expect(data.pendingTransactions.minorUnits).toBe(3333)
        expect(data.acceptedOverdraft.minorUnits).toBe(4444)
        expect(data.amount.minorUnits).toBe(5555)

        log(JSON.stringify(data))

        done()
      })
  })
})
