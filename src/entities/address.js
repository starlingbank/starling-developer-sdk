import axios from 'axios'
import debug from 'debug'
import { defaultHeaders } from '../utils/http'
import { minAPIParameterValidator } from '../utils/validator'

const log = debug('starling:address-service')

/**
 * Service to interact with a customer address
 */
class Address {
  /**
   * Creates an instance of the address client
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Retrieves a customer's address
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getAddresses (parameters) {
    parameters = Object.assign({}, this.options, parameters)
    minAPIParameterValidator(parameters)
    const { apiUrl, accessToken } = parameters

    const url = `${apiUrl}/api/v2/addresses`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }
}

module.exports = Address
