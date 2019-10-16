import axios from 'axios'
import debug from 'debug'
import { defaultHeaders } from '../utils/http'
import { typeValidation } from '../utils/validator'

const log = debug('starling:payment-service')

/**
 * Service to interact with a customer's payments
 */
class Payment {
  /**
   * Create a new payment service
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Get a payment order
   * @param {string} accessToken - the oauth bearer token
   * @param {string} paymentOrderUid - the payment order uid
   * @return {Promise} - the http request promise
   */
  getPaymentOrder (accessToken, paymentOrderUid) {
    typeValidation(arguments, getPaymentOrderParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/payments/local/payment-order/${paymentOrderUid}`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get a payment order's payments
   * @param {string} accessToken - the oauth bearer token
   * @param {string} paymentOrderUid - the payment order uid
   * @return {Promise} - the http request promise
   */
  getPaymentOrderPayments (accessToken, paymentOrderUid) {
    typeValidation(arguments, getPaymentOrderPaymentsParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/payments/local/payment-order/${paymentOrderUid}/payments`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * List standing orders
   * @param {string} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid of the account to get standing orders of
   * @param {string} categoryUid - the category uid of the category to get standing orders of
   * @return {Promise} - the http request promise
   */
  listStandingOrders (accessToken, accountUid, categoryUid) {
    typeValidation(arguments, listStandingOrdersParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/payments/local/account/${accountUid}/category/${categoryUid}/standing-orders`
    log(`GET ${url}`)
    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get a standing order
   * @param {string} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid of the standing order
   * @param {string} categoryUid - the category uid of the standing order
   * @param {string} paymentOrderUid - the payment order uid of the standing order
   * @return {Promise} - the http request promise
   */
  getStandingOrder (accessToken, accountUid, categoryUid, paymentOrderUid) {
    typeValidation(arguments, getStandingOrderParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/payments/local/account/${accountUid}/category/${categoryUid}/standing-orders/${paymentOrderUid}`
    log(`GET ${url}`)
    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }
}

const getPaymentOrderParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'accountUid', validations: ['required', 'string'] }
]

const getPaymentOrderPaymentsParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'accountUid', validations: ['required', 'string'] }
]

const listStandingOrdersParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'accountUid', validations: ['required', 'string'] },
  { name: 'categoryUid', validations: ['required', 'string'] }
]

const getStandingOrderParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'accountUid', validations: ['required', 'string'] },
  { name: 'categoryUid', validations: ['required', 'string'] },
  { name: 'paymentOrderUid', validations: ['required', 'string'] }
]

module.exports = Payment
