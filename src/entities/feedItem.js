import axios from 'axios'
import debug from 'debug'
import { defaultHeaders } from '../utils/http'
import { struct, minAPIParameterDefintion } from '../utils/validator'

const log = debug('starling:feed-item-service')

/**
 * Service to interact with a customer's feed items
 */
class FeedItem {
  /**
   * Create a new feed item service
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Get feed items created between two timestamps
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.accountUid - the account uid
   * @param {string} parameters.categoryUid - the category uid
   * @param {string} parameters.minTransactionTimestamp - timestamp e.g. '2019-10-25T12:34:56.789Z'
   * @param {string} parameters.maxTransactionTimestamp - timestamp e.g. '2019-10-26T12:34:56.789Z'
   * @return {Promise} - the http request promise
   */
  getFeedItemsBetween (parameters) {
    parameters = Object.assign({}, this.options, parameters)
    getFeedItemsBetweenParameterValidator(parameters)
    const { apiUrl, accessToken, accountUid, categoryUid, minTransactionTimestamp, maxTransactionTimestamp } = parameters

    const url = `${apiUrl}/api/v2/feed/account/${accountUid}/category/${categoryUid}/transactions-between`
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
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.accountUid - the account uid
   * @param {string} parameters.categoryUid - the category uid
   * @param {string} parameters.feedItemUid - the feed item uid
   * @return {Promise} - the http request promise
   */
  getFeedItem (parameters) {
    parameters = Object.assign({}, this.options, parameters)
    getFeedItemParameterValidator(parameters)
    const { apiUrl, accessToken, accountUid, categoryUid, feedItemUid } = parameters

    const url = `${apiUrl}/api/v2/feed/account/${accountUid}/category/${categoryUid}/${feedItemUid}`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get feed items created or updated since a given timestamp
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.accountUid - the account uid
   * @param {string} parameters.categoryUid - the category uid
   * @param {string} parameters.changesSince - timestamp e.g. '2019-10-25T12:34:56.789Z'
   * @return {Promise} - the http request promise
   */
  getFeedItemsChangedSince (parameters) {
    parameters = Object.assign({}, this.options, parameters)
    getFeedItemsChangedSinceParameterValidator(parameters)
    const { apiUrl, accessToken, accountUid, categoryUid, changesSince } = parameters

    const url = `${apiUrl}/api/v2/feed/account/${accountUid}/category/${categoryUid}`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      params: {
        changesSince
      },
      headers: defaultHeaders(accessToken)
    })
  }
}

const getFeedItemsBetweenParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  accountUid: 'uuid',
  categoryUid: 'uuid',
  minTransactionTimestamp: 'timestamp',
  maxTransactionTimestamp: 'timestamp'
})

const getFeedItemParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  accountUid: 'uuid',
  categoryUid: 'uuid',
  feedItemUid: 'uuid'
})

const getFeedItemsChangedSinceParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  accountUid: 'uuid',
  categoryUid: 'uuid',
  changesSince: 'timestamp'
})

module.exports = FeedItem
