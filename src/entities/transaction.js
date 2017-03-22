import axios from 'axios';
import debug from 'debug';
import {defaultHeaders} from '../utils/http';

const log = debug('starling:transaction-service');

const transactionSource = (source) => {
  if (source === 'MASTER_CARD') {
    return '/mastercard';
  } else if (source === 'FASTER_PAYMENTS_IN') {
    return '/fps/in';
  } else if (source === 'FASTER_PAYMENTS_OUT') {
    return '/fps/out';
  } else if (source === 'DIRECT_DEBIT') {
    return '/direct-debit';
  } else {
    return ''
  }
};

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
   * @param {string=} source - the transaction type (e.g. faster payments, mastercard).
   * If not specified, results are not filtered by source.
   * @param {string} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getTransactions (fromDate, toDate, source, accessToken) {
    const url = `${this.options.apiUrl}/api/v1/transactions${transactionSource(source)}`;
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
   * @param {string} transactionId - the unique transaction ID
   * @param {string=} source - the transaction type (e.g. faster payments, mastercard).
   * If not specified, only generic transaction information will be returned.
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getTransaction (transactionId, source, accessToken) {
    const url = `${this.options.apiUrl}/api/v1/transactions${transactionSource(source)}/${transactionId}`;
    log(`GET ${url}`);
    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    });
  }
}

module.exports = Transaction;
