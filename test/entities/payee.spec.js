import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'
import Starling from '../../src/starling'
import getPayeesResponse from '../responses/v2-get-payees.json'
import putPayeeResponse from '../responses/v2-put-payee.json'

const log = debug('starling:payee-test')

describe('Payee', () => {
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v2/payees')
    .reply(200, getPayeesResponse)

  test('should retrieve the customer\'s payees', done => {
    starlingCli
      .payee
      .getPayees({ accessToken })
      .then(function ({ data }) {
        expect(data.payees).toHaveLength(2)

        const bob = data.payees[0]
        expect(bob.payeeUid).toBe('8cdab926-1d16-46a7-b4a9-6cb38f0c9b49')
        expect(bob.payeeName).toBe('Bob\'s accounts')
        expect(bob.phoneNumber).toBe('+447700900123')
        expect(bob.payeeType).toBe('INDIVIDUAL')
        expect(bob.firstName).toBe('Bob')
        expect(bob.middleName).toBe('Bobity')
        expect(bob.lastName).toBe('Bobbington')
        expect(bob.accounts).toHaveLength(2)

        const bobBusiness = bob.accounts[0]
        expect(bobBusiness.payeeAccountUid).toBe('fc17e7d5-ff2c-4a3c-8f64-9ac93d80de62')
        expect(bobBusiness.description).toBe('Bob\'s business account')
        expect(bobBusiness.defaultAccount).toBe(true)
        expect(bobBusiness.countryCode).toBe('GB')
        expect(bobBusiness.accountIdentifier).toBe('12345678')
        expect(bobBusiness.bankIdentifier).toBe('123456')
        expect(bobBusiness.bankIdentifierType).toBe('SORT_CODE')

        const bobPersonal = bob.accounts[1]
        expect(bobPersonal.payeeAccountUid).toBe('00609e17-80f8-4ffb-bd68-75d0cc6f1e86')
        expect(bobPersonal.description).toBe('Bob\'s personal account')
        expect(bobPersonal.defaultAccount).toBe(false)
        expect(bobPersonal.countryCode).toBe('GB')
        expect(bobPersonal.accountIdentifier).toBe('87654321')
        expect(bobPersonal.bankIdentifier).toBe('654321')
        expect(bobPersonal.bankIdentifierType).toBe('SORT_CODE')

        const carol = data.payees[1]
        expect(carol.payeeUid).toBe('ac566df6-dd27-422f-a21f-c2841492fac4')
        expect(carol.payeeName).toBe('Carol')
        expect(carol.accounts).toHaveLength(1)
        expect(carol.accounts[0].payeeAccountUid).toBe('4afcf1c7-1faa-41db-acf6-ce37ef7e6c9c')

        log(JSON.stringify(data))

        done()
      })
  })

  const payeeUid = 'fc17e7d5-ff2c-4a3c-8f64-9ac93d80de62'
  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .put('/api/v2/payees')
    .reply(200, putPayeeResponse)

  test('should create a new payee', done => {
    starlingCli
      .payee
      .createPayee({
        accessToken,
        payeeCreationRequest: {
          payeeName: 'Mickey Mouse',
          payeeType: 'INDIVIDUAL',
          firstName: 'Mickey',
          lastName: 'Mouse',
          accounts: [
            {
              description: 'Mickey\'s main account',
              defaultAccount: true,
              countryCode: 'GB',
              accountIdentifier: '12345678',
              bankIdentifier: '123456',
              bankIdentifierType: 'SORT_CODE'
            }
          ]
        }
      })
      .then(function ({ data, status }) {
        expect(status).toBe(200)

        expect(data.payeeUid).toBe(payeeUid)
        expect(data.success).toBe(true)
        expect(data.errors).toHaveLength(0)

        log(JSON.stringify(data))

        done()
      })
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .delete(`/api/v2/payees/${payeeUid}`)
    .reply(200)

  test('should delete the specified payee', done => {
    starlingCli
      .payee
      .deletePayee({ accessToken, payeeUid })
      .then(function ({ status }) {
        expect(status).toBe(200)
        done()
      })
  })
})
