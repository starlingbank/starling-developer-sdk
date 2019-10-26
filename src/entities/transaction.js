import axios from 'axios'
import debug from 'debug'
import { defaultHeaders } from '../utils/http'
import { typeValidation } from '../utils/validator'

const log = debug('starling:transaction-service')

/**
 * Service to interact with a customer's transactions
 */
class Transaction {
  /**
   * Create a new transaction service
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Get feed items created between two timestamps
   * @param {string} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @param {string} categoryUid - the category uid
   * @param {string} minTransactionTimestamp - timestamp e.g. '2019-10-25T12:34:56.789Z'
   * @param {string} maxTransactionTimestamp - timestamp e.g. '2019-10-26T12:34:56.789Z'
   * @return {Promise} - the http request promise
   */
  getFeedItemsBetween (accessToken, accountUid, categoryUid, minTransactionTimestamp, maxTransactionTimestamp) {
    typeValidation(arguments, getFeedItemsBetweenParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/feed/account/${accountUid}/category/${categoryUid}/transactions-between`
    log(`GET ${url}`)
    return axios({
      method: 'GET',
      url,
      params: {
        minTransactionTimestamp,
        maxTransactionTimestamp
      },
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get a feed item
   * @param {string} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @param {string} categoryUid - the category uid
   * @param {string} feedItemUid - the feed item uid
   * @return {Promise} - the http request promise
   */
  getFeedItem (accessToken, accountUid, categoryUid, feedItemUid) {
    typeValidation(arguments, getFeedItemParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/feed/account/${accountUid}/category/${categoryUid}/${feedItemUid}`
    log(`GET ${url}`)
    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }
}

const getFeedItemsBetweenParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'accountUid', validations: ['required', 'string'] },
  { name: 'categoryUid', validations: ['required', 'string'] },
  { name: 'minTransactionTimestamp', validations: ['required', 'string'] },
  { name: 'maxTransactionTimestamp', validations: ['required', 'string'] }
]

const getFeedItemParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'accountUid', validations: ['required', 'string'] },
  { name: 'categoryUid', validations: ['required', 'string'] },
  { name: 'feedItemUid', validations: ['required', 'string'] }
]

module.exports = Transaction
