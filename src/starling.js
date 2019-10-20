import Customer from './entities/customer'
import Account from './entities/account'
import AccountHolder from './entities/accountHolder'
import Address from './entities/address'
import Transaction from './entities/transaction'
import Card from './entities/card'
import OAuth from './entities/oauth'
import Payee from './entities/payee'
import Payment from './entities/payment'
import Mandate from './entities/mandate'
import SavingsGoals from './entities/savingsGoals'
import Identity from './entities/identity'
import Merchant from './entities/merchant'

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
    }

    this.config = Object.assign({}, defaults, options)

    this.merchant = new Merchant(this.config)
    this.identity = new Identity(this.config)
    this.customer = new Customer(this.config)
    this.accountHolder = new AccountHolder(this.config)
    this.account = new Account(this.config)
    this.address = new Address(this.config)
    this.transaction = new Transaction(this.config)
    this.payment = new Payment(this.config)
    this.mandate = new Mandate(this.config)
    this.payee = new Payee(this.config)
    this.card = new Card(this.config)
    this.savingsGoals = new SavingsGoals(this.config)
    this.oAuth = new OAuth(this.config)
  }

  /**
   * Get the current token identity
   * @param {string=} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getTokenIdentity (accessToken = this.config.accessToken) {
    return this.identity.getTokenIdentity(accessToken)
  }

  /**
   * Get the authorising individual's identity
   * @param {string=} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getAuthorisingIndividual (accessToken = this.config.accessToken) {
    return this.identity.getAuthorisingIndividual(accessToken)
  }

  /**
   * Gets the customer's details
   * @param {string=} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getCustomer (accessToken = this.config.accessToken) {
    return this.customer.getCustomer(accessToken)
  }

  /**
   * Get basic information about the account holder
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolder (accessToken = this.config.accessToken) {
    return this.accountHolder.getAccountHolder(accessToken)
  }

  /**
   * Get the name of the account holder
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderName (accessToken = this.config.accessToken) {
    return this.accountHolder.getAccountHolderName(accessToken)
  }

  /**
   * Get an individual account holder's details
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderIndividual (accessToken = this.config.accessToken) {
    return this.accountHolder.getAccountHolderIndividual(accessToken)
  }

  /**
   * Get a joint account holder's details
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderJoint (accessToken = this.config.accessToken) {
    return this.accountHolder.getAccountHolderJoint(accessToken)
  }

  /**
   * Get a business account holder's details
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderBusiness (accessToken = this.config.accessToken) {
    return this.accountHolder.getAccountHolderBusiness(accessToken)
  }

  /**
   * Gets the customer's account details
   * @param {string=} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getAccounts (accessToken = this.config.accessToken) {
    return this.account.getAccounts(accessToken)
  }

  /**
   * Gets the customer's balance
   * @param {string=} accessToken - the oauth bearer token.
   * @param {string} accountUid - the account uid
   * @return {Promise} - the http request promise
   */
  getBalance (accessToken = this.config.accessToken, accountUid) {
    return this.account.getBalance(accessToken, accountUid)
  }

  /**
   * Gets the customer's addresses (current and previous)
   * @param {string=} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getAddresses (accessToken = this.config.accessToken) {
    return this.address.getAddresses(accessToken)
  }

  /**
   * Gets the customer's transaction history
   * @param {string=} accessToken - the oauth bearer token.
   * @param {string=} fromDate - filter transactions after this date. Format: YYYY-MM-DD (defaults to most recent 100 transactions)
   * @param {string=} toDate - filter transactions before this date. Format: YYYY-MM-DD (defaults to current date if not provided)
   * @param {string=} source - the transaction type (e.g. faster payments, mastercard). If not specified, results are not filtered by source.
   * @return {Promise} - the http request promise
   */
  getTransactions (accessToken = this.config.accessToken, fromDate, toDate, source) {
    return this.transaction.getTransactions(accessToken, fromDate, toDate, source)
  }

  /**
   * Gets the full details of a single transaction
   * @param {string=} accessToken - the oauth bearer token.
   * @param {string} transactionId - the unique transaction ID
   * @param {string=} source - the transaction type (e.g. faster payments, mastercard).
   * If not specified, only generic transaction information will be returned.
   * @return {Promise} - the http request promise
   */
  getTransaction (accessToken = this.config.accessToken, transactionId, source) {
    return this.transaction.getTransaction(accessToken, transactionId, source)
  }

  /**
   * Retrieves a merchant
   * @param {string=} accessToken - the oauth bearer token
   * @param {string=} merchantUid - unique identifier of the merchant.
   * @return {Promise} - the http request promise
   */
  getMerchant (accessToken = this.config.accessToken, merchantUid) {
    return this.merchant.getMerchant(accessToken, merchantUid)
  }

  /**
   * Retrieves a merchant location of a merchant
   * @param {string=} accessToken - the oauth bearer token
   * @param {string=} merchantUid - unique identifier of the merchant the location belongs to.
   * @param {string=} merchantLocationUid - unique identifier of the location for the merchant.
   * @return {Promise} - the http request promise
   */
  getMerchantLocation (accessToken = this.config.accessToken, merchantUid, merchantLocationUid) {
    return this.merchant.getMerchantLocation(accessToken, merchantUid, merchantLocationUid)
  }

  /**
   * Gets the customer's current direct-debit mandates
   * @param {string=} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  listMandates (accessToken = this.config.accessToken) {
    return this.mandate.listMandates(accessToken)
  }

  /**
   * Gets a specific direct debit mandate
   * @param {string=} accessToken - the oauth bearer token.
   * @param {string} mandateId - the unique mandate ID
   * @return {Promise} - the http request promise
   */
  getMandate (accessToken = this.config.accessToken, mandateId) {
    return this.mandate.getMandate(accessToken, mandateId)
  }

  /**
   * Deletes specific direct debit mandate
   * @param {string=} accessToken - the oauth bearer token.
   * @param {string} mandateId - the unique mandate ID
   * @return {Promise} - the http request promise
   */
  deleteMandate (accessToken = this.config.accessToken, mandateId) {
    return this.mandate.deleteMandate(accessToken, mandateId)
  }

  /**
   * Get a payment order
   * @param {string=} accessToken - the oauth bearer token
   * @param {string} paymentOrderUid - the payment order uid
   * @return {Promise} - the http request promise
   */
  getPaymentOrder (accessToken = this.config.accessToken, paymentOrderUid) {
    return this.payment.getPaymentOrder(accessToken, paymentOrderUid)
  }

  /**
   * Get a payment order's payments
   * @param {string=} accessToken - the oauth bearer token
   * @param {string} paymentOrderUid - the payment order uid
   * @return {Promise} - the http request promise
   */
  getPaymentOrderPayments (accessToken = this.config.accessToken, paymentOrderUid) {
    return this.payment.getPaymentOrderPayments(accessToken, paymentOrderUid)
  }

  /**
   * List standing orders
   * @param {string=} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid of the account to get standing orders of
   * @param {string} categoryUid - the category uid of the category to get standing orders of
   * @return {Promise} - the http request promise
   */
  listStandingOrders (accessToken = this.config.accessToken, accountUid, categoryUid) {
    return this.payment.listStandingOrders(accessToken, accountUid, categoryUid)
  }

  /**
   * Get a standing order
   * @param {string=} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid of the standing order
   * @param {string} categoryUid - the category uid of the standing order
   * @param {string} paymentOrderUid - the payment order uid of the standing order
   * @return {Promise} - the http request promise
   */
  getStandingOrder (accessToken = this.config.accessToken, accountUid, categoryUid, paymentOrderUid) {
    return this.payment.getStandingOrder(accessToken, accountUid, categoryUid, paymentOrderUid)
  }

  /**
   * Get an account holder's payees
   * @param {string=} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getPayees (accessToken = this.config.accessToken) {
    return this.payee.getPayees(accessToken)
  }

  /**
   * Create a payee
   * @param {string=} accessToken - the oauth bearer token.
   * @param {Object} payeeCreationRequest - the payee creation request.
   * @param {string} payeeCreationRequest.payeeName - the name of the new payee.
   * @param {string=} payeeCreationRequest.phoneNumber - the phone number of the new payee.
   * @param {string} payeeCreationRequest.payeeType - the payee type of the new payee.
   * @param {string=} payeeCreationRequest.firstName - the first name of the new payee.
   * @param {string=} payeeCreationRequest.middleName - the middle name of the new payee.
   * @param {string=} payeeCreationRequest.lastName - the last name of the new payee.
   * @param {string=} payeeCreationRequest.businessName - the business name of the new payee.
   * @param {string=} payeeCreationRequest.dateOfBirth - the date of birth of the new payee.
   * @param {Object[]=} payeeCreationRequest.accounts - the new payee's accounts, a list of payee account creation requests.
   * @param {string} payeeCreationRequest.accounts[].description - the account description.
   * @param {boolean} payeeCreationRequest.accounts[].defaultAccount - whether this is the default account for the new payee.
   * @param {string} payeeCreationRequest.accounts[].countryCode - the country code for the account (ISO 3166-1 alpha-2).
   * @param {string} payeeCreationRequest.accounts[].accountIdentifier - the account identifier.
   * @param {string} payeeCreationRequest.accounts[].bankIdentifier - the bank identifier.
   * @param {string} payeeCreationRequest.accounts[].bankIdentifierType - the bank identifier type.
   * @return {Promise} - the http request promise
   */
  createPayee (accessToken = this.config.accessToken, payeeCreationRequest) {
    return this.payee.createPayee(accessToken, payeeCreationRequest)
  }

  /**
   * Delete an account holder's payee
   * @param {string=} accessToken - the oauth bearer token.
   * @param {string} payeeUid - the payeeUid of the payee to be deleted.
   * @return {Promise} - the http request promise
   */
  deletePayee (accessToken = this.config.accessToken, payeeUid) {
    return this.payee.deletePayee(accessToken, payeeUid)
  }

  /**
   * Gets a list of the customer's savings goals
   * @param {string=} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  listSavingsGoals (accessToken = this.config.accessToken) {
    return this.savingsGoals.listSavingsGoals(accessToken)
  }

  /**
   * Gets a specific savings goal
   * @param {string=} accessToken - the oauth bearer token.
   * @param {string} savingsGoalId - the savings goal's ID.
   * @return {Promise} - the http request promise
   */
  getSavingsGoal (accessToken = this.config.accessToken, savingsGoalId) {
    return this.savingsGoals.getSavingsGoal(accessToken, savingsGoalId)
  }

  /**
   * Add money to a specific savings goal
   * @param {string=} accessToken - the oauth bearer token.
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
    )
  }

  /**
   * Create a savings goal
   * @param {string=} accessToken - the oauth bearer token.
   * @param {string} savingsGoalId - the savings goal's ID, generate one if creating a goal.
   * @param {string} name - the name of the new savings goal.
   * @param {string=} currency - the currency of the savings goal. Defaults to 'GBP'.
   * @param {number} targetAmount - the target amount in minor units (e.g. 1234 => £12.34).
   * @param {string=} targetCurrency - the target currency, also defaults to 'GBP'.
   * @param {string=} base64EncodedPhoto - base64 encoded image to associate with the goal.
   * @return {Promise} - the http request promise
   */
  createSavingsGoal (accessToken = this.config.accessToken, savingsGoalId, name, currency = 'GBP', targetAmount, targetCurrency = 'GBP', base64EncodedPhoto) {
    return this.savingsGoals.createSavingsGoal(accessToken, savingsGoalId, name, currency, targetAmount, targetCurrency, base64EncodedPhoto)
  }

  /**
   * Delete a savings goal
   * @param {string=} accessToken - the oauth bearer token.
   * @param {string} savingsGoalId - the savings goal id
   * @return {Promise} - the http request promise
   */
  deleteSavingsGoal (accessToken = this.config.accessToken, savingsGoalId) {
    return this.savingsGoals.deleteSavingsGoal(accessToken, savingsGoalId)
  }

  /**
   * Get all the cards for an account holder
   * @param {string=} accessToken - the oauth bearer token.
   * @return {Promise} - the http request promise
   */
  getCards (accessToken = this.config.accessToken) {
    return this.card.getCards(accessToken)
  }

  /**
   * Exchanges the authorization code for an access token
   * @param {string} authorizationCode - the authorization code, acquired from the user agent after the
   * user authenticates with starling
   * @return {Promise} - the http request promise
   */
  getAccessToken (authorizationCode) {
    return this.oAuth.getAccessToken(authorizationCode)
  }

  /**
   * Exchanges the authorization code for an access token
   * @param {string} refreshToken - the oauth refresh token, used to claim a new access token when the access token
   * expires. A new refresh token is also returned.
   * @return {Promise} - the http request promise
   */
  refreshAccessToken (refreshToken) {
    return this.oAuth.refreshAccessToken(refreshToken)
  }
}

module.exports = Starling
