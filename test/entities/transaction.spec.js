import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import getTransactionsResponse from '../responses/v1-get-transactions.json'
import getTransactionResponse from '../responses/v1-get-transaction.json'
import getTransactionFpsInResponse from '../responses/v1-get-transaction-fps-in.json'
import getTransactionFpsOutResponse from '../responses/v1-get-transaction-fps-out.json'
import getTransactionCardResponse from '../responses/v1-get-transaction-card.json'

const log = debug('starling:transaction-test')

describe('GET Transaction(s)', () => {
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  test('should retrieve the customer\'s transaction history', done => {
    nock('http://localhost', expectAuthorizationHeader(accessToken))
      .get('/api/v1/transactions')
      .query({ from: '2017-03-01', to: '2017-03-06' })
      .reply(200, getTransactionsResponse)

    starlingCli
      .getTransactions(accessToken, '2017-03-01', '2017-03-06', '')
      .then(function ({ data }) {
        const tx = data._embedded.transactions[1]
        expect(tx._links.detail.href).toBe('api/v1/transactions/mastercard/e336f58d-65ee-4248-84eb-ec4c88668f9e')
        expect(tx.id).toBe('e336f58d-65ee-4248-84eb-ec4c88668f9e')
        expect(tx.currency).toBe('GBP')
        expect(tx.amount).toBe(-23.75)
        expect(tx.direction).toBe('OUTBOUND')
        expect(tx.created).toBe('2017-03-06T12:39:54.712Z')
        expect(tx.reference).toBe('AMAZON EU')
        expect(tx.source).toBe('MASTER_CARD')
        expect(tx.balance).toBe(918.4)
        log(JSON.stringify(data))
        done()
      })
  })

  test(
    'should retrieve a specific customer transaction w/o specifying source in path',
    done => {
      const transactionId = '32b4d093-f3b3-45da-9f89-d6a1395ab397'
      const noSource = ''

      nock('http://localhost', expectAuthorizationHeader(accessToken))
        .get(`/api/v1/transactions/${transactionId}`)
        .reply(200, getTransactionResponse)

      starlingCli.getTransaction(accessToken, transactionId, noSource)
        .then(function ({ data }) {
          expect(data.id).toBe('32b4d093-f3b3-45da-9f89-d6a1395ab397')
          expect(data.currency).toBe('GBP')
          expect(data.amount).toBe(-10)
          expect(data.direction).toBe('OUTBOUND')
          expect(data.created).toBe('2017-03-06T12:45:23.036Z')
          expect(data.reference).toBe('Dinner')
          expect(data.source).toBe('FASTER_PAYMENTS_OUT')
          log(JSON.stringify(data))
          done()
        })
    }
  )

  test(
    'should retrieve a specific customer incoming fps transaction',
    done => {
      const transactionId = '3d532dfb-9b2f-4e6b-b004-e94fc86c30fe'
      const source = 'FASTER_PAYMENTS_IN'

      nock('http://localhost', expectAuthorizationHeader(accessToken))
        .get(`/api/v1/transactions/fps/in/${transactionId}`)
        .reply(200, getTransactionFpsInResponse)

      starlingCli.getTransaction(accessToken, transactionId, source)
        .then(function ({ data }) {
          expect(data.id).toBe('3d532dfb-9b2f-4e6b-b004-e94fc86c30fe')
          expect(data.currency).toBe('GBP')
          expect(data.amount).toBe(954.23)
          expect(data.direction).toBe('INBOUND')
          expect(data.created).toBe('2017-03-06T12:39:52.68Z')
          expect(data.reference).toBe('Rent')
          expect(data.source).toBe('FASTER_PAYMENTS_IN')
          log(JSON.stringify(data))
          done()
        })
    }
  )

  test(
    'should retrieve a specific customer outbound fps transaction',
    done => {
      const transactionId = 'b5c65fd2-1795-4262-93f0-f0490759bf1f'
      const source = 'FASTER_PAYMENTS_OUT'

      nock('http://localhost', expectAuthorizationHeader(accessToken))
        .get(`/api/v1/transactions/fps/out/${transactionId}`)
        .reply(200, getTransactionFpsOutResponse)

      starlingCli.getTransaction(accessToken, transactionId, source)
        .then(function ({ data }) {
          expect(data.id).toBe('b5c65fd2-1795-4262-93f0-f0490759bf1f')
          expect(data.currency).toBe('GBP')
          expect(data.amount).toBe(-36.01)
          expect(data.created).toBe('2017-03-02T12:39:54.936Z')
          expect(data.reference).toBe('Dinner')
          expect(data.source).toBe('FASTER_PAYMENTS_OUT')
          expect(data.receivingContactId).toBe('3bba29d4-35e5-4eb3-8aef-060ef526dcda')
          expect(data.receivingContactAccountId).toBe('3bba29d4-35e5-4eb3-8aef-060ef526dcda')
          expect(data.receivingContactAccount.href).toBe('api/v1/contacts/3bba29d4-35e5-4eb3-8aef-060ef526dcda/accounts/3bba29d4-35e5-4eb3-8aef-060ef526dcda')

          log(JSON.stringify(data))

          done()
        })
    }
  )

  test('should retrieve a specific customer card transaction', done => {
    const transactionId = '77b7d507-6546-4301-a841-fbf570de65c6'
    const source = 'MASTER_CARD'

    nock('http://localhost', expectAuthorizationHeader(accessToken))
      .get(`/api/v1/transactions/mastercard/${transactionId}`)
      .reply(200, getTransactionCardResponse)

    starlingCli.getTransaction(accessToken, transactionId, source)
      .then(function ({ data }) {
        expect(data.id).toBe('77b7d507-6546-4301-a841-fbf570de65c6')
        expect(data.currency).toBe('GBP')
        expect(data.amount).toBe(-15.15)
        expect(data.direction).toBe('OUTBOUND')
        expect(data.created).toBe('2017-01-06T12:39:54.246Z')
        expect(data.reference).toBe('PRET')
        expect(data.source).toBe('MASTER_CARD')
        expect(data.mastercardTransactionMethod).toBe('CHIP_AND_PIN')
        expect(data.status).toBe('SETTLED')
        expect(data.sourceAmount).toBe(-17.11)
        expect(data.sourceCurrency).toBe('EUR')
        log(JSON.stringify(data))
        done()
      })
  })
})
