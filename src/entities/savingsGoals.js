import axios from 'axios'
import debug from 'debug'
import { defaultHeaders, payloadHeaders } from '../utils/http'
import { typeValidation } from '../utils/validator'

const log = debug('starling:saving-goals-service')

/**
 * Service to interact with a customer's savings goals
 */
class SavingsGoals {
  /**
   * Create a new savings goal service
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Get all savings goals
   * @param {string} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @return {Promise} - the http request promise
   */
  getSavingsGoals (accessToken, accountUid) {
    typeValidation(arguments, getSavingsGoalsParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/account/${accountUid}/savings-goals`
    log(`GET ${url}`)
    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get a savings goal
   * @param {string} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @param {string} savingsGoalUid - the savings goal's uid
   * @return {Promise} - the http request promise
   */
  getSavingsGoal (accessToken, accountUid, savingsGoalUid) {
    typeValidation(arguments, getSavingsGoalParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/account/${accountUid}/savings-goals/${savingsGoalUid}`
    log(`GET ${url}`)
    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Create a savings goal
   * @param {string} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid of the account to create the savings goal in
   * @param {string} name - the name of the new savings goal
   * @param {string} currency - ISO-4217 3 character currency code
   * @param {number} targetAmount - the target amount in minor units (e.g. 1234 => £12.34)
   * @param {string} targetCurrency - ISO-4217 3 character currency code
   * @param {string=} base64EncodedPhoto - base64 encoded image to associate with the goal
   * @return {Promise} - the http request promise
   */
  createSavingsGoal (accessToken, accountUid, name, currency, targetAmount, targetCurrency, base64EncodedPhoto) {
    typeValidation(arguments, createSavingsGoalParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/account/${accountUid}/savings-goals`
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
   * @param {string} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @param {string} savingsGoalUid - the savings goal's uid
   * @return {Promise} - the http request promise
   */
  deleteSavingsGoal (accessToken, accountUid, savingsGoalUid) {
    typeValidation(arguments, deleteSavingsGoalParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/account/${accountUid}/savings-goals/${savingsGoalUid}`
    log(`DELETE ${url}`)
    return axios({
      method: 'DELETE',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Add money to a savings goal
   * @param {string} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @param {string} savingsGoalUid - the savings goal's uid
   * @param {string} transferUid - a transaction ID for this transaction
   * @param {number} amount - amount in the minor units of the given currency; eg pence in GBP, cents in EUR
   * @param {string} currency - ISO-4217 3 character currency code
   * @return {Promise} - the http request promise
   */
  addMoneyToSavingsGoal (accessToken, accountUid, savingsGoalUid, transferUid, amount, currency) {
    typeValidation(arguments, addMoneyToSavingsGoalParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/account/${accountUid}/savings-goals/${savingsGoalUid}/add-money/${transferUid}`
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
   * @param {string} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @param {string} savingsGoalUid - the savings goal's uid
   * @param {string} transferUid - a transaction ID for this transaction
   * @param {number} amount - amount in the minor units of the given currency; eg pence in GBP, cents in EUR
   * @param {string} currency - ISO-4217 3 character currency code
   * @return {Promise} - the http request promise
   */
  withdrawMoneyFromSavingsGoal (accessToken, accountUid, savingsGoalUid, transferUid, amount, currency) {
    typeValidation(arguments, withdrawMoneyFromSavingsGoalParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/account/${accountUid}/savings-goals/${savingsGoalUid}/withdraw-money/${transferUid}`
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

const getSavingsGoalsParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'accountUid', validations: ['required', 'string'] }
]

const getSavingsGoalParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'accountUid', validations: ['required', 'string'] },
  { name: 'savingsGoalUid', validations: ['required', 'string'] }
]

const deleteSavingsGoalParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'accountUid', validations: ['required', 'string'] },
  { name: 'savingsGoalUid', validations: ['required', 'string'] }
]

const createSavingsGoalParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'accountUid', validations: ['required', 'string'] },
  { name: 'name', validations: ['required', 'string'] },
  { name: 'currency', validations: ['required', 'string'] },
  { name: 'targetAmount', validations: ['required', 'number'] },
  { name: 'targetCurrency', validations: ['required', 'string'] },
  { name: 'base64EncodedPhoto', validations: ['optional', 'string'] }
]

const addMoneyToSavingsGoalParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'accountUid', validations: ['required', 'string'] },
  { name: 'savingsGoalUid', validations: ['required', 'string'] },
  { name: 'transactionUid', validations: ['required', 'string'] },
  { name: 'amount', validations: ['required', 'number'] },
  { name: 'currency', validations: ['required', 'string'] }
]

const withdrawMoneyFromSavingsGoalParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'accountUid', validations: ['required', 'string'] },
  { name: 'savingsGoalUid', validations: ['required', 'string'] },
  { name: 'transactionUid', validations: ['required', 'string'] },
  { name: 'amount', validations: ['required', 'number'] },
  { name: 'currency', validations: ['required', 'string'] }
]

module.exports = SavingsGoals
