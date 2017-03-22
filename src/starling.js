import Customer from './entities/customer';
import Account from './entities/account';
import Address from './entities/address';
import Transaction from './entities/transaction';
import Card from './entities/card';
import OAuth from './entities/oauth';
import Contact from './entities/contact';
import Mandate from './entities/mandate';

/**
 * Facade to dispatch operations to services
 */
class Starling {

  /**
   * Create an instance of the starling client
   * @param {Object=} options - configuration parameters
   */
  constructor (options) {
    const defaults = {
      apiUrl: 'https://api.starlingbank.com',
      oauthUrl: 'https://oauth.starlingbank.com',
      clientId: '',
      clientSecret: ''
    };

    this.config = Object.assign({}, defaults, options);

    this.customer = new Customer(this.config);
    this.account = new Account(this.config);
    this.address = new Address(this.config);
    this.transaction = new Transaction(this.config);
    this.mandate = new Mandate(this.config);
    this.contact = new Contact(this.config);
    this.card = new Card(this.config);
    this.oAuth = new OAuth(this.config);
  }

  /**
   * Gets the customer's details
   * @param {string=} accessToken - the oauth bearer token. If not
   * specified, the accessToken on the options object is used.
   * @return {Promise} - the http request promise
   */
  getCustomer (accessToken = this.config.accessToken) {
    return this.customer.getCustomer(accessToken);
  }

  /**
   * Gets the customer's account details
   * @param {string=} accessToken - the oauth bearer token.  If not
   * specified, the accessToken on the options object is used.
   * @return {Promise} - the http request promise
   */
  getAccount (accessToken = this.config.accessToken) {
    return this.account.getAccount(accessToken);
  }

  /**
   * Gets the customer's balance
   * @param {string=} accessToken - the oauth bearer token.  If not
   * specified, the accessToken on the options object is used.
   * @return {Promise} - the http request promise
   */
  getBalance (accessToken = this.config.accessToken) {
    return this.account.getBalance(accessToken);
  }

  /**
   * Gets the customer's addresses (current and previous)
   * @param {string=} accessToken - the oauth bearer token.  If not
   * specified, the accessToken on the options object is used.
   * @return {Promise} - the http request promise
   */
  getAddresses (accessToken = this.config.accessToken) {
    return this.address.getAddresses(accessToken);
  }

  /**
   * Gets the customer's transaction history
   * @param {string} fromDate - filter transactions after this date. Format: YYYY-MM-DD (optional,
   *   defaults to one month in past if not provided)
   * @param {string} toDate - filter transactions before this date. Format: YYYY-MM-DD (optional,
   *   defaults to current date if not provided)
   * @param {string=} source - the transaction type (e.g. faster payments, mastercard).
   * If not specified, results are not filtered by source.
   * @param {string=} accessToken - the oauth bearer token.  If not
   * specified, the accessToken on the options object is used.
   * @return {Promise} - the http request promise
   */
  getTransactions (fromDate, toDate, source, accessToken = this.config.accessToken) {
    return this.transaction.getTransactions(fromDate, toDate, source, accessToken);
  }

  /**
   * Gets the full details of a single transaction
   * @param {string} transactionId - the unique transaction ID
   * @param {string=} source - the transaction type (e.g. faster payments, mastercard).
   * If not specified, only generic transaction information will be returned.
   * @param {string=} accessToken - the oauth bearer token.  If not
   * specified, the accessToken on the options object is used.
   * @return {Promise} - the http request promise
   */
  getTransaction (transactionId, source = '', accessToken = this.config.accessToken) {
    return this.transaction.getTransaction(transactionId, source, accessToken);
  }

  /**
   * Gets the customer's current direct-debit mandates
   * @param {string=} accessToken - the oauth bearer token.  If not
   * specified, the accessToken on the options object is used.
   * @return {Promise} - the http request promise
   */
  listMandates (accessToken = this.config.accessToken) {
    return this.mandate.listMandates(accessToken);
  }

  /**
   * Deletes specific direct debit mandate
   * @param {string} mandateId - the unique mandate ID
   * @param {string} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  deleteMandate (mandateId, accessToken = this.config.accessToken) {
    return this.mandate.deleteMandate(mandateId, accessToken);
  }

  /**
   * Gets the customer's balance
   * @param {string=} accessToken - the oauth bearer token.  If not
   * specified, the accessToken on the options object is used.
   * @return {Promise} - the http request promise
   */
  getContacts (accessToken = this.config.accessToken) {
    return this.contact.getContacts(accessToken);
  }

  /**
   * Gets the customer's card
   * @param {string=} accessToken - the oauth bearer token.  If not
   * specified, the accessToken on the options object is used.
   * @return {Promise} - the http request promise
   */
  getCard (accessToken = this.config.accessToken) {
    return this.card.getCard(accessToken);
  }

  /**
   * Exchanges the authorization code for an access token
   * @param {string} authorizationCode - the authorization code, acquired from the user agent after the
   * user authenticates with starling
   * @return {Promise} - the http request promise
   */
  getAccessToken (authorizationCode) {
    return this.oAuth.getAccessToken(authorizationCode);
  }

  /**
   * Exchanges the authorization code for an access token
   * @param {string} refreshToken - the oauth refresh token, used to claim a new access token when the access token
   * expires. A new refresh token is also returned.
   * @return {Promise} - the http request promise
   */
  refreshAccessToken (refreshToken) {
    return this.oAuth.refreshAccessToken(refreshToken);
  }
}

module.exports = Starling;
