import axios from 'axios'
import debug from 'debug'
import { defaultHeaders, payloadHeaders } from '../utils/http'
import { typeValidation } from '../utils/validator'

const log = debug('starling:card-service')

/**
 * Service to interact with a customer card
 */
class Card {
  /**
   * Creates an instance of the client's card
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Get all the cards for an account holder
   * @param {string} accessToken - the oauth bearer token
   * @return {Promise} - the http request promise
   */
  getCards (accessToken) {
    typeValidation(arguments, getCardsParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/cards`
    log(`GET ${url}`)

    return axios({
      method: 'GET',
      url,
      headers: defaultHeaders(accessToken)
    })
  }

  /**
   * Update card lock
   * @param {string} accessToken - the oauth bearer token
   * @param {string} cardUid - the card uid
   * @param {boolean} enabled - Whether the card should be locked. Set to false to lock, true to unlock.
   * @return {Promise} - the http request promise
   */
  updateCardLock (accessToken, cardUid, enabled) {
    return this.updateCardControl(accessToken, cardUid, enabled, 'enabled')
  }

  /**
   * Update ATM withdrawal control
   * @param {string} accessToken - the oauth bearer token
   * @param {string} cardUid - the card uid
   * @param {boolean} enabled - Whether ATM withdrawals should be allowed. Set to false to block, true to allow.
   * @return {Promise} - the http request promise
   */
  updateCardATMControl (accessToken, cardUid, enabled) {
    return this.updateCardControl(accessToken, cardUid, enabled, 'atm-enabled')
  }

  /**
   * Update online payments control
   * @param {string} accessToken - the oauth bearer token
   * @param {string} cardUid - the card uid
   * @param {boolean} enabled - Whether online payments should be allowed. Set to false to block, true to allow.
   * @return {Promise} - the http request promise
   */
  updateCardOnlineControl (accessToken, cardUid, enabled) {
    return this.updateCardControl(accessToken, cardUid, enabled, 'online-enabled')
  }

  /**
   * Update mobile wallet payments control
   * @param {string} accessToken - the oauth bearer token
   * @param {string} cardUid - the card uid
   * @param {boolean} enabled - Whether mobile wallet payments should be allowed. Set to false to block, true to allow.
   * @return {Promise} - the http request promise
   */
  updateCardMobileWalletControl (accessToken, cardUid, enabled) {
    return this.updateCardControl(accessToken, cardUid, enabled, 'mobile-wallet-enabled')
  }

  /**
   * Update gambling payments control
   * @param {string} accessToken - the oauth bearer token
   * @param {string} cardUid - the card uid
   * @param {boolean} enabled - Whether gambling payments should be allowed. Set to false to block, true to allow.
   * @return {Promise} - the http request promise
   */
  updateCardGamblingControl (accessToken, cardUid, enabled) {
    return this.updateCardControl(accessToken, cardUid, enabled, 'gambling-enabled')
  }

  /**
   * Update card present payments (contactless and chip and pin) control
   * @param {string} accessToken - the oauth bearer token
   * @param {string} cardUid - the card uid
   * @param {boolean} enabled - Whether card present payments (contactless and chip and pin) should be allowed. Set to false to block, true to allow.
   * @return {Promise} - the http request promise
   */
  updateCardPresentControl (accessToken, cardUid, enabled) {
    return this.updateCardControl(accessToken, cardUid, enabled, 'pos-enabled')
  }

  /**
   * Update magstripe payments control
   * @param {string} accessToken - the oauth bearer token
   * @param {string} cardUid - the card uid
   * @param {boolean} enabled - Whether magstripe payments should be allowed. Set to false to block, true to allow.
   * @return {Promise} - the http request promise
   */
  updateCardMagstripeControl (accessToken, cardUid, enabled) {
    return this.updateCardControl(accessToken, cardUid, enabled, 'mag-stripe-enabled')
  }

  /**
   * Update a card control
   * @param {string} accessToken - the oauth bearer token
   * @param {string} cardUid - the card uid
   * @param {boolean} enabled - Whether the control should be should be locked. Set to false to lock, true to unlock.
   * @param {string} endpoint - the last segment of the endpoint name
   * @return {Promise} - the http request promise
   */
  updateCardControl (accessToken, cardUid, enabled, endpoint) {
    typeValidation(arguments, updateCardControlParameterDefinition)
    const url = `${this.options.apiUrl}/api/v2/cards/${cardUid}/controls/${endpoint}`
    log(`PUT ${url}`)

    return axios({
      method: 'PUT',
      url,
      headers: payloadHeaders(accessToken),
      data: JSON.stringify({ enabled })
    })
  }
}

const getCardsParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] }
]

const updateCardControlParameterDefinition = [
  { name: 'accessToken', validations: ['required', 'string'] },
  { name: 'cardUid', validations: ['required', 'string'] },
  { name: 'enabled', validations: ['required', 'boolean'] }
]

module.exports = Card
