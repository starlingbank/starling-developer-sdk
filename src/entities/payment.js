import axios from 'axios'
import debug from 'debug'
import { defaultHeaders, payloadHeaders } from '../utils/http'
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
   * Create domestic payment
   * @param {string} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid of the account to send the payment from
   * @param {string} categoryUid - the category uid of the category to send the payment from
   * @param {Object} instructLocalPaymentRequest - the instruct local payment request
   * @param {string} instructLocalPaymentRequest.externalIdentifier - a unique identifier to ensure idemopotency, 0-100 characters
   * @param {string} instructLocalPaymentRequest.destinationPayeeAccountUid - the payee uid of the recipient
   * @param {string} instructLocalPaymentRequest.reference - The payment reference, 1-18 characters
   * @param {Object} instructLocalPaymentRequest.amount - the currency and amount
   * @param {string} instructLocalPaymentRequest.amount.currency - the currency, represented as an ISO-4217 3 character currency code
   * @param {number} instructLocalPaymentRequest.amount.minorUnits - amount in the minor units of the given currency; eg pence in GBP, cents in EUR
   * @return {Promise} - the http request promise
   */
  makeLocalPayment (accessToken, accountUid, categoryUid, { externalIdentifier, destinationPayeeAccountUid, reference, amount: { currency, minorUnits } }) {
    typeValidation(arguments, makeLocalPaymentParameterDefinition)
    typeValidation(arguments[3], instructLocalPaymentRequestDefinition)
    typeValidation(arguments[3].amount, currencyAndAmountDefinition)

    const url = `${this.options.apiUrl}/api/v2/payments/local/account/${accountUid}/category/${categoryUid}`
    log(`PUT ${url}`)
    return axios({
      method: 'PUT',
      url,
      headers: payloadHeaders(accessToken),
      data: JSON.stringify({
        externalIdentifier,
        destinationPayeeAccountUid,
        reference,
        amount: {
          currency,
          minorUnits
        }
      })
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

const makeLocalPaymentParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'accountUid', validations: ['required', 'string'] },
  { name: 'categoryUid', validations: ['required', 'string'] },
  { name: 'instructLocalPaymentRequest', validations: ['required', 'object'] }
]

const instructLocalPaymentRequestDefinition = [
  { name: 'externalIdentifier', validations: ['required', 'string'] },
  { name: 'destinationPayeeAccountUid', validations: ['required', 'string'] },
  { name: 'reference', validations: ['required', 'string'] },
  { name: 'amount', validations: ['required', 'object'] }
]

const currencyAndAmountDefinition = [
  { name: 'currency', validations: ['required', 'string'] },
  { name: 'minorUnits', validations: ['required', 'number'] }
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
