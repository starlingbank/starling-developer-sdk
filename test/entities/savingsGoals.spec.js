import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'
import Starling from '../../src/starling'
import getSavingsGoalsResponse from '../responses/v2-get-savings-goals.json'
import getSavingsGoalResponse from '../responses/v2-get-savings-goal.json'
import putSavingsGoalResponse from '../responses/v2-put-savings-goal.json'
import putSavingsGoalTransferResponse from '../responses/v2-put-savings-goal-transfer.json'

const log = debug('starling:savings-goals-test')

describe('Savings Goals', () => {
  const accessToken = '0123456789'
  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })
  const accountUid = 'b0b20c9d-3b6b-42f1-a7d0-e70d4538e0d9'
  const savingsGoalUid = '5031325f-49b2-4c8c-b9cb-3f5cfa7f6d6e'
  const transferUid = '88998899-8899-8899-8899-889988998899'

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get(`/api/v2/account/${accountUid}/savings-goals`)
    .reply(200, getSavingsGoalsResponse)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get(`/api/v2/account/${accountUid}/savings-goals/${savingsGoalUid}`)
    .reply(200, getSavingsGoalResponse)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .put(`/api/v2/account/${accountUid}/savings-goals`,
      obj => obj.name && obj.currency)
    .reply(200, putSavingsGoalResponse)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .put(`/api/v2/account/${accountUid}/savings-goals/${savingsGoalUid}`,
      obj => obj.name && obj.currency)
    .reply(200, putSavingsGoalResponse)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .delete(`/api/v2/account/${accountUid}/savings-goals/${savingsGoalUid}`)
    .reply(200)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .put(`/api/v2/account/${accountUid}/savings-goals/${savingsGoalUid}/add-money/${transferUid}`,
      obj => obj.amount && obj.amount.currency && obj.amount.minorUnits)
    .reply(200, putSavingsGoalTransferResponse)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .put(`/api/v2/account/${accountUid}/savings-goals/${savingsGoalUid}/withdraw-money/${transferUid}`,
      obj => obj.amount && obj.amount.currency && obj.amount.minorUnits)
    .reply(200, putSavingsGoalTransferResponse)

  test('should retrieve the account\'s savings goals', done => {
    starlingCli
      .getSavingsGoals(accessToken, accountUid)
      .then(({ data }) => {
        expect(data.savingsGoalList).toHaveLength(2)

        const parisTrip = data.savingsGoalList[0]
        expect(parisTrip.savingsGoalUid).toBe(savingsGoalUid)
        expect(parisTrip.name).toBe('Trip to Paris')
        expect(parisTrip.target.currency).toBe('GBP')
        expect(parisTrip.target.minorUnits).toBe(11223344)
        expect(parisTrip.totalSaved.currency).toBe('GBP')
        expect(parisTrip.totalSaved.minorUnits).toBe(11223344)
        expect(parisTrip.savedPercentage).toBe(100)

        const bikeMaintenance = data.savingsGoalList[1]
        expect(bikeMaintenance.savingsGoalUid).toBe('15b0a4c9-5976-4e3b-875d-390c58abba36')
        expect(bikeMaintenance.name).toBe('Bike maintenance')
        expect(bikeMaintenance.totalSaved.currency).toBe('GBP')
        expect(bikeMaintenance.totalSaved.minorUnits).toBe(6798)

        log(JSON.stringify(data))

        done()
      })
  })

  test('should retrieve an individual savings goal', done => {
    starlingCli
      .getSavingsGoal(accessToken, accountUid, savingsGoalUid)
      .then(({ data }) => {
        expect(data.savingsGoalUid).toBe(savingsGoalUid)
        expect(data.name).toBe('Trip to Paris')
        expect(data.target.currency).toBe('GBP')
        expect(data.target.minorUnits).toBe(11223344)
        expect(data.totalSaved.currency).toBe('GBP')
        expect(data.totalSaved.minorUnits).toBe(11223344)
        expect(data.savedPercentage).toBe(100)

        log(JSON.stringify(data))

        done()
      })
  })

  test('should create a savings goal', done => {
    starlingCli
      .createSavingsGoal(accessToken, accountUid, 'Savings goal name', 'GBP')
      .then(({ data }) => {
        expect(data.savingsGoalUid).toBe(savingsGoalUid)
        expect(data.success).toBe(true)
        expect(data.errors).toHaveLength(0)

        log(JSON.stringify(data))

        done()
      })
  })

  test('should delete a savings goal', done => {
    starlingCli
      .deleteSavingsGoal(accessToken, accountUid, savingsGoalUid)
      .then(({ data, status }) => {
        expect(status).toBe(200)
        done()
      })
  })

  test('should add money to a savings goal', done => {
    starlingCli
      .addMoneyToSavingsGoal(accessToken, accountUid, savingsGoalUid, transferUid, 1000, 'GBP')
      .then(({ data }) => {
        expect(data.transferUid).toBe(transferUid)
        expect(data.success).toBe(true)
        expect(data.errors).toHaveLength(0)

        log(JSON.stringify(data))

        done()
      })
  })

  test('should withdraw money from a savings goal', done => {
    starlingCli
      .withdrawMoneyFromSavingsGoal(accessToken, accountUid, savingsGoalUid, transferUid, 1000, 'GBP')
      .then(({ data }) => {
        expect(data.transferUid).toBe(transferUid)
        expect(data.success).toBe(true)
        expect(data.errors).toHaveLength(0)

        log(JSON.stringify(data))

        done()
      })
  })
})
