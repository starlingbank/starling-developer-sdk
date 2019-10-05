import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import getMerchantResponse from '../responses/v1-get-merchant.json'
import getMerchantLocationResponse from '../responses/v1-get-merchant-location.json'

const log = debug('starling:merchant-test')

describe('Merchant', () => {
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  test('should retrieve the merchant\'s details', done => {
    const merchantUid = '32b4d093-f3b3-45da-9f89-d6a1395ab397'

    nock('http://localhost', expectAuthorizationHeader(accessToken))
      .get(`/api/v1/merchants/${merchantUid}`)
      .reply(200, getMerchantResponse)

    starlingCli
      .getMerchant(accessToken, merchantUid)
      .then(function ({ data }) {
        expect(data.merchantUid).toBe(merchantUid)
        expect(data.name).toBe('Best Shop')
        expect(data.phoneNumber).toBe('020123456')
        expect(data.twitterUsername).toBe('bestshop')
        expect(data.website).toBe('http://www.bestshop.com')

        log(JSON.stringify(data))

        done()
      })
  })

  test('should retrieve the merchant\'s location details', done => {
    const merchantUid = '32b4d093-f3b3-45da-9f89-d6a1395ab397'
    const merchantLocationUid = '4d8f9404-9705-43c5-93e3-0ee1b5cd1f71'

    nock('http://localhost', expectAuthorizationHeader(accessToken))
      .get(`/api/v1/merchants/${merchantUid}/locations/${merchantLocationUid}`)
      .reply(200, getMerchantLocationResponse)

    starlingCli
      .getMerchantLocation(accessToken, merchantUid, merchantLocationUid)
      .then(function ({ data }) {
        expect(data.address).toBe('22 Frockle Street')
        expect(data.googlePlaceId).toBe('ABCA')
        expect(data.locationName).toBe('Best Shop')
        expect(data.mastercardMerchantCategoryCode).toBe(3)
        expect(data.merchant.deprecation).toBe('https://api.starlingbank.com/notreal/url')
        expect(data.merchant.href).toBe('text')
        expect(data.merchant.hreflang).toBe('text')
        expect(data.merchant.name).toBe('Best Shop')
        expect(data.merchant.profile).toBe('https://api.starlingbank.com/notreal/uri')
        expect(data.merchant.templated).toBe(true)
        expect(data.merchant.title).toBe('Bestest')
        expect(data.merchant.type).toBe('Shop')
        expect(data.merchantUid).toBe(merchantUid)
        expect(data.name).toBe('Best Shop')
        expect(data.phoneNumber).toBe('020123456')
        expect(data.twitterUsername).toBe('bestshop')
        expect(data.website).toBe('http://www.bestshop.com')

        log(JSON.stringify(data))

        done()
      })
  })
})
