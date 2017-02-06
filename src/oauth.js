import axios from 'axios';
import debug from 'debug';

const ACCESS_TOKEN_GRANT_TYPE = 'authorization_code';
const REFRESH_TOKEN_GRANT_TYPE = 'refresh_token';

const log = debug('starling:oauth-service');

/**
 * Service to interact with a the oauth endpoint
 */
class OAuth {

  /**
   * Create a new oauth service
   * @param {Object} options - configuration parameters
   */
  constructor (options) {
    this.options = options;
  }

  /**
   * Exchanges the authorization code for an access token
   * @param {string} authorizationCode - the authorization code, acquired from the user agent after the
   * user authenticates with starling
   * @return {Promise} - the http request promise
   */
  getAccessToken (authorizationCode) {
    return this.getOAuthToken({
      'code': authorizationCode,
      'grant_type': ACCESS_TOKEN_GRANT_TYPE,
      'client_id': this.options.clientId,
      'client_secret': this.options.clientSecret,
      'redirect_uri': this.options.redirectUri
    });
  }

  /**
   * Exchanges the authorization code for an access token
   * @param {string} refreshToken - the oauth refresh token, used when the access token
   * expires to claim a new access token.
   * @return {Promise} - the http request promise
   */
  refreshAccessToken (refreshToken) {
    return this.getOAuthToken({
      'refresh_token': refreshToken,
      'grant_type': REFRESH_TOKEN_GRANT_TYPE,
      'client_id': this.options.clientId,
      'client_secret': this.options.clientSecret
    });
  }

  /**
   * Gets the access token from the starling oauth endpoint
   * @param {object} params - the query params passed to the oauth endpoint as per the oauth spec
   * @return {Promise} - the http request promise
   */
  getOAuthToken (params) {
    if (!this.options.clientId) {
      throw Error('clientId is not configured');
    }

    if (!this.options.clientSecret) {
      throw Error('clientSecret is not configured');
    }

    const url = `${this.options.oauthUrl}/oauth/access-token`;
    log(`GET ${url} queryParams:${JSON.stringify(params)}`);

    return axios({
      url,
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      params: params
    });
  }
}

module.exports = OAuth;
