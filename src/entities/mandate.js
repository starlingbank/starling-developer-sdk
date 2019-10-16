import axios from 'axios'
import debug from 'debug'
import { defaultHeaders } from '../utils/http'
import { typeValidation } from '../utils/validator'

const log = debug('starling:mandate-service')

/**
 * Service to interact with a customer's mandates
 */
class Mandate {
  /**
   * Create a new mandate service
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Gets a list of the customer's current direct debit mandates
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  listMandates (accessToken) {
    typeValidation(arguments, listMandatesParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/direct-debit/mandates`
    log(`GET ${url}`)
    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Gets a specific direct debit mandate
   * @param {string} accessToken - the oauth bearer token
   * @param {string} mandateUid - unique identifier of the mandate
   * @return {Promise} - the http request promise
   */
  getMandate (accessToken, mandateUid) {
    typeValidation(arguments, getMandateParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/direct-debit/mandates/${mandateUid}`
    log(`GET ${url}`)
    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Deletes specific direct debit mandate
   * @param {string} accessToken - the oauth bearer token.
   * @param {string} mandateUid - the unique mandate ID
   * @return {Promise} - the http request promise
   */
  deleteMandate (accessToken, mandateUid) {
    typeValidation(arguments, deleteMandateParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/direct-debit/mandates/${mandateUid}`
    log(`DELETE ${url}`)
    return axios({
      method: 'DELETE',
      url,
      headers: defaultHeaders(accessToken)
    })
  }
}

const listMandatesParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] }
]

const getMandateParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'mandateUid', validations: ['required', 'string'] }
]

const deleteMandateParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'mandateUid', validations: ['required', 'string'] }
]

module.exports = Mandate
