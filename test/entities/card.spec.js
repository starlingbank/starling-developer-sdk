import nock from 'nock'
import expect from 'must'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import card from '../responses/v1-get-card.json'

const log = debug('starling:card-test')

describe('Card', function () {
  this.timeout(30 * 1000)
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost:8080'
  })

  nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
    .get('/api/v1/cards')
    .reply(200, card)

  it('should retrieve the customer\'s card details', function (done) {
    starlingCli
      .getCard(accessToken)
      .then(function ({ data }) {
        expect(data.nameOnCard).to.be('Ms XXX YYY')
        expect(data.lastFourDigits).to.be('4321')
        expect(data.expiryDate).to.be('2020-01-01')

        log(JSON.stringify(card))

        done()
      })
      .catch(done)
  })
})
