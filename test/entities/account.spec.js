import nock from 'nock'
import debug from 'debug'
import path from 'path'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import getAccountsResponse from '../responses/v2-get-accounts.json'
import getAccountBalanceResponse from '../responses/v2-get-account-balance.json'
import getConfirmationOfFundsResponse from '../responses/v2-get-account-confirmation-of-funds.json'
import getAccountIdentifiersResponse from '../responses/v2-get-account-identifiers.json'
import getStatementPeriodsResponse from '../responses/v2-get-statement-periods.json'

const log = debug('starling:account-test')

const dateRegex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/

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

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get(`/api/v2/accounts/${accountUid}/statement/available-periods`)
    .reply(200, getStatementPeriodsResponse)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .persist(true)
    .get(`/api/v2/accounts/${accountUid}/statement/download`)
    .query(params => params.yearMonth && /^((?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])$/.test(params.yearMonth))
    .matchHeader('Accept', 'text/csv')
    .replyWithFile(200, path.join(__dirname, '../responses/v2-get-statement.csv'), { 'Content-Type': 'text/csv' })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .persist(true)
    .get(`/api/v2/accounts/${accountUid}/statement/downloadForDateRange`)
    .query(params => params.start && dateRegex.test(params.start) && (!params.end || dateRegex.test(params.end)))
    .matchHeader('Accept', 'text/csv')
    .replyWithFile(200, path.join(__dirname, '../responses/v2-get-statement.csv'), { 'Content-Type': 'text/csv' })

  test('should retrieve accounts', done => {
    starlingCli
      .account
      .getAccounts({ accessToken })
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
      .account
      .getAccountIdentifiers({ accessToken, accountUid })
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
      .account
      .getAccountBalance({ accessToken, accountUid })
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
      .account
      .getConfirmationOfFunds({ accessToken, accountUid, targetAmountInMinorUnits: 1000 })
      .then(function ({ data }) {
        expect(data.requestedAmountAvailableToSpend).toBe(true)
        expect(data.accountWouldBeInOverdraftIfRequestedAmountSpent).toBe(true)

        log(JSON.stringify(data))

        done()
      })
  })

  test('should get available statement periods', done => {
    starlingCli
      .account
      .getStatementPeriods({ accessToken, accountUid })
      .then(function ({ data }) {
        expect(data.periods).toHaveLength(2)
        expect(data.periods[0].period).toBe('2019-09')
        expect(data.periods[0].partial).toBe(false)
        expect(data.periods[1].period).toBe('2019-10')
        expect(data.periods[1].partial).toBe(true)
        expect(data.periods[1].endsAt).toBe('2019-10-11T12:34:56.789Z')

        log(JSON.stringify(data))

        done()
      })
  })

  test('should download CSV statement for period', done => {
    starlingCli
      .account
      .getStatementForPeriod({ accessToken, accountUid, yearMonth: '2019-10', format: 'text/csv', responseType: 'text' })
      .then(function ({ data }) {
        const lines = data.split('\n')

        expect(lines).toHaveLength(4)
        expect(lines[0]).toBe('Date,Counter Party,Reference,Type,Amount (GBP),Balance (GBP),Spending Category')
        expect(lines[1]).toBe('01/10/2019,An Employer,SALARY,FASTER PAYMENT,1500.00,5500.00,INCOME')
        expect(lines[2]).toBe('02/10/2019,Landlord,Rent,FASTER PAYMENT,-1000.00,4500.00,PAYMENTS')
        expect(lines[3]).toBe('')

        log(data)
        done()
      })
  })

  test('should download CSV statement for period with optional parameters removed', done => {
    starlingCli
      .account
      .getStatementForPeriod({ accessToken, accountUid, responseType: 'text' })
      .then(function ({ data }) {
        const lines = data.split('\n')

        expect(lines).toHaveLength(4)
        expect(lines[0]).toBe('Date,Counter Party,Reference,Type,Amount (GBP),Balance (GBP),Spending Category')
        expect(lines[1]).toBe('01/10/2019,An Employer,SALARY,FASTER PAYMENT,1500.00,5500.00,INCOME')
        expect(lines[2]).toBe('02/10/2019,Landlord,Rent,FASTER PAYMENT,-1000.00,4500.00,PAYMENTS')
        expect(lines[3]).toBe('')

        log(data)
        done()
      })
  })

  test('should download CSV statement for range', done => {
    starlingCli
      .account
      .getStatementForRange({ accessToken, accountUid, start: '2019-10-01', end: '2019-10-02', format: 'text/csv', responseType: 'text' })
      .then(function ({ data }) {
        const lines = data.split('\n')

        expect(lines).toHaveLength(4)
        expect(lines[0]).toBe('Date,Counter Party,Reference,Type,Amount (GBP),Balance (GBP),Spending Category')
        expect(lines[1]).toBe('01/10/2019,An Employer,SALARY,FASTER PAYMENT,1500.00,5500.00,INCOME')
        expect(lines[2]).toBe('02/10/2019,Landlord,Rent,FASTER PAYMENT,-1000.00,4500.00,PAYMENTS')
        expect(lines[3]).toBe('')

        log(data)
        done()
      })
  })

  test('should download CSV statement for range with optional parameters removed', done => {
    starlingCli
      .account
      .getStatementForRange({ accessToken, accountUid, start: '2019-10-01', responseType: 'text' })
      .then(function ({ data }) {
        const lines = data.split('\n')

        expect(lines).toHaveLength(4)
        expect(lines[0]).toBe('Date,Counter Party,Reference,Type,Amount (GBP),Balance (GBP),Spending Category')
        expect(lines[1]).toBe('01/10/2019,An Employer,SALARY,FASTER PAYMENT,1500.00,5500.00,INCOME')
        expect(lines[2]).toBe('02/10/2019,Landlord,Rent,FASTER PAYMENT,-1000.00,4500.00,PAYMENTS')
        expect(lines[3]).toBe('')

        log(data)
        done()
      })
  })
})
