import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'
import Starling from '../../src/starling'
import getSavingsGoalResponse from '../responses/v1-get-savings-goal.json'
import listSavingsGoalsResponse from '../responses/v1-list-savings-goals.json'

const log = debug('starling:savings-goals-test')

describe('Savings Goals - ', () => {
  const accessToken = '0123456789'
  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  const savingsGoalId = '12345-12345'

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get(`/api/v1/savings-goals/${savingsGoalId}`)
    .reply(200, getSavingsGoalResponse)

  test('should retrieve specified savings goal', done => {
    starlingCli
      .getSavingsGoal(accessToken, savingsGoalId)
      .then(function ({ data }) {
        expect(data.name).toBe('Trip to Paris')
        expect(data.target.minorUnits).toBe(123400)
        expect(data.target.currency).toBe('GBP')
        expect(data.totalSaved.minorUnits).toBe(12340)
        expect(data.totalSaved.currency).toBe('GBP')
        expect(data.savedPercentage).toBe(10)

        log(JSON.stringify(data))

        done()
      })
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v1/savings-goals')
    .reply(200, listSavingsGoalsResponse)

  test('should list all savings goals', done => {
    starlingCli
      .listSavingsGoals(accessToken)
      .then(function ({ data }) {
        const paris = data.savingsGoalList[0]
        expect(paris.name).toBe('Trip to Paris')
        expect(paris.target.minorUnits).toBe(123400)
        expect(paris.target.currency).toBe('GBP')
        expect(paris.totalSaved.minorUnits).toBe(12340)
        expect(paris.totalSaved.currency).toBe('GBP')
        expect(paris.savedPercentage).toBe(10)

        const toy = data.savingsGoalList[1]
        expect(toy.name).toBe('Toy')
        expect(toy.target.minorUnits).toBe(35000)
        expect(toy.target.currency).toBe('GBP')
        expect(toy.totalSaved.minorUnits).toBe(10000)
        expect(toy.totalSaved.currency).toBe('GBP')
        expect(toy.savedPercentage).toBe(29)

        log(JSON.stringify(data))

        done()
      })
  })

  const name = 'Trip to Paris'
  const currency = 'GBP'
  const targetAmount = 123400
  const targetCurrency = 'GBP'
  const base64EncodedPhoto = 'base64wqertyuihgfdzxfcgcvhg=='

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .put(`/api/v1/savings-goals/${savingsGoalId}`)
    .reply(202)

  test('should create a new savings goal', done => {
    starlingCli
      .createSavingsGoal(accessToken, savingsGoalId, name, currency, targetAmount, targetCurrency, base64EncodedPhoto)
      .then(function ({ status }) {
        expect(status).toBe(202)
        done()
      })
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .delete(`/api/v1/savings-goals/${savingsGoalId}`)
    .reply(204)

  test('should delete the specified savings goal', done => {
    starlingCli
      .deleteSavingsGoal(accessToken, savingsGoalId)
      .then(function ({ status }) {
        expect(status).toBe(204)
        done()
      })
  })

  const transactionId = '54321-54321'
  const minorAmount = 111
  const savingsCurrency = 'BRL'

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .put(
      `/api/v1/savings-goals/${savingsGoalId}/add-money/${transactionId}`,
      {
        amount: {
          currency: savingsCurrency,
          minorUnits: minorAmount
        }
      }
    )
    .reply(202)

  test('should add money to a specific goal', done => {
    starlingCli
      .addMoneyToSavingsGoal(accessToken, savingsGoalId, transactionId, minorAmount, savingsCurrency)
      .then(function ({ status }) {
        expect(status).toBe(202)
        done()
      })
  })
})
