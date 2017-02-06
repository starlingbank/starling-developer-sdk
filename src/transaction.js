import axios from 'axios';
import debug from 'debug';
import {defaultHeaders} from './http';

const log = debug('starling:transaction-service');

/**
 * Service to interact with a customer's transactions
 */
class Transaction {
  /**
   * Create a new transaction service
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options;
  }

  /**
   * Gets the customer's transactions over the given period
   * @param {string} fromDate - filter transactions after this date. Format: YYYY-MM-DD
   * @param {string} toDate - filter transactions before this date. Format: YYYY-MM-DD
   * @param {string} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getTransactions (fromDate, toDate, accessToken) {
    const url = `${this.options.apiUrl}/api/v1/transactions`;
    log(`GET ${url} from=${fromDate} to=${toDate}`);

    return axios({
      method: 'GET',
      url,
      params: {
        from: fromDate,
        to: toDate
      },
      headers: defaultHeaders(accessToken)
    });
  }

  /**
   * Gets the full details of a single transaction
   * @param {string} transactionID - the unique transaction ID
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getTransaction (transactionID, accessToken) {
    const url = `${this.options.apiUrl}/api/v1/transactions/${transactionID}`;
    log(`GET ${url}`);

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    });
  }
}

module.exports = Transaction;
