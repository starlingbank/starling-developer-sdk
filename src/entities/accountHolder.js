import axios from 'axios'
import debug from 'debug'
import { defaultHeaders } from '../utils/http'
import { typeValidation } from '../utils/validator'

const log = debug('starling:account-holder-service')

/**
 * Service to interact with an account holder
 */
class AccountHolder {
  /**
   * Creates an instance of the account holder client
   * @param {Object} options - application config
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Get basic information about the account holder
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolder (accessToken) {
    typeValidation(arguments, getAccountHolderParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/account-holder`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get the name of the account holder
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderName (accessToken) {
    typeValidation(arguments, getAccountHolderNameParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/account-holder/name`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get an individual account holder's details
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderIndividual (accessToken) {
    typeValidation(arguments, getAccountHolderIndividualParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/account-holder/individual`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get a joint account holder's details
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderJoint (accessToken) {
    typeValidation(arguments, getAccountHolderJointParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/account-holder/joint`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get a business account holder's details
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderBusiness (accessToken) {
    typeValidation(arguments, getAccountHolderBusinessParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/account-holder/business`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get a business account holder's registered address
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderBusinessRegisteredAddress (accessToken) {
    typeValidation(arguments, getAccountHolderBusinessRegisteredAddressParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/account-holder/business/registered-address`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get a business account holder's correspondence address
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderBusinessCorrespondenceAddress (accessToken) {
    typeValidation(arguments, getAccountHolderBusinessCorrespondenceAddressParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/account-holder/business/correspondence-address`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }
}

const getAccountHolderParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] }
]

const getAccountHolderNameParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] }
]

const getAccountHolderIndividualParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] }
]

const getAccountHolderJointParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] }
]

const getAccountHolderBusinessParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] }
]

const getAccountHolderBusinessRegisteredAddressParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] }
]

const getAccountHolderBusinessCorrespondenceAddressParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] }
]

module.exports = AccountHolder
