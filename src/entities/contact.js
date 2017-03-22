import axios from 'axios';
import debug from 'debug';
import {defaultHeaders} from '../utils/http';

const log = debug('starling:contact-service');

/**
 * Service to interact with a customer's contacts (payees)
 */
class Contact {

  /**
   * Create a new contact service
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options;
  }

  /**
   * Gets the customer's contacts (payees)
   * @param {string} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getContacts (accessToken) {
    const url = `${this.options.apiUrl}/api/v1/contacts`;
    log(`GET ${url}`);

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    });
  }
}

module.exports = Contact;
