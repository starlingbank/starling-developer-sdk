import axios from 'axios';
import debug from 'debug';
import {defaultHeaders} from '../utils/http';

const log = debug('starling:customer-service');

/**
 * Service to interact with a customer
 */
class Customer {

  /**
   * Create a new customer service
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options;
  }

  /**
   * Gets the customer's details
   * @param {string} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getCustomer (accessToken) {
    const url = `${this.options.apiUrl}/api/v1/customers`;
    log(`GET ${url}`);

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    });
  }
}

module.exports = Customer;
