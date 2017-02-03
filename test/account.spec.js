import nock from 'nock';
import expect from 'must';
import debug from 'debug';
import {expectAuthorizationHeader} from './testSupport';

const log = debug('starling:account-test');

import Starling from '../src/starling';
import account from './responses/v1-get-accounts.json';

describe('Account', function() {
  this.timeout(30 * 1000);
  const accessToken = '0123456789';

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  });

  nock('http://localhost', expectAuthorizationHeader(accessToken))
      .get('/api/v1/accounts')
      .reply(200, account);

  it('should retrieve the customer\'s account details', function(done) {
    starlingCli
      .getAccount(accessToken)
      .then(function({data}) {
        expect(data.name).to.be('2027f9c9-08fa-4c8e-ab19-daec80d7a187 GBP');
        expect(data.number).to.be('95761014');
        expect(data.sortCode).to.be('608371');
        expect(data.currency).to.be('GBP');
        expect(data.iban).to.be('GB14SRLGGB2L60837195761014');
        expect(data.createdAt).to.be('2016-11-21T00:00:00Z');

        log(JSON.stringify(data));

        done();
      })
      .catch(done);
  });
});

