import nock from 'nock'
import expect from 'must'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import addresses from '../responses/v1-get-addresses.json'

const log = debug('starling:address-test')

describe('Address', function () {
  this.timeout(30 * 1000)
  const accessToken = '0123456789'

  nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
    .get('/api/v1/addresses')
    .reply(200, addresses)

  it('should retrieve the customer address history', function (done) {
    const starlingCli = new Starling({
      apiUrl: 'http://localhost:8080'
    })

    starlingCli
      .getAddresses(accessToken)
      .then(function ({ data }) {
        expect(data.current.streetAddress).to.be('Flat 113')
        expect(data.current.city).to.be('KINGSTON UPON THAMES')
        expect(data.current.country).to.be('GBR')
        expect(data.current.postcode).to.be('KT2 5BH')

        expect(data.previous[0].streetAddress).to.be('Grange Farm House')
        expect(data.previous[0].city).to.be('COVENTRY')
        expect(data.previous[0].country).to.be('GBR')
        expect(data.previous[0].postcode).to.be('CV4 2DH')

        log(JSON.stringify(data))

        done()
      }).catch(done)
  })
})
