import nock from 'nock'
import debug from 'debug'
import Starling from '../src/starling'
import getAccessTokenResponse from './responses/v1-get-access-token.json'
import refreshAccessTokenResponse from './responses/v1-refresh-access-token.json'

const log = debug('starling:oauth-test')

describe('OAuth', () => {
  const starlingCli = new Starling({
    apiUrl: 'http://localhost',
    clientId: 'myclientid',
    clientSecret: 'myclientsecret',
    redirectUri: 'redirect'
  })

  test('should retrieve the access token', done => {
    nock('http://localhost', {
      reqHeaders: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .post('/oauth/access-token')
      .query(true)
      .reply(200, getAccessTokenResponse)

    starlingCli
      .oAuth
      .getAccessToken('code')
      .then(function ({ data }) {
        expect(data.access_token).toBe('moppccLmsNWYBSCdv7ZBgihY0sL2gvDtqXYPDPPEP9dbiSVBCUW74lgXafgb4Mbj')
        expect(data.refresh_token).toBe('11tyjapK8Vx3mBbCMkCrTmlbxjVRSny16MmbvGSvRlwhKYmFC4dbZetV0nTcXGjT')

        log(JSON.stringify(data))

        done()
      })
  })

  test('should refresh the access token', done => {
    nock('http://localhost', {
      reqHeaders: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .post('/oauth/access-token')
      .query(true)
      .reply(200, refreshAccessTokenResponse)

    starlingCli
      .oAuth
      .refreshAccessToken('11tyjapK8Vx3mBbCMkCrTmlbxjVRSny16MmbvGSvRlwhKYmFC4dbZetV0nTcXGjT')
      .then(function ({ data }) {
        expect(data.access_token).toBe('syerutdituyfhnofblyfdtrfnskrywfhendkruygrliflucftdgl4754535e')
        expect(data.refresh_token).toBe('esfknrtulsfadlwxfksybcdgvnlgublfi3w435678908765432456786543dfsd')

        log(JSON.stringify(data))

        done()
      })
  })
})
