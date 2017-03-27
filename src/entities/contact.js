import axios from 'axios';
import debug from 'debug';
import {defaultHeaders} from '../utils/http';
import {typeValidation} from '../utils/validator';

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
    typeValidation(arguments, getContactsParameterDefinition);
    const url = `${this.options.apiUrl}/api/v1/contacts`;
    log(`GET ${url}`);

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    });
  }

  /**
   * Gets a specific contact's (payee) account details
   * @param {string} accessToken - the oauth bearer token.
   * @param {string} contactId - the contact's ID.
   * @return {Promise} - the http request promise
   */
  getContactAccount (accessToken, contactId) {
    typeValidation(arguments, getContactAccountParameterDefinition);
    const url = `${this.options.apiUrl}/api/v1/contacts/${contactId}/accounts`;
    log(`GET ${url}`);
    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    });
  }

  /**
   * Creates a contact (payee) for the customer
   * @param {string} accessToken - the oauth bearer token.
   * @param {string} name - the name of the new contact.
   * @param {string} accountType - the account type (domestic or international).
   * @param {string} accountNumber - the contact's bank account number.
   * @param {string} sortCode - the contact's sort code.
   * @param {string} customerId - the customer's ID. (optional)
   * @return {Promise} - the http request promise
   */
  createContact (accessToken, name, accountType, accountNumber, sortCode, customerId) {
    typeValidation(arguments, createContactParameterDefinition);
    const url = `${this.options.apiUrl}/api/v1/contacts`;
    log(`POST ${url}`);
    return axios({
      method: 'POST',
      url,
      headers: defaultHeaders(accessToken),
      body: JSON.stringify({
        name,
        accountType,
        accountNumber,
        sortCode,
        customerId
      }),
    });
  }
}

const getContactsParameterDefinition = [
  {name: 'accessToken', validations: ['required', 'string']}];

const getContactAccountParameterDefinition = [
  {name: 'accessToken', validations: ['required', 'string']},
  {name: 'customerId', validations: ['required', 'string']}];

const createContactParameterDefinition = [
  {name: 'accessToken', validations: ['required', 'string']},
  {name: 'name', validations: ['required', 'string']},
  {name: 'accountType', validations: ['required', 'string']},
  {name: 'accountNumber', validations: ['required', 'string']},
  {name: 'sortCode', validations: ['required', 'string']},
  {name: 'customerId', validations: ['optional', 'string']}];

module.exports = Contact;
