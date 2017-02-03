import nock from 'nock';
import expect from 'must';
import debug from 'debug';
import {expectAuthorizationHeader} from './testSupport';

const log = debug('starling:transaction-test');

import Starling from '../src/starling';
import getTransactionsResponse from './responses/v1-get-transactions.json';
import getTransactionResponse from './responses/v1-get-transaction.json';

describe('Transaction', function() {
  this.timeout(30 * 1000);

  const accessToken = '0123456789';

  const starlingCli = new Starling({
    apiUrl: 'http://localhost:8080'
  });

  nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
      .get('/api/v1/transactions')
      .query({from: '2016-08-24', to: '2016-09-24'})
      .reply(200, getTransactionsResponse);

  it('should retrieve the customer\'s transaction history', function(done) {
    starlingCli
        .getTransactions('2016-08-24', '2016-09-24', accessToken)
        .then(function({data}) {

          const tx = data._embedded.transactions[0];
          expect(tx.id).to.be('f1cda25a-4060-4154-9b7f-fb871877dbab');
          expect(tx.currency).to.be('GBP');
          expect(tx.amount).to.be(-10);
          expect(tx.created).to.be('2016-11-21T12:38:32.79Z');
          expect(tx.balance).to.be(253);
          expect(tx.reference).to.be('i owe u');
          expect(tx.scheme).to.be('FASTER_PAYMENTS_OUT');

          log(JSON.stringify(data));

          done();
        })
        .catch(done);
  });

  it('should retrieve a specific customer transaction', function(done) {

    let transactionID = '32b4d093-f3b3-45da-9f89-d6a1395ab397';

    nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
        .get(`/api/v1/transactions/${transactionID}`)
        .reply(200, getTransactionResponse);

    starlingCli.getTransaction(transactionID, accessToken)
        .then(function({data}) {

          expect(data.currency).to.be('GBP');
          expect(data.tags).to.contain('food');
          expect(data.tags).to.contain('drink');
          expect(data.amount).to.be(-10);
          expect(data.created).to.be('2016-11-21T12:38:32.79Z');
          expect(data.reference).to.be('Coffee Merchant Inc.');
          expect(data.scheme).to.be('FASTER_PAYMENTS_OUT');
          expect(data.counterparty.accountName).to.be('Martin');
          expect(data.counterparty.accountNumber).to.be('00851145');
          expect(data.counterparty.sortCode).to.be('608371');

          log(JSON.stringify(data));

          done();
        })
        .catch(done);
  });
});
