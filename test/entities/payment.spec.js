import nock from 'nock';
import expect from 'must';
import debug from 'debug';
import {expectAuthorizationHeader} from '../testSupport';
import Starling from '../../src/starling';
import listScheduledPaymentsResponse from '../responses/v1-list-scheduled-payments.json';

const log = debug('starling:payment-test');

describe('Payments', function () {
  this.timeout(30 * 1000);

  const accessToken = '0123456789';

  const starlingCli = new Starling({
    apiUrl: 'http://localhost:8080'
  });


  const destinationAccountId = '11eb8d9b-386a-43ba-825d-7edee5c6b01a';
  const reference = 'Dinner';
  const amount = '10';

  nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
    .post('/api/v1/payments/local')
    .reply(202);

  it('should instruct a payment on the customer\'s behalf', function (done) {
    starlingCli
      .makeLocalPayment(accessToken, destinationAccountId, reference, amount)
      .then(function ({status}) {
        expect(status).to.be(202);
        done();
      })
      .catch(done);
  });


  it('should retrieve the customer\'s scheduled payments', function (done) {

    nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
      .get('/api/v1/payments/scheduled')
      .reply(200, listScheduledPaymentsResponse);

    starlingCli
      .listScheduledPayments(accessToken)
      .then(function ({data}) {
        const pay = data._embedded.paymentOrders[0];
        expect(pay.paymentOrderId).to.be('3135f1f998-e5a9-452b-842c-a7c6417f9ae8');
        expect(pay.receivingContactAccountId).to.be('11eb8d9b-386a-43ba-825d-7edee5c6b01a');
        expect(pay.reference).to.be('Spring Cleaning');
        expect(pay.recurrenceRule.startDate).to.be('2017-03-30');
        expect(pay.recurrenceRule.frequency).to.be('WEEKLY');
        expect(pay.recurrenceRule.interval).to.be(1);
        expect(pay.recurrenceRule.untilDate).to.be('2017-04-13');
        expect(pay.recurrenceRule.days[0]).to.be('THURSDAY');
        expect(pay.paymentType).to.be('STANDING_ORDER');
        log(JSON.stringify(data));
        done();
      })
      .catch(done);
  });

});
