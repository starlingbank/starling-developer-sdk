import nock from 'nock';
import expect from 'must';
import debug from 'debug';
import {expectAuthorizationHeader} from './testSupport';

const log = debug('starling:contact-test');

import Starling from '../src/starling';
import getContactResponse from './responses/v1-get-contact.json';

describe('Contact', function() {
  this.timeout(30 * 1000);

  const accessToken = '0123456789';

  const starlingCli = new Starling({
    apiUrl: 'http://localhost:8080'
  });

  nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
      .get('/api/v1/contacts')
      .reply(200, getContactResponse);

  it('should retrieve the customer\'s contacts', function(done) {
    starlingCli
        .getContacts(accessToken)
        .then(function({data}) {

          const renato = data.contacts[0];
          expect(renato.id).to.be('fc17e7d5-ff2c-4a3c-8f64-9ac93d80de62');
          expect(renato.name).to.be('Renato');
          expect(renato.self.href).to.be('api/v1/contacts/fc17e7d5-ff2c-4a3c-8f64-9ac93d80de62');
          expect(renato.photo.href).to.be('api/v1/contacts/fc17e7d5-ff2c-4a3c-8f64-9ac93d80de62/photo');
          expect(renato.accounts.href).to.be('api/v1/contacts/fc17e7d5-ff2c-4a3c-8f64-9ac93d80de62/accounts');

          const carol = data.contacts[1];
          expect(carol.id).to.be('00609e17-80f8-4ffb-bd68-75d0cc6f1e86');
          expect(carol.name).to.be('Carol');

          log(JSON.stringify(data));

          done();
        })
        .catch(done);
  });

});
