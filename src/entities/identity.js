import axios from 'axios'
import debug from 'debug'
import { defaultHeaders } from '../utils/http'
import { typeValidation } from '../utils/validator'

const log = debug('starling:identity-service')

/**
 * Service to interact with the API User identities endpoints
 */
class Identity {
  /**
   * Creates an instance of the identity client
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Get the current token identity
   * @param {string} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getTokenIdentity (accessToken) {
    typeValidation(arguments, getTokenIdentityParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/identity/token`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }
}

const getTokenIdentityParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] }
]

module.exports = Identity
