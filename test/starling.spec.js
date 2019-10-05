import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from './testSupport'

import Starling from '../src/starling'
import account from './responses/v1-get-accounts.json'

const log = debug('starling:account-test')

describe('Starling Client', () => {
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost',
    accessToken
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v1/accounts')
    .reply(200, account)

  test(
    'should support a static access token provided in the client instance',
    done => {
      starlingCli
        .getAccount()
        .then(function ({ data }) {
          expect(data.name).toBe('2027f9c9-08fa-4c8e-ab19-daec80d7a187 GBP')
          expect(data.number).toBe('95761014')
          expect(data.sortCode).toBe('608371')
          expect(data.currency).toBe('GBP')
          expect(data.iban).toBe('GB14SRLGGB2L60837195761014')
          expect(data.createdAt).toBe('2016-11-21T00:00:00Z')

          log(JSON.stringify(data))

          done()
        })
    }
  )
})
