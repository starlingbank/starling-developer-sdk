import nock from 'nock';
import expect from 'must';
import debug from 'debug';
import { expectAuthorizationHeader } from '../testSupport';
import Starling from '../../src/starling';
import getSavingsGoalResponse from '../responses/v1-get-savings-goal.json';
import listSavingsGoalsResponse from '../responses/v1-list-savings-goals.json';

const log = debug('starling:savings-goals-test');

describe('Savings Goals - ', function () {
  this.timeout(30 * 1000);

  const accessToken = '0123456789';
  const starlingCli = new Starling({
    apiUrl: 'http://localhost:8080'
  });

  const savingsGoalId = '12345-12345';
  const transactionId = '54321-54321';
  const minorAmount = 111;

  nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
    .get(`/api/v1/savings-goals/${savingsGoalId}`)
    .reply(200, getSavingsGoalResponse);

  it('should retrieve specified savings goal', function (done) {
    starlingCli
      .getSavingsGoal(accessToken, savingsGoalId)
      .then(function ({ data }) {

        expect(data.name).to.be('Trip to Paris');
        expect(data.target.minorUnits).to.be(123400);
        expect(data.target.currency).to.be('GBP');
        expect(data.totalSaved.minorUnits).to.be(12340);
        expect(data.totalSaved.currency).to.be('GBP');
        expect(data.savedPercentage).to.be(10);

        log(JSON.stringify(data));

        done();
      })
      .catch(done);
  });

  nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
    .get(`/api/v1/savings-goals`)
    .reply(200, listSavingsGoalsResponse);

  it('should list all savings goals', function (done) {
    starlingCli
      .listSavingsGoals(accessToken)
      .then(function ({ data }) {
        const paris = data.savingsGoalList[0];
        expect(paris.name).to.be('Trip to Paris');
        expect(paris.target.minorUnits).to.be(123400);
        expect(paris.target.currency).to.be('GBP');
        expect(paris.totalSaved.minorUnits).to.be(12340);
        expect(paris.totalSaved.currency).to.be('GBP');
        expect(paris.savedPercentage).to.be(10);

        const toy = data.savingsGoalList[1];
        expect(toy.name).to.be('Toy');
        expect(toy.target.minorUnits).to.be(35000);
        expect(toy.target.currency).to.be('GBP');
        expect(toy.totalSaved.minorUnits).to.be(10000);
        expect(toy.totalSaved.currency).to.be('GBP');
        expect(toy.savedPercentage).to.be(29);

        log(JSON.stringify(data));

        done();
      })
      .catch(done);
  });


  const name = 'Trip to Paris';
  const currency = 'GBP';
  const targetAmount = 123400;
  const targetCurrency = 'GBP';
  const base64EncodedPhoto = 'base64wqertyuihgfdzxfcgcvhg==';

  nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
    .put(`/api/v1/savings-goals/${savingsGoalId}`)
    .reply(202);

  it('should create a new savings goal', function (done) {
    starlingCli
      .createSavingsGoal(accessToken, savingsGoalId, name, currency, targetAmount, targetCurrency, base64EncodedPhoto)
      .then(function ({ status }) {
        expect(status).to.be(202);
        done();
      })
      .catch(done);
  });

  nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
    .delete(`/api/v1/savings-goals/${savingsGoalId}`)
    .reply(204);

  it('should delete the specified savings goal', function (done) {
    starlingCli
      .deleteSavingsGoal(accessToken, savingsGoalId)
      .then(function ({ status }) {
        expect(status).to.be(204);
        done();
      })
      .catch(done);
  });


  nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
    .put(
      `/api/v1/savings-goals/${savingsGoalId}/add-money/${transactionId}`,
      {
        "amount": {
          "currency": "GBP",
          "minorUnits": minorAmount
        }
      }
    )
    .reply(202);

  it('should add money to a specific goal', function (done) {
    starlingCli
      .addMoneyToSavingsGoal(accessToken, savingsGoalId, transactionId, minorAmount)
      .then(function ({ status }) {
        expect(status).to.be(202);
        done();
      })
      .catch(done);
  });

});
