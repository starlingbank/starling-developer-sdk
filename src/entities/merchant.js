import axios from 'axios';
import debug from 'debug';
import {defaultHeaders} from '../utils/http';
import {typeValidation} from '../utils/validator';

const log = debug('starling:merchant-service');

/**
 * Resource to manage data from the merchants the customer has transacted with.
 */
class Merchant {


  /**
  * Creates an instance of the account client
  * @param {Object} options - application config
  */
  constructor (options) {
    this.options = options;
  }

  /**
   * Retrieves details of the merchant
   * @param {string} accessToken - the oauth bearer token
   * @param {string} merchantUid - Unique identifier of the merchant.
   * @return {Promise} - the http request promise
   */
  getMerchant (accessToken, merchantUid) {
    typeValidation(arguments, getMerchantParameterDefinition);
    const url = `${this.options.apiUrl}/api/v1/merchants/${merchantUid}`;
    log(`GET ${url}`);

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    });
  }

   /**
   * Gets the details of a specific location of the merchant where a transaction took place. 
   * @param {string} accessToken - the oauth bearer token
   * @param {string} merchantUid - Unique identifier of the merchant the location belongs to.
   * @param {string} merchantLocationUid - Unique identifier of the location for the merchant.
   * @return {Promise} - the http request promise
   */
  getMerchantLocation (accessToken, merchantUid, merchantLocationUid) {
    typeValidation(arguments, getMerchantLocationParameterDefinition);
    const url = `${this.options.apiUrl}/api/v1/merchants/${merchantUid}/locations/${merchantLocationUid}`;
    log(`GET ${url}`);

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    });
  }

}

const getMerchantParameterDefinition = [
  {name: 'accessToken', validations: ['required', 'string']},
  {name: 'merchantUid', validations: ['required', 'string']},
];

const getMerchantLocationParameterDefinition = [
  {name: 'accessToken', validations: ['required', 'string']},
  {name: 'merchantUid', validations: ['required', 'string']},
  {name: 'merchantLocationUid', validations: ['required', 'string']},
];

module.exports = Merchant;
