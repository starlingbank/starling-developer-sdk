import axios from 'axios'
import debug from 'debug'
import { defaultHeaders } from '../utils/http'
import { typeValidation } from '../utils/validator'

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
   * @param {string} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getAddresses (accessToken) {
    typeValidation(arguments, getAddressParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/addresses`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }
}

const getAddressParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] }
]

module.exports = Address
