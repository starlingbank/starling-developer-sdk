import axios from 'axios'
import debug from 'debug'
import { defaultHeaders, payloadHeaders } from '../utils/http'
import { struct, minAPIParameterDefintion } from '../utils/validator'

const log = debug('starling:savings-goal-service')

/**
 * Service to interact with a customer's savings goals
 */
class SavingsGoal {
  /**
   * Create a new savings goal service
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Get all savings goals
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.accountUid - the account uid
   * @return {Promise} - the http request promise
   */
  getSavingsGoals (parameters) {
    parameters = Object.assign({}, this.options, parameters)
    getSavingsGoalsParameterValidator(parameters)
    const { apiUrl, accessToken, accountUid } = parameters

    const url = `${apiUrl}/api/v2/account/${accountUid}/savings-goals`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get a savings goal
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.accountUid - the account uid
   * @param {string} parameters.savingsGoalUid - the savings goal's uid
   * @return {Promise} - the http request promise
   */
  getSavingsGoal (parameters) {
    parameters = Object.assign({}, this.options, parameters)
    getSavingsGoalParameterValidator(parameters)
    const { apiUrl, accessToken, accountUid, savingsGoalUid } = parameters

    const url = `${apiUrl}/api/v2/account/${accountUid}/savings-goals/${savingsGoalUid}`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Create a savings goal
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.accountUid - the account uid of the account to create the savings goal in
   * @param {string} parameters.name - the name of the new savings goal
   * @param {string=} parameters.currency - ISO-4217 3 character currency code
   * @param {number=} parameters.targetAmount - the target amount in minor units (e.g. 1234 => £12.34)
   * @param {string=} parameters.targetCurrency - ISO-4217 3 character currency code
   * @param {string=} parameters.base64EncodedPhoto - base64 encoded image to associate with the goal
   * @return {Promise} - the http request promise
   */
  createSavingsGoal (parameters) {
    parameters = Object.assign({}, { currency: 'GBP', targetAmount: 0, targetCurrency: 'GBP' }, this.options, parameters)
    createSavingsGoalParameterValidator(parameters)
    const { apiUrl, accessToken, accountUid, name, currency, targetAmount, targetCurrency, base64EncodedPhoto } = parameters

    const url = `${apiUrl}/api/v2/account/${accountUid}/savings-goals`
    log(`PUT ${url}`)

    return axios({
      method: 'PUT',
      url,
      headers: payloadHeaders(accessToken),
      data: JSON.stringify({
        name,
        currency,
        target: {
          minorUnits: targetAmount,
          currency: targetCurrency
        },
        base64EncodedPhoto
      })
    })
  }

  /**
   * Delete a savings goal
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.accountUid - the account uid
   * @param {string} parameters.savingsGoalUid - the savings goal's uid
   * @return {Promise} - the http request promise
   */
  deleteSavingsGoal (parameters) {
    parameters = Object.assign({}, this.options, parameters)
    deleteSavingsGoalParameterValidator(parameters)
    const { apiUrl, accessToken, accountUid, savingsGoalUid } = parameters

    const url = `${apiUrl}/api/v2/account/${accountUid}/savings-goals/${savingsGoalUid}`
    log(`DELETE ${url}`)

    return axios({
      method: 'DELETE',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Add money to a savings goal
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.accountUid - the account uid
   * @param {string} parameters.savingsGoalUid - the savings goal's uid
   * @param {string} parameters.transferUid - a transaction ID for this transaction
   * @param {number} parameters.amount - amount in the minor units of the given currency; eg pence in GBP, cents in EUR
   * @param {string} parameters.currency - ISO-4217 3 character currency code
   * @return {Promise} - the http request promise
   */
  addMoneyToSavingsGoal (parameters) {
    parameters = Object.assign({}, this.options, parameters)
    addMoneyToSavingsGoalParameterValidator(parameters)
    const { apiUrl, accessToken, accountUid, savingsGoalUid, transferUid, amount, currency } = parameters

    const url = `${apiUrl}/api/v2/account/${accountUid}/savings-goals/${savingsGoalUid}/add-money/${transferUid}`
    log(`PUT ${url}`)

    return axios({
      method: 'PUT',
      url,
      headers: payloadHeaders(accessToken),
      data: JSON.stringify({
        amount: {
          currency,
          minorUnits: amount
        }
      })
    })
  }

  /**
   * Withdraw money from a savings goal
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.accountUid - the account uid
   * @param {string} parameters.savingsGoalUid - the savings goal's uid
   * @param {string} parameters.transferUid - a transaction ID for this transaction
   * @param {number} parameters.amount - amount in the minor units of the given currency; eg pence in GBP, cents in EUR
   * @param {string} parameters.currency - ISO-4217 3 character currency code
   * @return {Promise} - the http request promise
   */
  withdrawMoneyFromSavingsGoal (parameters) {
    parameters = Object.assign({}, this.options, parameters)
    withdrawMoneyFromSavingsGoalParameterValidator(parameters)
    const { apiUrl, accessToken, accountUid, savingsGoalUid, transferUid, amount, currency } = parameters

    const url = `${apiUrl}/api/v2/account/${accountUid}/savings-goals/${savingsGoalUid}/withdraw-money/${transferUid}`
    log(`PUT ${url}`)

    return axios({
      method: 'PUT',
      url,
      headers: payloadHeaders(accessToken),
      data: JSON.stringify({
        amount: {
          currency,
          minorUnits: amount
        }
      })
    })
  }
}

const getSavingsGoalsParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  accountUid: 'uuid'
})

const getSavingsGoalParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  accountUid: 'uuid',
  savingsGoalUid: 'uuid'
})

const deleteSavingsGoalParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  accountUid: 'uuid',
  savingsGoalUid: 'uuid'
})

const createSavingsGoalParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  accountUid: 'uuid',
  name: 'string',
  currency: 'string',
  targetAmount: 'number',
  targetCurrency: 'string',
  base64EncodedPhoto: 'string?'
})

const addMoneyToSavingsGoalParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  accountUid: 'uuid',
  savingsGoalUid: 'uuid',
  transferUid: 'uuid',
  amount: 'number',
  currency: 'string'
})

const withdrawMoneyFromSavingsGoalParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  accountUid: 'uuid',
  savingsGoalUid: 'uuid',
  transferUid: 'uuid',
  amount: 'number',
  currency: 'string'
})

module.exports = SavingsGoal
