import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import addresses from '../responses/v1-get-addresses.json'

const log = debug('starling:address-test')

describe('Address', () => {
  const accessToken = '0123456789'

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v1/addresses')
    .reply(200, addresses)

  test('should retrieve the customer address history', done => {
    const starlingCli = new Starling({
      apiUrl: 'http://localhost'
    })

    starlingCli
      .getAddresses(accessToken)
      .then(function ({ data }) {
        expect(data.current.streetAddress).toBe('Flat 113')
        expect(data.current.city).toBe('KINGSTON UPON THAMES')
        expect(data.current.country).toBe('GBR')
        expect(data.current.postcode).toBe('KT2 5BH')

        expect(data.previous[0].streetAddress).toBe('Grange Farm House')
        expect(data.previous[0].city).toBe('COVENTRY')
        expect(data.previous[0].country).toBe('GBR')
        expect(data.previous[0].postcode).toBe('CV4 2DH')

        log(JSON.stringify(data))

        done()
      })
  })
})
