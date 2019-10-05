import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import whoAmI from '../responses/v1-get-me.json'

const log = debug('starling:who-am-i-test')

describe('Who Am I', () => {
  const accessToken = '0123456789'

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v1/me')
    .reply(200, whoAmI)

  test(
    'should retrieve the customer uid, permissions and time the token  will remain valid for',
    done => {
      const starlingCli = new Starling({
        apiUrl: 'http://localhost'
      })

      starlingCli
        .getMe(accessToken)
        .then(function ({ data }) {
          expect(data.customerUid).toBe('e0be8f6a-f239-40f8-a0b8-58205e722cd7')
          expect(data.authenticated).toBe(true)
          expect(data.expiresInSeconds).toBe(3243)
          expect(data.scopes[1]).toBe('balance:read')

          log(JSON.stringify(data))

          done()
        })
    }
  )
})
