import axios from 'axios'
import debug from 'debug'
import { defaultHeaders } from '../utils/http'
import { typeValidation } from '../utils/validator'

const log = debug('starling:card-service')

/**
 * Service to interact with a customer card
 */
class Card {
  /**
   * Creates an instance of the client's card
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Get all the cards for an account holder
   * @param {string} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getCards (accessToken) {
    typeValidation(arguments, getCardsParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/cards`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }
}

const getCardsParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] }
]

module.exports = Card
