import axios from 'axios';
import debug from 'debug';
import { defaultHeaders, postHeaders } from '../utils/http';
import { typeValidation } from '../utils/validator';

const log = debug('starling:saving-goals-service');

/**
 * Service to interact with a customer's savings goals
 */
class SavingsGoals {
  /**
   * Create a new savings goal service
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options;
  }

  /**
   * Gets a list of the customer's savings goals
   * @param {string} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  listSavingsGoals (accessToken) {
    typeValidation(arguments, listSavingsGoalsParameterDefinition);
    const url = `${this.options.apiUrl}/api/v1/savings-goals`;
    log(`GET ${url}`);
    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    });
  }

  /**
   * Gets a specific savings goal
   * @param {string} accessToken - the oauth bearer token.
   * @param {string} savingsGoalId - the savings goal's ID.
   * @return {Promise} - the http request promise
   */
  getSavingsGoal (accessToken, savingsGoalId) {
    typeValidation(arguments, getSavingsGoalParameterDefinition);
    const url = `${this.options.apiUrl}/api/v1/savings-goals/${savingsGoalId}`;
    log(`GET ${url}`);
    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    });
  }

  /**
   * Creates a savings goal
   * @param {string} accessToken - the oauth bearer token.
   * @param {string} savingsGoalId - the savings goal's ID, generate one if creating a goal.
   * @param {string} name - the name of the new contact.
   * @param {string} currency - the currency of the savings goal. Defaults to 'GBP'.
   * @param {number} targetAmount - the target amount in minor units (e.g. 1234 => £12.34).
   * @param {string} targetCurrency - the target currency, also defaults to 'GBP'.
   * @param {string} base64EncodedPhoto - base64 encoded image to associate with the goal. (optional)
   * @return {Promise} - the http request promise
   */
  createSavingsGoal (accessToken, savingsGoalId, name, currency, targetAmount, targetCurrency, base64EncodedPhoto) {
    typeValidation(arguments, createSavingsGoalParameterDefinition);
    const url = `${this.options.apiUrl}/api/v1/savings-goals/${savingsGoalId}`;
    log(`PUT ${url}`);
    return axios({
      method: 'PUT',
      url,
      headers: postHeaders(accessToken),
      data: JSON.stringify({
        name,
        currency,
        target: {
          targetAmount,
          targetCurrency
        },
        base64EncodedPhoto
      })
    });
  }

  /**
   * Deletes specific savings goal
   * @param {string} accessToken - the oauth bearer token.
   * @param {string} savingsGoalId - the unique mandate ID
   * @return {Promise} - the http request promise
   */
  deleteSavingsGoal (accessToken, savingsGoalId) {
    typeValidation(arguments, deleteSavingsGoalParameterDefinition);
    const url = `${this.options.apiUrl}/api/v1/savings-goals/${savingsGoalId}`;
    log(`DELETE ${url}`);
    return axios({
      method: 'DELETE',
      url,
      headers: defaultHeaders(accessToken)
    });
  }

  /**
   * Add money to a specific savings goal
   * @param {string} accessToken - the oauth bearer token.
   * @param {string} savingsGoalId - the savings goal's ID.
   * @param {string} transactionId - a transaction ID for this transaction
   * @param {number} amount - an amount in minor unit
   * @return {Promise} - the http request promise
   */
  addMoneyToSavingsGoal (accessToken, savingsGoalId, transactionId, amount) {
    typeValidation(arguments, addMoneySavingsGoalParameterDefinition);
    const url = `${this.options.apiUrl}/api/v1/savings-goals/${savingsGoalId}/add-money/${transactionId}`;
    log(`PUT ${url}`);
    return axios({
      method: 'PUT',
      url,
      headers: postHeaders(accessToken),
      data: JSON.stringify({
         "amount": {
           "currency": "GBP",
           "minorUnits": amount,
         }
      })
    });
  }
}

const listSavingsGoalsParameterDefinition = [
  { name: 'accessToken', validations: [ 'required', 'string' ] }
];

const getSavingsGoalParameterDefinition = [
  { name: 'accessToken', validations: [ 'required', 'string' ] },
  { name: 'savingsGoalId', validations: [ 'required', 'string' ] }
];

const deleteSavingsGoalParameterDefinition = [
  { name: 'accessToken', validations: [ 'required', 'string' ] },
  { name: 'savingsGoalId', validations: [ 'required', 'string' ] }
];

const createSavingsGoalParameterDefinition = [
  { name: 'accessToken', validations: [ 'required', 'string' ] },
  { name: 'savingsGoalId', validations: [ 'required', 'string' ] },
  { name: 'name', validations: [ 'required', 'string' ] },
  { name: 'currency', validations: [ 'required', 'string' ] },
  { name: 'targetAmount', validations: [ 'optional', 'number' ] },
  { name: 'targetCurrency', validations: [ 'optional', 'string' ] },
  { name: 'base64EncodedPhoto', validations: [ 'optional', 'string' ] }
];

const addMoneySavingsGoalParameterDefinition = [
  { name: 'accessToken', validations: [ 'required', 'string' ] },
  { name: 'savingsGoalId', validations: [ 'required', 'string' ] },
  { name: 'transactionId', validations: [ 'required', 'string' ] },
  { name: 'amount', validations: [ 'required', 'number' ] },
];

module.exports = SavingsGoals;
