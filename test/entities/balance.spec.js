import nock from 'nock'
import expect from 'must'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import balance from '../responses/v1-get-balance.json'

const log = debug('starling:balance-test')

describe('Balance', function () {
  this.timeout(30 * 1000)
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v1/accounts/balance')
    .reply(200, balance)

  it('should retrieve the customer\'s account details', function (done) {
    starlingCli
      .getBalance(accessToken)
      .then(function ({ data }) {
        expect(data.amount).to.be(253)
        expect(data.currency).to.be('GBP')

        log(JSON.stringify(data))

        done()
      })
      .catch(done)
  })
})
