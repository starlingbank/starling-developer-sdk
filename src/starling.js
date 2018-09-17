import Customer from './entities/customer';
import Account from './entities/account';
import Address from './entities/address';
import Transaction from './entities/transaction';
import Card from './entities/card';
import OAuth from './entities/oauth';
import Contact from './entities/contact';
import Payment from './entities/payment';
import Mandate from './entities/mandate';
import SavingsGoals from './entities/savingsGoals';
import WhoAmI from './entities/whoAmI';

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

    this.whoAmI = new WhoAmI(this.config);
    this.customer = new Customer(this.config);
    this.account = new Account(this.config);
    this.address = new Address(this.config);
    this.transaction = new Transaction(this.config);
    this.payment = new Payment(this.config);
    this.mandate = new Mandate(this.config);
    this.contact = new Contact(this.config);
    this.card = new Card(this.config);
    this.savingsGoals = new SavingsGoals(this.config);
    this.oAuth = new OAuth(this.config);
  }

  /**
   * Gets the customer UUID and permissions corresponding to the access token passed
   * @param {string=} accessToken - the oauth bearer token.  If not
   * specified, the accessToken on the options object is used.
   * @return {Promise} - the http request promise
   */
  getMe (accessToken = this.config.accessToken) {
    return this.whoAmI.getMe(accessToken);
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
   * @param {string=} accessToken - the oauth bearer token.  If not
   * specified, the accessToken on the options object is used.
   * @param {string} fromDate - filter transactions after this date. Format: YYYY-MM-DD (optional,
   *   defaults to most recent 100 transactions)
   * @param {string} toDate - filter transactions before this date. Format: YYYY-MM-DD (optional,
   *   defaults to current date if not provided)
   * @param {string=} source - the transaction type (e.g. faster payments, mastercard).
   * If not specified, results are not filtered by source.
   * @return {Promise} - the http request promise
   */
  getTransactions (accessToken = this.config.accessToken, fromDate, toDate, source) {
    return this.transaction.getTransactions(accessToken, fromDate, toDate, source);
  }

  /**
   * Gets the full details of a single transaction
   * @param {string=} accessToken - the oauth bearer token.  If not
   * specified, the accessToken on the options object is used.
   * @param {string} transactionId - the unique transaction ID
   * @param {string=} source - the transaction type (e.g. faster payments, mastercard).
   * If not specified, only generic transaction information will be returned.
   * @return {Promise} - the http request promise
   */
  getTransaction (accessToken = this.config.accessToken, transactionId, source) {
    return this.transaction.getTransaction(accessToken, transactionId, source);
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
   * Gets a specific direct debit mandate
   * @param {string} accessToken - the oauth bearer token.
   * @param {string} mandateId - the unique mandate ID
   * @return {Promise} - the http request promise
   */
  getMandate (accessToken = this.config.accessToken, mandateId) {
    return this.mandate.getMandate(accessToken, mandateId);
  }

  /**
   * Deletes specific direct debit mandate
   * @param {string} accessToken - the oauth bearer token.
   * @param {string} mandateId - the unique mandate ID
   * @return {Promise} - the http request promise
   */
  deleteMandate (accessToken = this.config.accessToken, mandateId) {
    return this.mandate.deleteMandate(accessToken, mandateId);
  }

  /**
   * Lists the customer's scheduled payments
   * @param {string} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  listScheduledPayments (accessToken = this.config.accessToken) {
    return this.payment.listScheduledPayments(accessToken);
  }

  /**
   * Makes a payment on behalf of the customer to another UK bank account using the Faster Payments network
   * @param {string} accessToken - the oauth bearer token.
   *  @param {string} destinationAccountUid - the account identifier of the recipient
   * @param {string} reference - The payment reference, max. 18 characters.
   * @param {string} amount - the amount to be send.
   * @param {string=} currency - the currency, optional, defaults to "GBP".
   * @return {Promise} - the http request promise
   */
  makeLocalPayment (accessToken = this.config.accessToken, destinationAccountUid, reference, amount, currency = 'GBP') {
    return this.payment.makeLocalPayment(accessToken, destinationAccountUid, reference, amount, currency);
  }

  /**
   * Gets the customer's contacts (payees)
   * @param {string} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getContacts (accessToken = this.config.accessToken) {
    return this.contact.getContacts(accessToken);
  }

  /**
   * Gets a specific contact (payee)
   * @param {string} accessToken - the oauth bearer token.
   * @param {string} contactId - the contact's ID.
   * @return {Promise} - the http request promise
   */
  getContactAccount (accessToken = this.config.accessToken, contactId) {
    return this.contact.getContactAccount(accessToken, contactId);
  }

  /**
   * Creates a contact (payee) for the customer
   * @param {string} accessToken - the oauth bearer token.
   * @param {string} name - the name of the new contact.
   * @param {string=} accountType - the account type (domestic or international), optional and defaults to
   *   UK_ACCOUNT_AND_SORT_CODE.
   * @param {string} accountNumber - the contact's bank account number.
   * @param {string} sortCode - the contact's sort code.
   * @param {string} customerId - the customer's ID.
   * @return {Promise} - the http request promise
   */
  createContact (accessToken = this.config.accessToken, name, accountType = 'UK_ACCOUNT_AND_SORT_CODE', accountNumber, sortCode, customerId) {
    return this.contact.createContact(accessToken, name, accountType, accountNumber, sortCode, customerId);
  }

  deleteContact (accessToken, contactId) {
    return this.contact.deleteContact(accessToken, contactId);
  }

  /**
   * Gets a list of the customer's savings goals
   * @param {string} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  listSavingsGoals (accessToken = this.config.accessToken) {
    return this.savingsGoals.listSavingsGoals(accessToken);
  }

  /**
   * Gets a specific savings goal
   * @param {string} accessToken - the oauth bearer token.
   * @param {string} savingsGoalId - the savings goal's ID.
   * @return {Promise} - the http request promise
   */
  getSavingsGoal (accessToken = this.config.accessToken, savingsGoalId) {
    return this.savingsGoals.getSavingsGoal(accessToken, savingsGoalId);
  }

  /**
   * Add money to a specific savings goal
   * @param {string} accessToken - the oauth bearer token.
   * @param {string} savingsGoalId - the savings goal's ID.
   * @param {string} transactionId - a transaction ID for this transaction
   * @param {number} amount - an amount in minor unit
   * @return {Promise} - the http request promise
   */
  addMoneyToSavingsGoal (accessToken = this.config.accessToken, savingsGoalId, transactionId, amount, currency = 'GBP') {
    return this.savingsGoals.addMoneyToSavingsGoal(
      accessToken,
      savingsGoalId,
      transactionId,
      amount,
      currency
    );
  }

  /**
   * Creates a contact (payee) for the customer
   * @param {string} accessToken - the oauth bearer token.
   * @param {string} savingsGoalId - the savings goal's ID, generate one if creating a goal.
   * @param {string} name - the name of the new contact.
   * @param {string} currency - the currency of the savings goal. Defaults to 'GBP'.
   * @param {number} targetAmount - the target amount in minor units (e.g. 1234 => £12.34).
   * @param {string} targetCurrency - the target currency, also defaults to 'GBP'.
   * @param {string} base64EncodedPhoto - base64 encoded image to associate with the goal. (optional)
   * @return {Promise} - the http request promise
   */
  createSavingsGoal (accessToken = this.config.accessToken, savingsGoalId, name, currency = 'GBP',  targetAmount, targetCurrency = 'GBP', base64EncodedPhoto) {
    return this.savingsGoals.createSavingsGoal(accessToken, savingsGoalId, name, currency,  targetAmount, targetCurrency, base64EncodedPhoto);
  }

  /**
   * Deletes specific direct debit mandate
   * @param {string} accessToken - the oauth bearer token.
   * @param {string} savingsGoalId - the unique mandate ID
   * @return {Promise} - the http request promise
   */
  deleteSavingsGoal (accessToken, savingsGoalId) {
    return this.savingsGoals.deleteSavingsGoal(accessToken, savingsGoalId);
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
