import nock from 'nock';
import expect from 'must';
import debug from 'debug';
import {expectAuthorizationHeader} from '../testSupport';

const log = debug('starling:contact-test');

import Starling from '../../src/starling';
import getContactsResponse from '../responses/v1-get-contacts.json';
import getContactAccountResponse from '../responses/v1-get-contact-account.json';

describe('Contact', function() {
  this.timeout(30 * 1000);

  const accessToken = '0123456789';

  const starlingCli = new Starling({
    apiUrl: 'http://localhost:8080'
  });

  nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
      .get('/api/v1/contacts')
      .reply(200, getContactsResponse);

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


  const contactId = 'fc17e7d5-ff2c-4a3c-8f64-9ac93d80de62';

  nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
    .get(`/api/v1/contacts/${contactId}/accounts`)
    .reply(200, getContactAccountResponse);

  it('should retrieve a specific contact\'s account details', function(done) {
    starlingCli
      .getContactAccount(contactId, accessToken)
      .then(function({data}) {

        const johnny = data.contactAccounts[0];
        expect(johnny.id).to.be('a47ace5b-41d5-4e51-b9cb-c3b493cb1696');
        expect(johnny.name).to.be('Johnny Boy');
        expect(johnny.self.href).to.be('api/v1/contacts/a47ace5b-41d5-4e51-b9cb-c3b493cb1696/accounts/a47ace5b-41d5-4e51-b9cb-c3b493cb1696');

        log(JSON.stringify(data));

        done();
      })
      .catch(done);
  });


  const name = 'Mickey Mouse';
  const accountType = '3';
  const accountNumber = '87654321';
  const sortCode = '60-83-71';
  const customerId = '2022a9c9-01fa-4c8d-ab19-daec80d7a111';

  nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
    .post('/api/v1/contacts')
    .reply(202);

  it('should create a new contact for the customer', function(done) {
    starlingCli
      .createContact(name, accountType, accountNumber, sortCode, customerId, accessToken)
      .then(function({status}) {
        expect(status).to.be(202);
        done();
      })
      .catch(done);
  });

});
