import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'
import Starling from '../../src/starling'
import listScheduledPaymentsResponse from '../responses/v1-list-scheduled-payments.json'

const log = debug('starling:payment-test')

describe('Payments', () => {
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  const destinationAccountUid = '11eb8d9b-386a-43ba-825d-7edee5c6b01a'
  const reference = 'Dinner'
  const amount = '10'

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .post('/api/v1/payments/local')
    .reply(202)

  test('should instruct a payment on the customer\'s behalf', done => {
    starlingCli
      .makeLocalPayment(accessToken, destinationAccountUid, reference, amount)
      .then(function ({ status }) {
        expect(status).toBe(202)
        done()
      })
  })

  test('should retrieve the customer\'s scheduled payments', done => {
    nock('http://localhost', expectAuthorizationHeader(accessToken))
      .get('/api/v1/payments/scheduled')
      .reply(200, listScheduledPaymentsResponse)

    starlingCli
      .listScheduledPayments(accessToken)
      .then(function ({ data }) {
        const pay = data._embedded.paymentOrders[0]
        expect(pay.paymentOrderId).toBe('3135f1f998-e5a9-452b-842c-a7c6417f9ae8')
        expect(pay.receivingContactAccountId).toBe('11eb8d9b-386a-43ba-825d-7edee5c6b01a')
        expect(pay.reference).toBe('Spring Cleaning')
        expect(pay.recurrenceRule.startDate).toBe('2017-03-30')
        expect(pay.recurrenceRule.frequency).toBe('WEEKLY')
        expect(pay.recurrenceRule.interval).toBe(1)
        expect(pay.recurrenceRule.untilDate).toBe('2017-04-13')
        expect(pay.recurrenceRule.days[0]).toBe('THURSDAY')
        expect(pay.paymentType).toBe('STANDING_ORDER')
        log(JSON.stringify(data))
        done()
      })
  })
})
