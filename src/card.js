import axios from 'axios';
import debug from 'debug';
import {defaultHeaders} from './http';

const log = debug('starling:card-service');

/**
 * Service to interact with a customer card
 */
class Card {

  /**
   * Creates an instance of the client's card
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options;
  }

  /**
   * Retrieves a customer's card
   * @param {string} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getCard (accessToken) {
    const url = `${this.options.apiUrl}/api/v1/cards`;
    log(`GET ${url}`);

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    });
  }
}

module.exports = Card;
