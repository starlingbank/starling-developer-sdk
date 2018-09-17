import nock from 'nock';
import expect from 'must';
import debug from 'debug';
import {expectAuthorizationHeader} from '../testSupport';

const log = debug('starling:mandate-test');

import Starling from '../../src/starling';
import listMandatesResponse from '../responses/v1-list-mandates.json';
import getMandateResponse from '../responses/v1-get-mandate.json'

describe('List Mandates', function () {
  this.timeout(30 * 1000);

  const accessToken = '0123456789';

  const starlingCli = new Starling({
    apiUrl: 'http://localhost:8080'
  });


  it('should retrieve the customer\'s mandates', function (done) {

    nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
      .get('/api/v1/direct-debit/mandates')
      .reply(200, listMandatesResponse);

    starlingCli
      .listMandates(accessToken)
      .then(function ({data}) {
        const man = data._embedded.mandates[1];
        expect(man.uid).to.be('d645e090-d704-415e-84d6-e249f02aa642');
        expect(man.reference).to.be('18187876L02');
        expect(man.status).to.be('LIVE');
        expect(man.source).to.be('ELECTRONIC');
        expect(man.created).to.be('2017-02-02T09:05:15.771Z');
        expect(man.originatorName).to.be('ASSURANT DIRECT LTD');
        expect(man.originatorUid).to.be('3fd24317-2b24-4b6a-b8f9-3ab7f5ed00e0');
        log(JSON.stringify(data));
        done();
      })
      .catch(done);
  });

  const mandateId = '12345-12345';

  it('should get the specified mandate', function (done) {
    
        nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
        .get(`/api/v1/direct-debit/mandates/${mandateId}`)
        .reply(200, getMandateResponse);
    
        starlingCli
          .getMandate(accessToken, mandateId)
          .then(function ({ data }) {
            expect(data.uid).to.be("0931e8a3-7b4a-4c2d-9729-df2296dde98");
            expect(data.reference).to.be("747338448");
            expect(data.status).to.be("LIVE");
            expect(data.source).to.be("ELECTRONIC");
            expect(data.created).to.be("2017-02-21T08:53:26.144Z");
            expect(data.originatorName).to.be("AFFINITY WATER LTD");
            expect(data.originatorUid).to.be("c44adbfe-779b-4afe-b03f-a861db75ab78");
            log(JSON.stringify(data));
            done();
          })
          .catch(done);
      });

  it('should delete the specified mandate', function (done) {

    nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
    .delete(`/api/v1/direct-debit/mandates/${mandateId}`)
    .reply(204);

    starlingCli
      .deleteMandate(accessToken, mandateId)
      .then(function ({ status }) {
        expect(status).to.be(204);
        done();
      })
      .catch(done);
  });

});
