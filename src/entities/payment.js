import axios from 'axios';
import debug from 'debug';
import {defaultHeaders} from '../utils/http';
import {typeValidation} from '../utils/validator';

const log = debug('starling:payment-service');


/**
 * Service to interact with a customer's transactions
 */
class Payment {
  /**
   * Create a new transaction service
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options;
  }

  /**
   * Makes a payment on behalf of the customer to another UK bank account using the Faster Payments network
   * @param {string} accessToken - the oauth bearer token.
   *  @param {string} destinationAccountId - the account identifier of the recipient
   * @param {string} reference - The payment reference, max. 18 characters.
   * @param {string} amount - the amount to be send.
   * @param {string=} currency - the currency, optional, defaults to "GBP".
   * @return {Promise} - the http request promise
   */
  makeLocalPayment (accessToken, destinationAccountId, reference, amount, currency) {
    typeValidation(arguments, makeLocalPaymentParameterDefinition);
    const url = `${this.options.apiUrl}/api/v1/payments/local`;
    log(`POST ${url}`);
    return axios({
      method: 'POST',
      url,
      headers: defaultHeaders(accessToken),
      body: JSON.stringify({
        destinationAccountId,
        payment: {
          amount,
          currency
        },
        reference
      })
    });
  }


  /**
   * Lists the customer's scheduled payments
   * @param {string} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  listScheduledPayments (accessToken) {
    typeValidation(arguments, listScheduledPaymentsParameterDefinition);
    const url = `${this.options.apiUrl}/api/v1/payments/scheduled`;
    log(`GET ${url}`);
    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    });
  }
}

const makeLocalPaymentParameterDefinition = [
  {name: 'accessToken', validations: ['required', 'string']},
  {name: 'destinationAccountId', validations: ['required', 'string']},
  {name: 'reference', validations: ['required', 'string']},
  {name: 'amount', validations: ['required', 'string']},
  {name: 'currency', validations: ['optional', 'string']}
];

const listScheduledPaymentsParameterDefinition = [
  {name: 'accessToken', validations: ['required', 'string']}
];

module.exports = Payment;
