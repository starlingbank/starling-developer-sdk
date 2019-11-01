import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import cards from '../responses/v2-get-cards.json'

const log = debug('starling:card-test')

describe('Card', () => {
  const accessToken = '0123456789'
  const cardUid = 'a0be8f6a-faa9-40f8-a0b8-58205e722cd7'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v2/cards')
    .reply(200, cards)

  const nockLock = nock('http://localhost', expectAuthorizationHeader(accessToken))
    .put(`/api/v2/cards/${cardUid}/controls/enabled`, obj => Object.prototype.hasOwnProperty.call(obj, 'enabled'))
    .reply(200)

  const nockATM = nock('http://localhost', expectAuthorizationHeader(accessToken))
    .put(`/api/v2/cards/${cardUid}/controls/atm-enabled`, obj => Object.prototype.hasOwnProperty.call(obj, 'enabled'))
    .reply(200)

  const nockOnline = nock('http://localhost', expectAuthorizationHeader(accessToken))
    .put(`/api/v2/cards/${cardUid}/controls/online-enabled`, obj => Object.prototype.hasOwnProperty.call(obj, 'enabled'))
    .reply(200)

  const nockMobileWallet = nock('http://localhost', expectAuthorizationHeader(accessToken))
    .put(`/api/v2/cards/${cardUid}/controls/mobile-wallet-enabled`, obj => Object.prototype.hasOwnProperty.call(obj, 'enabled'))
    .reply(200)

  const nockGambling = nock('http://localhost', expectAuthorizationHeader(accessToken))
    .put(`/api/v2/cards/${cardUid}/controls/gambling-enabled`, obj => Object.prototype.hasOwnProperty.call(obj, 'enabled'))
    .reply(200)

  const nockPos = nock('http://localhost', expectAuthorizationHeader(accessToken))
    .put(`/api/v2/cards/${cardUid}/controls/pos-enabled`, obj => Object.prototype.hasOwnProperty.call(obj, 'enabled'))
    .reply(200)

  const nockMagstripe = nock('http://localhost', expectAuthorizationHeader(accessToken))
    .put(`/api/v2/cards/${cardUid}/controls/mag-stripe-enabled`, obj => Object.prototype.hasOwnProperty.call(obj, 'enabled'))
    .reply(200)

  test('should retrieve the customer\'s card details', done => {
    starlingCli
      .getCards(accessToken)
      .then(function ({ data }) {
        expect(data.cards).toHaveLength(1)
        expect(data.cards[0].cardUid).toBe(cardUid)
        expect(data.cards[0].publicToken).toBe('a0be8f6a')
        expect(data.cards[0].walletNotificationEnabled).toBe(true)
        expect(data.cards[0].posEnabled).toBe(true)
        expect(data.cards[0].atmEnabled).toBe(true)
        expect(data.cards[0].onlineEnabled).toBe(true)
        expect(data.cards[0].mobileWalletEnabled).toBe(true)
        expect(data.cards[0].gamblingEnabled).toBe(true)
        expect(data.cards[0].magStripeEnabled).toBe(true)
        expect(data.cards[0].cancelled).toBe(false)
        expect(data.cards[0].activationRequested).toBe(true)
        expect(data.cards[0].activated).toBe(true)
        expect(data.cards[0].endOfCardNumber).toBe('59312')

        log(JSON.stringify(data))

        done()
      })
  })

  test('should update card lock', done => {
    expect(nockLock.isDone()).toBe(false)
    starlingCli
      .updateCardLock(accessToken, cardUid, true)
      .then(function ({ data, status }) {
        expect(status).toBe(200)
        expect(nockLock.isDone()).toBe(true)

        log(JSON.stringify(data))

        done()
      })
  })

  test('should update ATM control', done => {
    expect(nockATM.isDone()).toBe(false)
    starlingCli
      .updateCardATMControl(accessToken, cardUid, true)
      .then(function ({ data, status }) {
        expect(status).toBe(200)
        expect(nockATM.isDone()).toBe(true)

        log(JSON.stringify(data))

        done()
      })
  })

  test('should update online payments control', done => {
    expect(nockOnline.isDone()).toBe(false)
    starlingCli
      .updateCardOnlineControl(accessToken, cardUid, true)
      .then(function ({ data, status }) {
        expect(status).toBe(200)
        expect(nockOnline.isDone()).toBe(true)

        log(JSON.stringify(data))

        done()
      })
  })

  test('should update mobile wallet payments control', done => {
    expect(nockMobileWallet.isDone()).toBe(false)
    starlingCli
      .updateCardMobileWalletControl(accessToken, cardUid, true)
      .then(function ({ data, status }) {
        expect(status).toBe(200)
        expect(nockMobileWallet.isDone()).toBe(true)

        log(JSON.stringify(data))

        done()
      })
  })

  test('should update gambling payments control', done => {
    expect(nockGambling.isDone()).toBe(false)
    starlingCli
      .updateCardGamblingControl(accessToken, cardUid, true)
      .then(function ({ data, status }) {
        expect(status).toBe(200)
        expect(nockGambling.isDone()).toBe(true)

        log(JSON.stringify(data))

        done()
      })
  })

  test('should update card present payments control', done => {
    expect(nockPos.isDone()).toBe(false)
    starlingCli
      .updateCardPresentControl(accessToken, cardUid, true)
      .then(function ({ data, status }) {
        expect(status).toBe(200)
        expect(nockPos.isDone()).toBe(true)

        log(JSON.stringify(data))

        done()
      })
  })

  test('should update magstripe payments control', done => {
    expect(nockMagstripe.isDone()).toBe(false)
    starlingCli
      .updateCardMagstripeControl(accessToken, cardUid, true)
      .then(function ({ data, status }) {
        expect(status).toBe(200)
        expect(nockMagstripe.isDone()).toBe(true)

        log(JSON.stringify(data))

        done()
      })
  })
})
