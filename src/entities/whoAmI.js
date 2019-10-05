import axios from 'axios'
import debug from 'debug'
import { defaultHeaders } from '../utils/http'
import { typeValidation } from '../utils/validator'

const log = debug('starling:who-am-i-service')

/**
 * Service to interact with the Who Am I endpoint
 */
class WhoAmI {
  /**
   * Creates an instance of the who am I client
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Retrieves the customer UUID and permissions corresponding to the access token passed
   * @param {string} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getMe (accessToken) {
    typeValidation(arguments, getMeParameterDefinition)
    const url = `${this.options.apiUrl}/api/v1/me`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }
}

const getMeParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] }
]

module.exports = WhoAmI
