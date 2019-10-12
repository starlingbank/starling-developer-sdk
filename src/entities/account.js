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
   * Retrieves a customer's accounts
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
   * Retrieves an account's balance
   * @param {string} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @return {Promise} - the http request promise
   */
  getBalance (accessToken, accountUid) {
    typeValidation(arguments, getBalanceParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/accounts/${accountUid}/balance`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }
}

const getAccountParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] }
]

const getBalanceParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'accountUid', validations: ['required', 'string'] }
]

module.exports = Account
