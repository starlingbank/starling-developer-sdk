import axios from 'axios'
import debug from 'debug'
import { defaultHeaders, payloadHeaders } from '../utils/http'
import { typeValidation } from '../utils/validator'

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
   * @param {string} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getPayees (accessToken) {
    typeValidation(arguments, getPayeesParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/payees`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Create a new payee
   * @param {string} accessToken - the oauth bearer token.
   * @param {Object} payeeCreationRequest - the payee creation request.
   * @return {Promise} - the http request promise
   */
  createPayee (accessToken, {
    payeeName,
    phoneNumber,
    payeeType,
    firstName,
    middleName,
    lastName,
    businessName,
    dateOfBirth,
    accounts
  }) {
    typeValidation(arguments, createPayeeParameterDefinition)
    typeValidation(arguments[1], payeeCreationRequestDefinition)
    if (accounts) {
      accounts.forEach(payeeAccountCreationRequest =>
        typeValidation(payeeAccountCreationRequest, payeeAccountCreationRequestDefinition))
    }

    const url = `${this.options.apiUrl}/api/v2/payees`
    log(`PUT ${url}`)
    return axios({
      method: 'PUT',
      url,
      headers: payloadHeaders(accessToken),
      data: JSON.stringify({
        payeeName,
        phoneNumber,
        payeeType,
        firstName,
        middleName,
        lastName,
        businessName,
        dateOfBirth,
        accounts
      })
    })
  }

  /**
   * Delete an account holder's payee
   * @param {string} accessToken - the oauth bearer token.
   * @param {string} payeeUid - the payeeUid of the payee to be deleted.
   * @return {Promise} - the http request promise
   */
  deletePayee (accessToken, payeeUid) {
    typeValidation(arguments, deletePayeeParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/payees/${payeeUid}`
    log(`DELETE ${url}`)
    return axios({
      method: 'DELETE',
      url,
      headers: defaultHeaders(accessToken)
    })
  }
}

const getPayeesParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] }
]

const createPayeeParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'payeeCreationRequest', validations: ['required', 'object'] }
]

const payeeCreationRequestDefinition = [
  { name: 'payeeName', validations: ['required', 'string'] },
  { name: 'phoneNumber', validations: ['optional', 'string'] },
  { name: 'payeeType', validations: ['required', 'string'] },
  { name: 'firstName', validations: ['optional', 'string'] },
  { name: 'middleName', validations: ['optional', 'string'] },
  { name: 'lastName', validations: ['optional', 'string'] },
  { name: 'businessName', validations: ['optional', 'string'] },
  { name: 'dateOfBirth', validations: ['optional', 'string'] },
  { name: 'accounts', validations: ['optional', 'object'] }
]

const payeeAccountCreationRequestDefinition = [
  { name: 'description', validations: ['required', 'string'] },
  { name: 'defaultAccount', validations: ['required', 'boolean'] },
  { name: 'countryCode', validations: ['required', 'string'] },
  { name: 'accountIdentifier', validations: ['required', 'string'] },
  { name: 'bankIdentifier', validations: ['required', 'string'] },
  { name: 'bankIdentifierType', validations: ['required', 'string'] }
]

const deletePayeeParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'payeeUid', validations: ['required', 'string'] }
]

module.exports = Payee
