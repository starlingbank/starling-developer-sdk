import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import getAccountsResponse from '../responses/v2-get-accounts.json'
import getAccountBalanceResponse from '../responses/v2-get-account-balance.json'
import getConfirmationOfFundsResponse from '../responses/v2-get-account-confirmation-of-funds.json'
import getAccountIdentifiersResponse from '../responses/v2-get-account-identifiers.json'

const log = debug('starling:account-test')

describe('Account', () => {
  const accessToken = '0123456789'
  const accountUid = 'b0b20c9d-3b6b-42f1-a7d0-e70d4538e0d9'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v2/accounts')
    .reply(200, getAccountsResponse)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get(`/api/v2/accounts/${accountUid}/identifiers`)
    .reply(200, getAccountIdentifiersResponse)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get(`/api/v2/accounts/${accountUid}/balance`)
    .reply(200, getAccountBalanceResponse)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get(`/api/v2/accounts/${accountUid}/confirmation-of-funds`)
    .query(params => params.targetAmountInMinorUnits && /^[0-9]+$/.test(params.targetAmountInMinorUnits))
    .reply(200, getConfirmationOfFundsResponse)

  test('should retrieve accounts', done => {
    starlingCli
      .getAccounts(accessToken)
      .then(function ({ data }) {
        expect(data.accounts).toHaveLength(1)
        expect(data.accounts[0].accountUid).toBe('b0b20c9d-3b6b-42f1-a7d0-e70d4538e0d9')
        expect(data.accounts[0].defaultCategory).toBe('cc2d03f9-9438-4c7b-a426-ba3199740d73')
        expect(data.accounts[0].currency).toBe('GBP')
        expect(data.accounts[0].createdAt).toBe('2017-05-08T12:34:21.000Z')

        log(JSON.stringify(data))

        done()
      })
  })

  test('should retrieve the account identifiers', done => {
    starlingCli
      .getAccountIdentifiers(accessToken, accountUid)
      .then(function ({ data }) {
        expect(data.accountIdentifier).toBe('01234567')
        expect(data.bankIdentifier).toBe('608371')
        expect(data.iban).toBe('GB63SRLG60837101234567')
        expect(data.bic).toBe('SRLGGB2L')

        log(JSON.stringify(data))

        done()
      })
  })

  test('should retrieve the account balance', done => {
    starlingCli
      .getAccountBalance(accessToken, accountUid)
      .then(function ({ data }) {
        expect(data.clearedBalance.currency).toBe('GBP')
        expect(data.effectiveBalance.currency).toBe('GBP')
        expect(data.pendingTransactions.currency).toBe('GBP')
        expect(data.acceptedOverdraft.currency).toBe('GBP')
        expect(data.amount.currency).toBe('GBP')

        expect(data.clearedBalance.minorUnits).toBe(1111)
        expect(data.effectiveBalance.minorUnits).toBe(2222)
        expect(data.pendingTransactions.minorUnits).toBe(3333)
        expect(data.acceptedOverdraft.minorUnits).toBe(4444)
        expect(data.amount.minorUnits).toBe(5555)

        log(JSON.stringify(data))

        done()
      })
  })

  test('should get a confirmation of funds response', done => {
    starlingCli
      .getConfirmationOfFunds(accessToken, accountUid, 1000)
      .then(function ({ data }) {
        expect(data.requestedAmountAvailableToSpend).toBe(true)
        expect(data.accountWouldBeInOverdraftIfRequestedAmountSpent).toBe(true)

        log(JSON.stringify(data))

        done()
      })
  })
})
