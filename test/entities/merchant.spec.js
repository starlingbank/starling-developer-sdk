import nock from 'nock';
import expect from 'must';
import debug from 'debug';
import {expectAuthorizationHeader} from '../testSupport';

const log = debug('starling:merchant-test');

import Starling from '../../src/starling';
import getMerchantResponse from '../responses/v1-get-merchant.json';

describe('Merchant', function() {
  this.timeout(30 * 1000);
  const accessToken = '0123456789';

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  });

  let merchantUid = '32b4d093-f3b3-45da-9f89-d6a1395ab397';
  nock('http://localhost', expectAuthorizationHeader(accessToken))
      .get(`/api/v1/merchants/${merchantUid}`)
      .reply(200, getMerchantResponse);

  it('should retrieve the merchant\'s details', function(done) {
    starlingCli
      .getMerchant(accessToken, merchantUid)
      .then(function({data}) {
        expect(data.merchantUid).to.be(merchantUid);
        expect(data.name).to.be('Best Shop');
        expect(data.phoneNumber).to.be('020123456');
        expect(data.twitterUsername).to.be('bestshop');
        expect(data.website).to.be('http://www.bestshop.com');

        log(JSON.stringify(data));

        done();
      })
      .catch(done);
  });
});

