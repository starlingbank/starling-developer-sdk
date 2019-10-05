import nock from 'nock'
import expect from 'must'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import whoAmI from '../responses/v1-get-me.json'

const log = debug('starling:who-am-i-test')

describe('Who Am I', function () {
  this.timeout(30 * 1000)
  const accessToken = '0123456789'

  nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
    .get('/api/v1/me')
    .reply(200, whoAmI)

  it('should retrieve the customer uid, permissions and time the token  will remain valid for', function (done) {
    const starlingCli = new Starling({
      apiUrl: 'http://localhost:8080'
    })

    starlingCli
      .getMe(accessToken)
      .then(function ({ data }) {
        expect(data.customerUid).to.be('e0be8f6a-f239-40f8-a0b8-58205e722cd7')
        expect(data.authenticated).to.be(true)
        expect(data.expiresInSeconds).to.be(3243)
        expect(data.scopes[1]).to.be('balance:read')

        log(JSON.stringify(data))

        done()
      }).catch(done)
  })
})
