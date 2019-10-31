import axios from 'axios'
import debug from 'debug'
import { defaultHeaders } from '../utils/http'
import { typeValidation } from '../utils/validator'

const log = debug('starling:account-service')

/**
 * Service to interact with a customer's account
 */
class Account {
  /**
   * Creates an instance of the account client
   * @param {Object} options - application config
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Get an account holder's bank accounts
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccounts (accessToken) {
    typeValidation(arguments, getAccountParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/accounts`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get an account's bank identifiers
   * @param {string} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @return {Promise} - the http request promise
   */
  getAccountIdentifiers (accessToken, accountUid) {
    typeValidation(arguments, getAccountIdentifiersParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/accounts/${accountUid}/identifiers`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get an account's balance
   * @param {string} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @return {Promise} - the http request promise
   */
  getAccountBalance (accessToken, accountUid) {
    typeValidation(arguments, getAccountBalanceParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/accounts/${accountUid}/balance`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get whether there are available funds for a requested amount
   * @param {string} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @param {number} targetAmountInMinorUnits - the target amount in minor units
   * @return {Promise} - the http request promise
   */
  getConfirmationOfFunds (accessToken, accountUid, targetAmountInMinorUnits) {
    typeValidation(arguments, getConfirmationOfFundsParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/accounts/${accountUid}/confirmation-of-funds`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken),
      params: {
        targetAmountInMinorUnits
      }
    })
  }
}

const getAccountParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] }
]

const getAccountBalanceParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'accountUid', validations: ['required', 'string'] }
]

const getAccountIdentifiersParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'accountUid', validations: ['required', 'string'] }
]

const getConfirmationOfFundsParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'accountUid', validations: ['required', 'string'] },
  { name: 'targetAmount', validations: ['required', 'number'] }
]

module.exports = Account
