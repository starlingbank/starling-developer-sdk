import nock from 'nock';
import debug from 'debug';
import Starling from '../src/starling';
import getAccessTokenResponse from './responses/v1-get-access-token.json';
import refreshAccessTokenResponse from './responses/v1-refresh-access-token.json';
import expect from 'must';

const log = debug('starling:oauth-test');

describe('OAuth', function () {
  this.timeout(30 * 1000);

  const starlingCli = new Starling({
    oauthUrl: 'http://localhost',
    clientId: 'myclientid',
    clientSecret: 'myclientsecret',
    redirectUri: 'redirect'
  });

  it('should retrieve the access token', function (done) {
    nock('http://localhost', {
      reqHeaders: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .post('/oauth/access-token')
      .query(true)
      .reply(200, getAccessTokenResponse);

    starlingCli
      .getAccessToken('code')
      .then(function ({data}) {
        expect(data.access_token).to.be('moppccLmsNWYBSCdv7ZBgihY0sL2gvDtqXYPDPPEP9dbiSVBCUW74lgXafgb4Mbj');
        expect(data.refresh_token).to.be('11tyjapK8Vx3mBbCMkCrTmlbxjVRSny16MmbvGSvRlwhKYmFC4dbZetV0nTcXGjT');

        log(JSON.stringify(data));

        done();
      })
      .catch(done);
  });

  it('should refresh the access token', function (done) {
    nock('http://localhost', {
      reqHeaders: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .post('/oauth/access-token')
      .query(true)
      .reply(200, refreshAccessTokenResponse);

    starlingCli
      .refreshAccessToken('11tyjapK8Vx3mBbCMkCrTmlbxjVRSny16MmbvGSvRlwhKYmFC4dbZetV0nTcXGjT')
      .then(function ({data}) {
        expect(data.access_token).to.be('syerutdituyfhnofblyfdtrfnskrywfhendkruygrliflucftdgl4754535e');
        expect(data.refresh_token).to.be('esfknrtulsfadlwxfksybcdgvnlgublfi3w435678908765432456786543dfsd');

        log(JSON.stringify(data));

        done();
      })
      .catch(done);
  });

});
