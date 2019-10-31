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
   * Get basic information about the account holder
   * @param {string=} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolder (accessToken = this.config.accessToken) {
    return this.accountHolder.getAccountHolder(accessToken)
  }

  /**
   * Get the name of the account holder
   * @param {string=} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderName (accessToken = this.config.accessToken) {
    return this.accountHolder.getAccountHolderName(accessToken)
  }

  /**
   * Get an individual account holder's details
   * @param {string=} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderIndividual (accessToken = this.config.accessToken) {
    return this.accountHolder.getAccountHolderIndividual(accessToken)
  }

  /**
   * Get a joint account holder's details
   * @param {string=} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderJoint (accessToken = this.config.accessToken) {
    return this.accountHolder.getAccountHolderJoint(accessToken)
  }

  /**
   * Get a business account holder's details
   * @param {string=} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccountHolderBusiness (accessToken = this.config.accessToken) {
    return this.accountHolder.getAccountHolderBusiness(accessToken)
  }

  /**
   * Get an account holder's bank accounts
   * @param {string=} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getAccounts (accessToken = this.config.accessToken) {
    return this.account.getAccounts(accessToken)
  }

  /**
   * Get an account's bank identifiers
   * @param {string=} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @return {Promise} - the http request promise
   */
  getAccountIdentifiers (accessToken = this.config.accessToken, accountUid) {
    return this.account.getAccountIdentifiers(accessToken, accountUid)
  }

  /**
   * Get an account's balance
   * @param {string=} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @return {Promise} - the http request promise
   */
  getAccountBalance (accessToken = this.config.accessToken, accountUid) {
    return this.account.getAccountBalance(accessToken, accountUid)
  }

  /**
   * Get whether there are available funds for a requested amount
   * @param {string=} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @param {number} targetAmountInMinorUnits - the target amount in minor units
   * @return {Promise} - the http request promise
   */
  getConfirmationOfFunds (accessToken = this.config.accessToken, accountUid, targetAmountInMinorUnits) {
    return this.account.getConfirmationOfFunds(accessToken, accountUid, targetAmountInMinorUnits)
  }

  /**
   * Get list of statement periods which are available for an account
   * @param {string=} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @return {Promise} - the http request promise
   */
  getStatementPeriods (accessToken = this.config.accessToken, accountUid) {
    return this.account.getStatementPeriods(accessToken, accountUid)
  }

  /**
   * Download a statement for a given statement period
   * @param {string=} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @param {string=} yearMonth - the statement period's year month (yyyy-MM), defaults to current
   * @param {string=} format - one of 'application/pdf' or 'text/csv', defaults to 'text/csv'
   * @param {string=} responseType - the axios responseType for the request, defaults to 'stream'
   * @return {Promise} - the http request promise
   */
  getStatementForPeriod (accessToken = this.config.accessToken, accountUid, yearMonth = new Date().toISOString().slice(0, 7), format = 'text/csv', responseType = 'stream') {
    return this.account.getStatementForPeriod(accessToken, accountUid, yearMonth, format, responseType)
  }

  /**
   * Download a statement for a given date range
   * @param {string=} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @param {string} start - the beginning of the statement date range (yyyy-MM-dd)
   * @param {string=} end - the end of the statement date range (yyyy-MM-dd)
   * @param {string=} format - one of 'application/pdf' or 'text/csv', defaults to 'text/csv'
   * @param {string=} responseType - the axios responseType for the request, defaults to 'stream'
   * @return {Promise} - the http request promise
   */
  getStatementForRange (accessToken = this.config.accessToken, accountUid, start, end, format = 'text/csv', responseType = 'stream') {
    return this.account.getStatementForRange(accessToken, accountUid, start, end, format, responseType)
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
   * Get feed items created between two timestamps
   * @param {string=} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @param {string} categoryUid - the category uid
   * @param {string} minTransactionTimestamp - timestamp e.g. '2019-10-25T12:34:56.789Z'
   * @param {string} maxTransactionTimestamp - timestamp e.g. '2019-10-26T12:34:56.789Z'
   * @return {Promise} - the http request promise
   */
  getFeedItemsBetween (accessToken = this.config.accessToken, accountUid, categoryUid, minTransactionTimestamp, maxTransactionTimestamp) {
    return this.transaction.getFeedItemsBetween(accessToken, accountUid, categoryUid, minTransactionTimestamp, maxTransactionTimestamp)
  }

  /**
   * Get a feed item
   * @param {string=} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @param {string} categoryUid - the category uid
   * @param {string} feedItemUid - the feed item uid
   * @return {Promise} - the http request promise
   */
  getFeedItem (accessToken = this.config.accessToken, accountUid, categoryUid, feedItemUid) {
    return this.transaction.getFeedItem(accessToken, accountUid, categoryUid, feedItemUid)
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
   * Get all savings goals
   * @param {string=} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @return {Promise} - the http request promise
   */
  getSavingsGoals (accessToken = this.config.accessToken, accountUid) {
    return this.savingsGoals.getSavingsGoals(accessToken, accountUid)
  }

  /**
   * Get a specific savings goal
   * @param {string=} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @param {string} savingsGoalUid - the savings goal's uid
   * @return {Promise} - the http request promise
   */
  getSavingsGoal (accessToken = this.config.accessToken, accountUid, savingsGoalUid) {
    return this.savingsGoals.getSavingsGoal(accessToken, accountUid, savingsGoalUid)
  }

  /**
   * Add money to a savings goal
   * @param {string=} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @param {string} savingsGoalUid - the savings goal's uid
   * @param {string} transferUid - a transaction uid for this transaction
   * @param {number} amount - amount in the minor units of the given currency; eg pence in GBP, cents in EUR
   * @param {string=} currency - ISO-4217 3 character currency code, defaults to 'GBP'
   * @return {Promise} - the http request promise
   */
  addMoneyToSavingsGoal (accessToken = this.config.accessToken, accountUid, savingsGoalUid, transferUid, amount, currency = 'GBP') {
    return this.savingsGoals.addMoneyToSavingsGoal(
      accessToken,
      accountUid,
      savingsGoalUid,
      transferUid,
      amount,
      currency
    )
  }

  /**
   * Withdraw money from a savings goal
   * @param {string=} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @param {string} savingsGoalUid - the savings goal's uid
   * @param {string} transferUid - a transaction uid for this transaction
   * @param {number} amount - amount in the minor units of the given currency; eg pence in GBP, cents in EUR
   * @param {string=} currency - ISO-4217 3 character currency code, defaults to 'GBP'
   * @return {Promise} - the http request promise
   */
  withdrawMoneyFromSavingsGoal (accessToken = this.config.accessToken, accountUid, savingsGoalUid, transferUid, amount, currency = 'GBP') {
    return this.savingsGoals.withdrawMoneyFromSavingsGoal(
      accessToken,
      accountUid,
      savingsGoalUid,
      transferUid,
      amount,
      currency
    )
  }

  /**
   * Create a savings goal
   * @param {string=} accessToken - the oauth bearer token.
   * @param {string} accountUid - the account uid of the account to create the savings goal in
   * @param {string} name - the name of the new savings goal
   * @param {string=} currency - ISO-4217 3 character currency code, defaults to 'GBP'
   * @param {number=} targetAmount - the target amount in minor units (e.g. 1234 => £12.34), defaults to 0
   * @param {string=} targetCurrency - the target currency, as an ISO-4217 3 character currency code, defaults to 'GBP'
   * @param {string=} base64EncodedPhoto - base64 encoded image to associate with the goal
   * @return {Promise} - the http request promise
   */
  createSavingsGoal (accessToken = this.config.accessToken, accountUid, name, currency = 'GBP', targetAmount = 0, targetCurrency = 'GBP', base64EncodedPhoto) {
    return this.savingsGoals.createSavingsGoal(accessToken, accountUid, name, currency, targetAmount, targetCurrency, base64EncodedPhoto)
  }

  /**
   * Delete a savings goal
   * @param {string=} accessToken - the oauth bearer token
   * @param {string} accountUid - the account uid
   * @param {string} savingsGoalUid - the savings goal's uid
   * @return {Promise} - the http request promise
   */
  deleteSavingsGoal (accessToken = this.config.accessToken, accountUid, savingsGoalUid) {
    return this.savingsGoals.deleteSavingsGoal(accessToken, accountUid, savingsGoalUid)
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
