import axios from 'axios'
import debug from 'debug'
import { defaultHeaders, payloadHeaders } from '../utils/http'
import { struct, minAPIParameterDefintion, minAPIParameterValidator } from '../utils/validator'

const log = debug('starling:payee-service')

/**
 * Service to interact with an account holder's payees
 */
class Payee {
  /**
   * Create a new payee service
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Get an account holder's payees
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getPayees (parameters) {
    parameters = Object.assign({}, this.options, parameters)
    minAPIParameterValidator(parameters)
    const { apiUrl, accessToken } = parameters

    const url = `${apiUrl}/api/v2/payees`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Create a new payee
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token.
   * @param {Object} parameters.payeeCreationRequest - the payee creation request.
   * @return {Promise} - the http request promise
   */
  createPayee (parameters) {
    parameters = Object.assign({}, this.options, parameters)
    createPayeeParameterValidator(parameters)
    const { apiUrl, accessToken, payeeCreationRequest } = parameters

    const url = `${apiUrl}/api/v2/payees`
    log(`PUT ${url}`)
    return axios({
      method: 'PUT',
      url,
      headers: payloadHeaders(accessToken),
      data: JSON.stringify(payeeCreationRequest)
    })
  }

  /**
   * Delete an account holder's payee
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token.
   * @param {string} parameters.payeeUid - the payeeUid of the payee to be deleted.
   * @return {Promise} - the http request promise
   */
  deletePayee (parameters) {
    parameters = Object.assign({}, this.options, parameters)
    deletePayeeParameterValidator(parameters)
    const { apiUrl, accessToken, payeeUid } = parameters

    const url = `${apiUrl}/api/v2/payees/${payeeUid}`
    log(`DELETE ${url}`)
    return axios({
      method: 'DELETE',
      url,
      headers: defaultHeaders(accessToken)
    })
  }
}

const createPayeeParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  payeeCreationRequest: struct.object({
    payeeName: 'string',
    phoneNumber: 'string?',
    payeeType: struct.enum(['INDIVIDUAL', 'BUSINESS']),
    firstName: 'string?',
    middleName: 'string?',
    lastName: 'string?',
    businessName: 'string?',
    dateOfBirth: 'date?',
    accounts: struct.optional([struct.object({
      description: 'string',
      defaultAccount: 'boolean',
      countryCode: 'string',
      accountIdentifier: 'string',
      bankIdentifier: 'string',
      bankIdentifierType: struct.enum(['SORT_CODE', 'SWIFT', 'IBAN', 'ABA', 'ABA_WIRE', 'ABA_ACH'])
    })])
  })
})

const deletePayeeParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  payeeUid: 'uuid'
})

module.exports = Payee
