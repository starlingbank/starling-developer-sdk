import nock from 'nock'
import expect from 'must'
import debug from 'debug'
import { expectAuthorizationHeader } from './testSupport'

import Starling from '../src/starling'
import account from './responses/v1-get-accounts.json'

const log = debug('starling:account-test')

describe('Starling Client', function () {
  this.timeout(30 * 1000)
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost',
    accessToken
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v1/accounts')
    .reply(200, account)

  it('should support a static access token provided in the client instance', function (done) {
    starlingCli
      .getAccount()
      .then(function ({ data }) {
        expect(data.name).to.be('2027f9c9-08fa-4c8e-ab19-daec80d7a187 GBP')
        expect(data.number).to.be('95761014')
        expect(data.sortCode).to.be('608371')
        expect(data.currency).to.be('GBP')
        expect(data.iban).to.be('GB14SRLGGB2L60837195761014')
        expect(data.createdAt).to.be('2016-11-21T00:00:00Z')

        log(JSON.stringify(data))

        done()
      })
      .catch(done)
  })
})
