import axios from 'axios'
import debug from 'debug'
import { defaultHeaders } from '../utils/http'
import { struct, minAPIParameterDefintion } from '../utils/validator'

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
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.paymentOrderUid - the payment order uid
   * @return {Promise} - the http request promise
   */
  getPaymentOrder (parameters) {
    parameters = Object.assign({}, this.options, parameters)
    getPaymentOrderParameterValidator(parameters)
    const { apiUrl, accessToken, paymentOrderUid } = parameters

    const url = `${apiUrl}/api/v2/payments/local/payment-order/${paymentOrderUid}`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get a payment order's payments
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.paymentOrderUid - the payment order uid
   * @return {Promise} - the http request promise
   */
  getPaymentOrderPayments (parameters) {
    parameters = Object.assign({}, this.options, parameters)
    getPaymentOrderPaymentsParameterValidator(parameters)
    const { apiUrl, accessToken, paymentOrderUid } = parameters

    const url = `${apiUrl}/api/v2/payments/local/payment-order/${paymentOrderUid}/payments`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * List standing orders
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.accountUid - the account uid of the account to get standing orders of
   * @param {string} parameters.categoryUid - the category uid of the category to get standing orders of
   * @return {Promise} - the http request promise
   */
  listStandingOrders (parameters) {
    parameters = Object.assign({}, this.options, parameters)
    listStandingOrdersParameterValidator(parameters)
    const { apiUrl, accessToken, accountUid, categoryUid } = parameters

    const url = `${apiUrl}/api/v2/payments/local/account/${accountUid}/category/${categoryUid}/standing-orders`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Get a standing order
   * @param {string} parameters.apiUrl - the API URL
   * @param {string} parameters.accessToken - the oauth bearer token
   * @param {string} parameters.accountUid - the account uid of the standing order
   * @param {string} parameters.categoryUid - the category uid of the standing order
   * @param {string} parameters.paymentOrderUid - the payment order uid of the standing order
   * @return {Promise} - the http request promise
   */
  getStandingOrder (parameters) {
    parameters = Object.assign({}, this.options, parameters)
    getStandingOrderParameterValidator(parameters)
    const { apiUrl, accessToken, accountUid, categoryUid, paymentOrderUid } = parameters

    const url = `${apiUrl}/api/v2/payments/local/account/${accountUid}/category/${categoryUid}/standing-orders/${paymentOrderUid}`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }
}

const getPaymentOrderParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  paymentOrderUid: 'uuid'
})

const getPaymentOrderPaymentsParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  paymentOrderUid: 'uuid'
})

const listStandingOrdersParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  accountUid: 'uuid',
  categoryUid: 'uuid'
})

const getStandingOrderParameterValidator = struct.interface({
  ...minAPIParameterDefintion,
  accountUid: 'uuid',
  categoryUid: 'uuid',
  paymentOrderUid: 'uuid'
})

module.exports = Payment
