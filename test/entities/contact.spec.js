import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'
import Starling from '../../src/starling'
import getContactsResponse from '../responses/v1-get-contacts.json'
import getContactAccountResponse from '../responses/v1-get-contact-account.json'

const log = debug('starling:contact-test')

describe('Contact', () => {
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v1/contacts')
    .reply(200, getContactsResponse)

  test('should retrieve the customer\'s contacts', done => {
    starlingCli
      .getContacts(accessToken)
      .then(function ({ data }) {
        const renato = data.contacts[0]
        expect(renato.id).toBe('fc17e7d5-ff2c-4a3c-8f64-9ac93d80de62')
        expect(renato.name).toBe('Renato')
        expect(renato.self.href).toBe('api/v1/contacts/fc17e7d5-ff2c-4a3c-8f64-9ac93d80de62')
        expect(renato.photo.href).toBe('api/v1/contacts/fc17e7d5-ff2c-4a3c-8f64-9ac93d80de62/photo')
        expect(renato.accounts.href).toBe('api/v1/contacts/fc17e7d5-ff2c-4a3c-8f64-9ac93d80de62/accounts')

        const carol = data.contacts[1]
        expect(carol.id).toBe('00609e17-80f8-4ffb-bd68-75d0cc6f1e86')
        expect(carol.name).toBe('Carol')

        log(JSON.stringify(data))

        done()
      })
  })

  const contactId = 'fc17e7d5-ff2c-4a3c-8f64-9ac93d80de62'

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get(`/api/v1/contacts/${contactId}/accounts`)
    .reply(200, getContactAccountResponse)

  test('should retrieve a specific contact\'s account details', done => {
    starlingCli
      .getContactAccount(accessToken, contactId)
      .then(function ({ data }) {
        const johnny = data.contactAccounts[0]
        expect(johnny.id).toBe('a47ace5b-41d5-4e51-b9cb-c3b493cb1696')
        expect(johnny.name).toBe('Johnny Boy')
        expect(johnny.self.href).toBe('api/v1/contacts/a47ace5b-41d5-4e51-b9cb-c3b493cb1696/accounts/a47ace5b-41d5-4e51-b9cb-c3b493cb1696')

        log(JSON.stringify(data))

        done()
      })
  })

  const name = 'Mickey Mouse'
  const accountType = '3'
  const accountNumber = '87654321'
  const sortCode = '60-83-71'
  const customerId = '2022a9c9-01fa-4c8d-ab19-daec80d7a111'

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .post('/api/v1/contacts')
    .reply(202)

  test('should create a new contact for the customer', done => {
    starlingCli
      .createContact(accessToken, name, accountType, accountNumber, sortCode, customerId)
      .then(function ({ status }) {
        expect(status).toBe(202)
        done()
      })
  })

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .delete(`/api/v1/contacts/${contactId}`)
    .reply(204)

  test('should delete the specified contact', done => {
    starlingCli
      .deleteContact(accessToken, contactId)
      .then(function ({ status }) {
        expect(status).toBe(204)
        done()
      })
  })
})
