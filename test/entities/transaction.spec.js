import nock from 'nock';
import expect from 'must';
import debug from 'debug';
import {expectAuthorizationHeader} from '../testSupport';

const log = debug('starling:transaction-test');

import Starling from '../../src/starling';
import getTransactionsResponse from '../responses/v1-get-transactions.json';
import getTransactionResponse from '../responses/v1-get-transaction.json';
import getTransactionFpsInResponse from '../responses/v1-get-transaction-fps-in.json';
import getTransactionFpsOutResponse from '../responses/v1-get-transaction-fps-out.json';
import getTransactionCardResponse from '../responses/v1-get-transaction-card.json';

describe('GET Transaction(s)', function () {
  this.timeout(30 * 1000);

  const accessToken = '0123456789';

  const starlingCli = new Starling({
    apiUrl: 'http://localhost:8080'
  });


  it('should retrieve the customer\'s transaction history', function (done) {

    nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
      .get('/api/v1/transactions')
      .query({from: '2017-03-01', to: '2017-03-06'})
      .reply(200, getTransactionsResponse);

    starlingCli
      .getTransactions('2017-03-01', '2017-03-06', '', accessToken)
      .then(function ({data}) {
        const tx = data._embedded.transactions[1];
        expect(tx._links.detail.href).to.be('api/v1/transactions/mastercard/e336f58d-65ee-4248-84eb-ec4c88668f9e');
        expect(tx.id).to.be('e336f58d-65ee-4248-84eb-ec4c88668f9e');
        expect(tx.currency).to.be('GBP');
        expect(tx.amount).to.be(-23.75);
        expect(tx.direction).to.be('OUTBOUND');
        expect(tx.created).to.be('2017-03-06T12:39:54.712Z');
        expect(tx.reference).to.be('AMAZON EU');
        expect(tx.source).to.be('MASTER_CARD');
        expect(tx.balance).to.be(918.4);
        log(JSON.stringify(data));
        done();
      })
      .catch(done);
  });

  it('should retrieve a specific customer transaction w/o specifying source in path', function (done) {

    let transactionID = '32b4d093-f3b3-45da-9f89-d6a1395ab397';
    let noSource = '';

    nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
      .get(`/api/v1/transactions/${transactionID}`)
      .reply(200, getTransactionResponse);

    starlingCli.getTransaction(transactionID, noSource, accessToken)
      .then(function ({data}) {
        expect(data.id).to.be('32b4d093-f3b3-45da-9f89-d6a1395ab397');
        expect(data.currency).to.be('GBP');
        expect(data.amount).to.be(-10);
        expect(data.direction).to.be('OUTBOUND');
        expect(data.created).to.be('2017-03-06T12:45:23.036Z');
        expect(data.reference).to.be('Dinner');
        expect(data.source).to.be('FASTER_PAYMENTS_OUT');
        log(JSON.stringify(data));
        done();
      })
      .catch(done);
  });

  it('should retrieve a specific customer incoming fps transaction', function (done) {

    let transactionID = '3d532dfb-9b2f-4e6b-b004-e94fc86c30fe';
    let source = 'FASTER_PAYMENTS_IN';

    nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
      .get(`/api/v1/transactions/fps/in/${transactionID}`)
      .reply(200, getTransactionFpsInResponse);

    starlingCli.getTransaction(transactionID, source, accessToken)
      .then(function ({data}) {
        expect(data.id).to.be('3d532dfb-9b2f-4e6b-b004-e94fc86c30fe');
        expect(data.currency).to.be('GBP');
        expect(data.amount).to.be(954.23);
        expect(data.direction).to.be('INBOUND');
        expect(data.created).to.be('2017-03-06T12:39:52.68Z');
        expect(data.reference).to.be('Rent');
        expect(data.source).to.be('FASTER_PAYMENTS_IN');
        log(JSON.stringify(data));
        done();
      })
      .catch(done);
  });

  it('should retrieve a specific customer outbound fps transaction', function (done) {

    let transactionID = 'b5c65fd2-1795-4262-93f0-f0490759bf1f';
    let source = 'FASTER_PAYMENTS_OUT';

    nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
      .get(`/api/v1/transactions/fps/out/${transactionID}`)
      .reply(200, getTransactionFpsOutResponse);

    starlingCli.getTransaction(transactionID, source, accessToken)
      .then(function ({data}) {
        expect(data.id).to.be('b5c65fd2-1795-4262-93f0-f0490759bf1f');
        expect(data.currency).to.be('GBP');
        expect(data.amount).to.be(-36.01);
        expect(data.created).to.be('2017-03-02T12:39:54.936Z');
        expect(data.reference).to.be('Dinner');
        expect(data.source).to.be('FASTER_PAYMENTS_OUT');
        expect(data.receivingContactId).to.be('3bba29d4-35e5-4eb3-8aef-060ef526dcda');
        expect(data.receivingContactAccountId).to.be('3bba29d4-35e5-4eb3-8aef-060ef526dcda');
        expect(data.receivingContactAccount.href).to.be('api/v1/contacts/3bba29d4-35e5-4eb3-8aef-060ef526dcda/accounts/3bba29d4-35e5-4eb3-8aef-060ef526dcda');

        log(JSON.stringify(data));

        done();
      })
      .catch(done);
  });

  it('should retrieve a specific customer card transaction', function (done) {

    let transactionID = '77b7d507-6546-4301-a841-fbf570de65c6';
    let source = 'MASTER_CARD';

    nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
      .get(`/api/v1/transactions/mastercard/${transactionID}`)
      .reply(200, getTransactionCardResponse);

    starlingCli.getTransaction(transactionID, source, accessToken)
      .then(function ({data}) {
        expect(data.id).to.be('77b7d507-6546-4301-a841-fbf570de65c6');
        expect(data.currency).to.be('GBP');
        expect(data.amount).to.be(-15.15);
        expect(data.direction).to.be('OUTBOUND');
        expect(data.created).to.be('2017-01-06T12:39:54.246Z');
        expect(data.reference).to.be('PRET');
        expect(data.source).to.be('MASTER_CARD');
        expect(data.mastercardTransactionMethod).to.be('CHIP_AND_PIN');
        expect(data.status).to.be('SETTLED');
        expect(data.sourceAmount).to.be(-17.11);
        expect(data.sourceCurrency).to.be('EUR');
        log(JSON.stringify(data));
        done();
      })
      .catch(done);
  });

});
