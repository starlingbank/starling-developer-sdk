import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'
import Starling from '../../src/starling'
import getPaymentOrderResponse from '../responses/v2-get-payment-order.json'
import getPaymentOrderPaymentsResponse from '../responses/v2-get-payment-order-payments.json'
import listStandingOrdersResponse from '../responses/v2-list-standing-orders.json'
import getStandingOrderResponse from '../responses/v2-get-standing-order.json'

const log = debug('starling:payment-test')

describe('Payments', () => {
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  const paymentOrderUid = 'e0cb928a-075a-4254-833f-bddb26aef414'

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get(`/api/v2/payments/local/payment-order/${paymentOrderUid}`)
    .reply(200, getPaymentOrderResponse)

  test('should be able to get a payment order', done => {
    starlingCli
      .payment
      .getPaymentOrder({ accessToken, paymentOrderUid })
      .then(function ({ data }) {
        expect(data.paymentOrderUid).toBe(paymentOrderUid)
        expect(data.amount.currency).toBe('GBP')
        expect(data.amount.minorUnits).toBe(11223344)
        expect(data.reference).toBe('Payment reference')
        expect(data.payeeUid).toBe('e231c503-72cd-4fbf-a643-be61c3c5ba12')
        expect(data.payeeAccountUid).toBe('a2c6e45b-6f24-48be-ba52-58bff94bef59')

        log(JSON.stringify(data))

        done()
      })
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get(`/api/v2/payments/local/payment-order/${paymentOrderUid}/payments`)
    .reply(200, getPaymentOrderPaymentsResponse)

  test('should be able to get a payment order\'s payments', done => {
    starlingCli
      .payment
      .getPaymentOrderPayments({ accessToken, paymentOrderUid })
      .then(function ({ data }) {
        expect(data.payments).toHaveLength(1)
        expect(data.payments[0].paymentUid).toBe('d812059f-c15d-49d6-9c1c-76ae4e67f8cb')
        expect(data.payments[0].amount.currency).toBe('GBP')
        expect(data.payments[0].amount.minorUnits).toBe(11223344)
        expect(data.payments[0].reference).toBe('Payment reference')
        expect(data.payments[0].payeeUid).toBe('e231c503-72cd-4fbf-a643-be61c3c5ba12')
        expect(data.payments[0].payeeAccountUid).toBe('a2c6e45b-6f24-48be-ba52-58bff94bef59')
        expect(data.payments[0].createdAt).toBe('2018-06-30T00:01:00.000Z')
        expect(data.payments[0].completedAt).toBe('2018-06-30T00:02:00.000Z')
        expect(data.payments[0].rejectedAt).toBe('2018-06-30T00:03:00.000Z')
        expect(data.payments[0].paymentStatusDetails.paymentStatus).toBe('ACCEPTED')
        expect(data.payments[0].paymentStatusDetails.description).toBe('ACCEPTED')

        log(JSON.stringify(data))

        done()
      })
  })

  const accountUid = 'b0b20c9d-3b6b-42f1-a7d0-e70d4538e0d9'
  const categoryUid = 'cc2d03f9-9438-4c7b-a426-ba3199740d73'

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get(`/api/v2/payments/local/account/${accountUid}/category/${categoryUid}/standing-orders`)
    .reply(200, listStandingOrdersResponse)

  test('should be able to list standing orders', done => {
    starlingCli
      .payment
      .listStandingOrders({ accessToken, accountUid, categoryUid })
      .then(function ({ data }) {
        expect(data.standingOrders).toHaveLength(1)
        expect(data.standingOrders[0].paymentOrderUid).toBe(paymentOrderUid)
        expect(data.standingOrders[0].amount.currency).toBe('GBP')
        expect(data.standingOrders[0].amount.minorUnits).toBe(11223344)
        expect(data.standingOrders[0].reference).toBe('Payment reference')
        expect(data.standingOrders[0].payeeUid).toBe('e231c503-72cd-4fbf-a643-be61c3c5ba12')
        expect(data.standingOrders[0].payeeAccountUid).toBe('a2c6e45b-6f24-48be-ba52-58bff94bef59')
        expect(data.standingOrders[0].standingOrderRecurrence.startDate).toBe('2017-09-23')
        expect(data.standingOrders[0].standingOrderRecurrence.frequency).toBe('WEEKLY')
        expect(data.standingOrders[0].standingOrderRecurrence.interval).toBe(4)
        expect(data.standingOrders[0].standingOrderRecurrence.count).toBe(12)
        expect(data.standingOrders[0].standingOrderRecurrence.untilDate).toBe('2018-09-23')
        expect(data.standingOrders[0].nextDate).toBe('2018-09-23')
        expect(data.standingOrders[0].cancelledAt).toBe('2017-09-04T16:19:38.867Z')

        log(JSON.stringify(data))

        done()
      })
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get(`/api/v2/payments/local/account/${accountUid}/category/${categoryUid}/standing-orders/${paymentOrderUid}`)
    .reply(200, getStandingOrderResponse)

  test('should be able to get a standing order', done => {
    starlingCli
      .payment
      .getStandingOrder({ accessToken, accountUid, categoryUid, paymentOrderUid })
      .then(function ({ data }) {
        expect(data.paymentOrderUid).toBe(paymentOrderUid)
        expect(data.amount.currency).toBe('GBP')
        expect(data.amount.minorUnits).toBe(11223344)
        expect(data.reference).toBe('Payment reference')
        expect(data.payeeUid).toBe('e231c503-72cd-4fbf-a643-be61c3c5ba12')
        expect(data.payeeAccountUid).toBe('a2c6e45b-6f24-48be-ba52-58bff94bef59')
        expect(data.standingOrderRecurrence.startDate).toBe('2017-09-23')
        expect(data.standingOrderRecurrence.frequency).toBe('WEEKLY')
        expect(data.standingOrderRecurrence.interval).toBe(4)
        expect(data.standingOrderRecurrence.count).toBe(12)
        expect(data.standingOrderRecurrence.untilDate).toBe('2018-09-23')
        expect(data.nextDate).toBe('2018-09-23')
        expect(data.cancelledAt).toBe('2017-09-04T16:19:38.867Z')

        log(JSON.stringify(data))

        done()
      })
  })
})
