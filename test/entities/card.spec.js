import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import cards from '../responses/v2-get-cards.json'

const log = debug('starling:card-test')

describe('Card', () => {
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v2/cards')
    .reply(200, cards)

  test('should retrieve the customer\'s card details', done => {
    starlingCli
      .getCards(accessToken)
      .then(function ({ data }) {
        expect(data.cards).toHaveLength(1)
        expect(data.cards[0].cardUid).toBe('a0be8f6a-faa9-40f8-a0b8-58205e722cd7')
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
})
