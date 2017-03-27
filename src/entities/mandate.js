import axios from 'axios';
import debug from 'debug';
import {defaultHeaders} from '../utils/http';

const log = debug('starling:mandate-service');


/**
 * Service to interact with a customer's transactions
 */
class Mandate {
  /**
   * Create a new transaction service
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options;
  }

  /**
   * Gets a list of the customer's current direct debit mandates
   * @param {string} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  listMandates (accessToken) {
    const url = `${this.options.apiUrl}/api/v1/direct-debit/mandates`;
    log(`GET ${url}`);
    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    });
  }

  /**
   * Deletes specific direct debit mandate
   * @param {string} accessToken - the oauth bearer token.
   * @param {string} mandateId - the unique mandate ID
   * @return {Promise} - the http request promise
   */
  deleteMandate (accessToken, mandateId) {
    const url = `${this.options.apiUrl}/api/v1/direct-debit/mandates/${mandateId}`;
    log(`GET ${url}`);
    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    });
  }
}

module.exports = Mandate;
