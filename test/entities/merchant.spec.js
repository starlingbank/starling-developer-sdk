import nock from 'nock'
import expect from 'must'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import getMerchantResponse from '../responses/v1-get-merchant.json'
import getMerchantLocationResponse from '../responses/v1-get-merchant-location.json'

const log = debug('starling:merchant-test')

describe('Merchant', function () {
  this.timeout(30 * 1000)
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  it('should retrieve the merchant\'s details', function (done) {
    const merchantUid = '32b4d093-f3b3-45da-9f89-d6a1395ab397'

    nock('http://localhost', expectAuthorizationHeader(accessToken))
      .get(`/api/v1/merchants/${merchantUid}`)
      .reply(200, getMerchantResponse)

    starlingCli
      .getMerchant(accessToken, merchantUid)
      .then(function ({ data }) {
        expect(data.merchantUid).to.be(merchantUid)
        expect(data.name).to.be('Best Shop')
        expect(data.phoneNumber).to.be('020123456')
        expect(data.twitterUsername).to.be('bestshop')
        expect(data.website).to.be('http://www.bestshop.com')

        log(JSON.stringify(data))

        done()
      })
      .catch(done)
  })

  it('should retrieve the merchant\'s location details', function (done) {
    const merchantUid = '32b4d093-f3b3-45da-9f89-d6a1395ab397'
    const merchantLocationUid = '4d8f9404-9705-43c5-93e3-0ee1b5cd1f71'

    nock('http://localhost', expectAuthorizationHeader(accessToken))
      .get(`/api/v1/merchants/${merchantUid}/locations/${merchantLocationUid}`)
      .reply(200, getMerchantLocationResponse)

    starlingCli
      .getMerchantLocation(accessToken, merchantUid, merchantLocationUid)
      .then(function ({ data }) {
        expect(data.address).to.be('22 Frockle Street')
        expect(data.googlePlaceId).to.be('ABCA')
        expect(data.locationName).to.be('Best Shop')
        expect(data.mastercardMerchantCategoryCode).to.be(3)
        expect(data.merchant.deprecation).to.be('https://api.starlingbank.com/notreal/url')
        expect(data.merchant.href).to.be('text')
        expect(data.merchant.hreflang).to.be('text')
        expect(data.merchant.name).to.be('Best Shop')
        expect(data.merchant.profile).to.be('https://api.starlingbank.com/notreal/uri')
        expect(data.merchant.templated).to.be(true)
        expect(data.merchant.title).to.be('Bestest')
        expect(data.merchant.type).to.be('Shop')
        expect(data.merchantUid).to.be(merchantUid)
        expect(data.name).to.be('Best Shop')
        expect(data.phoneNumber).to.be('020123456')
        expect(data.twitterUsername).to.be('bestshop')
        expect(data.website).to.be('http://www.bestshop.com')

        log(JSON.stringify(data))

        done()
      })
      .catch(done)
  })
})
