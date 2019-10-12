import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import identityToken from '../responses/v2-get-identity-token.json'

const log = debug('starling:identity-test')

describe('Identity', () => {
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v2/identity/token')
    .reply(200, identityToken)

  test('should retrieve the token identity',
    done => {
      starlingCli
        .getTokenIdentity(accessToken)
        .then(function ({ data }) {
          expect(data.accountHolderUid).toBe('a0be8f4a-faa9-40f8-a0b8-58205e722cd7')
          expect(data.expiresAt).toBe('2017-09-08T12:34:21.000Z')
          expect(data.expiresInSeconds).toBe(123)
          expect(data.scopes).toHaveLength(1)
          expect(data.scopes[0]).toBe('balance:read')
          expect(data.authenticated).toBe(true)

          log(JSON.stringify(data))

          done()
        })
    }
  )
})
