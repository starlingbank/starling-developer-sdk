import axios from 'axios'
import debug from 'debug'
import { struct } from '../utils/validator'

const ACCESS_TOKEN_GRANT_TYPE = 'authorization_code'
const REFRESH_TOKEN_GRANT_TYPE = 'refresh_token'

const log = debug('starling:oauth-service')

/**
 * Service to interact with a the oauth endpoint
 */
class OAuth {
  /**
   * Create a new oauth service
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options
  }

  /**
   * Exchanges the authorization code for an access token
   * @param {string} authorizationCode - the authorization code, acquired from the user agent after the user authenticates with starling
   * @return {Promise} - the http request promise
   */
  getAccessToken (authorizationCode) {
    return this.getOAuthToken({
      queryParams: {
        code: authorizationCode,
        grant_type: ACCESS_TOKEN_GRANT_TYPE,
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret,
        redirect_uri: this.options.redirectUri
      }
    })
  }

  /**
   * Exchanges the authorization code for an access token
   * @param {string} refreshToken - the oauth refresh token, used when the access token expires to claim a new access token.
   * @return {Promise} - the http request promise
   */
  refreshAccessToken (refreshToken) {
    return this.getOAuthToken({
      queryParams: {
        refresh_token: refreshToken,
        grant_type: REFRESH_TOKEN_GRANT_TYPE,
        client_id: this.options.clientId,
        client_secret: this.options.clientSecret
      }
    })
  }

  /**
   * Gets the access token from the starling OAuth endpoint
   * @param {string} parameters.apiUrl - the OAuth url
   * @param {object} parameters.queryParams - the query params passed to the OAuth endpoint as per the OAuth spec
   * @return {Promise} - the http request promise
   */
  getOAuthToken (parameters) {
    parameters = Object.assign({}, this.options, parameters)
    getOAuthTokenParameterValidator(parameters)
    const { apiUrl, queryParams } = parameters

    const url = `${apiUrl}/oauth/access-token`
    log(`POST ${url} queryParams:${JSON.stringify(queryParams)}`)

    return axios({
      url,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      params: queryParams
    })
  }
}

const getOAuthTokenParameterValidator = struct.interface({
  apiUrl: 'string',
  queryParams: struct.union([
    struct.object({
      client_id: 'string',
      client_secret: 'string',
      grant_type: struct.literal(ACCESS_TOKEN_GRANT_TYPE),
      code: 'string',
      redirect_uri: 'string'
    }),
    struct.object({
      client_id: 'string',
      client_secret: 'string',
      grant_type: struct.literal(REFRESH_TOKEN_GRANT_TYPE),
      refresh_token: 'string'
    })
  ])
})

module.exports = OAuth
