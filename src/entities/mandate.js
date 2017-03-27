import axios from 'axios';
import debug from 'debug';
import {defaultHeaders} from '../utils/http';
import {typeValidation} from '../utils/validator';

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
    typeValidation(arguments, listMandatesParameterDefinition);
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
    typeValidation(arguments, deleteMandateParameterDefinition);
    const url = `${this.options.apiUrl}/api/v1/direct-debit/mandates/${mandateId}`;
    log(`GET ${url}`);
    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    });
  }
}

const listMandatesParameterDefinition = [
  {name: 'accessToken', validations: ['required', 'string']}
];

const deleteMandateParameterDefinition = [
  {name: 'accessToken', validations: ['required', 'string']},
  {name: 'mandateId', validations: ['required', 'string']}
];

module.exports = Mandate;
