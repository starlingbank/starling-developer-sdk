import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import getAccountHolderResponse from '../responses/v2-get-account-holder.json'
import getAccountHolderNameResponse from '../responses/v2-get-account-holder-name.json'
import getAccountHolderIndividualResponse from '../responses/v2-get-account-holder-individual.json'
import getAccountHolderJointResponse from '../responses/v2-get-account-holder-joint.json'
import getAccountHolderBusinessResponse from '../responses/v2-get-account-holder-business.json'
import getAccountHolderBusinessRegisteredAddressResponse from '../responses/v2-get-account-holder-business-registered-address.json'
import getAccountHolderBusinessCorrespondenceAddressResponse from '../responses/v2-get-account-holder-business-correspondence-address.json'

const log = debug('starling:account-test')

describe('Account Holder', () => {
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v2/account-holder')
    .reply(200, getAccountHolderResponse)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v2/account-holder/name')
    .reply(200, getAccountHolderNameResponse)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v2/account-holder/individual')
    .reply(200, getAccountHolderIndividualResponse)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v2/account-holder/joint')
    .reply(200, getAccountHolderJointResponse)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v2/account-holder/business')
    .reply(200, getAccountHolderBusinessResponse)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v2/account-holder/business/registered-address')
    .reply(200, getAccountHolderBusinessRegisteredAddressResponse)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v2/account-holder/business/correspondence-address')
    .reply(200, getAccountHolderBusinessCorrespondenceAddressResponse)

  test('should get the account holder', done => {
    starlingCli
      .getAccountHolder(accessToken)
      .then(function ({ data }) {
        expect(data.accountHolderUid).toBe('a0be8f6a-faa9-40f8-a0b8-58205e722cd7')
        expect(data.accountHolderType).toBe('INDIVIDUAL')

        log(JSON.stringify(data))

        done()
      })
  })

  test('should get the account holder\'s name', done => {
    starlingCli
      .getAccountHolderName(accessToken)
      .then(function ({ data }) {
        expect(data.accountHolderName).toBe('Dave Bowman')

        log(JSON.stringify(data))

        done()
      })
  })

  test('should get an individual account holder', done => {
    starlingCli
      .getAccountHolderIndividual(accessToken)
      .then(function ({ data }) {
        expect(data.firstName).toBe('Dave')
        expect(data.lastName).toBe('Bowman')
        expect(data.dateOfBirth).toBe('1970-30-05')
        expect(data.email).toBe('dave.bowman@example.com')
        expect(data.phone).toBe('07700900123')

        log(JSON.stringify(data))

        done()
      })
  })

  test('should get a joint account holder', done => {
    starlingCli
      .getAccountHolderJoint(accessToken)
      .then(function ({ data }) {
        expect(data.accountHolderUid).toBe('a0be8f6a-faa9-40f8-a0b8-58205e722cd7')
        expect(data.personOne.firstName).toBe('Dave')
        expect(data.personOne.lastName).toBe('Bowman')
        expect(data.personOne.dateOfBirth).toBe('1970-30-05')
        expect(data.personOne.email).toBe('dave.bowman@example.com')
        expect(data.personOne.phone).toBe('07700900123')
        expect(data.personTwo.firstName).toBe('Betty')
        expect(data.personTwo.lastName).toBe('Bowman')
        expect(data.personTwo.dateOfBirth).toBe('1968-04-02')
        expect(data.personTwo.email).toBe('betty.bowman@example.com')
        expect(data.personTwo.phone).toBe('07700900321')

        log(JSON.stringify(data))

        done()
      })
  })

  test('should get a business account holder', done => {
    starlingCli
      .getAccountHolderBusiness(accessToken)
      .then(function ({ data }) {
        expect(data.companyName).toBe('Starling Bank')
        expect(data.companyRegistrationNumber).toBe('09092149')
        expect(data.email).toBe('help@starlingbank.com')
        expect(data.phone).toBe('02079304450')

        log(JSON.stringify(data))

        done()
      })
  })
})
