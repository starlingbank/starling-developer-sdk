import nock from 'nock';
import debug from 'debug';
import Starling from '../src/starling';
import response from './responses/v1-get-access-token.json';
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

  nock('http://localhost', {
    reqHeaders: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .post('/oauth/access-token')
    .query(true)
    .reply(200, response);

  it('should retrieve the access token', function (done) {
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
});
