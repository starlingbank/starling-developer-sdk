import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import card from '../responses/v1-get-card.json'

const log = debug('starling:card-test')

describe('Card', () => {
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v1/cards')
    .reply(200, card)

  test('should retrieve the customer\'s card details', done => {
    starlingCli
      .getCard(accessToken)
      .then(function ({ data }) {
        expect(data.nameOnCard).toBe('Ms XXX YYY')
        expect(data.lastFourDigits).toBe('4321')
        expect(data.expiryDate).toBe('2020-01-01')

        log(JSON.stringify(card))

        done()
      })
  })
})
