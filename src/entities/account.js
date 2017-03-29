import axios from 'axios';
import debug from 'debug';
import {defaultHeaders} from '../utils/http';
import {typeValidation} from '../utils/validator';

const log = debug('starling:account-service');

/**
 * Service to interact with a customer's account
 */
class Account {

  /**
   * Creates an instance of the account client
   * @param {Object} options - application config
   */
  constructor (options) {
    this.options = options;
  }

  /**
   * Retrieves a customer's account
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccount (accessToken) {
    typeValidation(arguments, getAccountParameterDefinition);
    const url = `${this.options.apiUrl}/api/v1/accounts`;
    log(`GET ${url}`);

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    });
  }

  /**
   * Retrieves the customer's balance
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getBalance (accessToken) {
    typeValidation(arguments, getBalanceParameterDefinition);
    const url = `${this.options.apiUrl}/api/v1/accounts/balance`;
    log(`GET ${url}`);

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    });
  }
}

const getAccountParameterDefinition = [
  {name: 'accessToken', validations: ['required', 'string']}
  ];

const getBalanceParameterDefinition = [
  {name: 'accessToken', validations: ['required', 'string']}
  ];

module.exports = Account;
