import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import addresses from '../responses/v2-get-addresses.json'

const log = debug('starling:address-test')

describe('Address', () => {
  const accessToken = '0123456789'

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v2/addresses')
    .reply(200, addresses)

  test('should retrieve the customer address history', done => {
    const starlingCli = new Starling({
      apiUrl: 'http://localhost'
    })

    starlingCli
      .getAddresses(accessToken)
      .then(function ({ data }) {
        expect(data.current.line1).toBe('1A Admiralty Arch')
        expect(data.current.line2).toBe('The Mall')
        expect(data.current.line3).toBe('City of Westminster')
        expect(data.current.postTown).toBe('LONDON')
        expect(data.current.postCode).toBe('SW1A 2WH')
        expect(data.current.countryCode).toBe('GB')

        expect(data.previous[0].line1).toBe('3rd Floor, 2 Finsbury Avenue')
        expect(data.previous[0].postTown).toBe('LONDON')
        expect(data.previous[0].postCode).toBe('EC2M 2PP')
        expect(data.previous[0].countryCode).toBe('GB')

        log(JSON.stringify(data))

        done()
      })
  })
})
