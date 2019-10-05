import nock from 'nock'
import debug from 'debug'

import Starling from '../../src/starling'
import getCustomerResponse from '../responses/v1-get-customers.json'
import { expectAuthorizationHeader } from '../testSupport'

const log = debug('starling:customer-test')

describe('Customer', () => {
  const accessToken = '0123456789'

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get('/api/v1/customers')
    .reply(200, getCustomerResponse)

  test('should retrieve the customer details', done => {
    const starlingCli = new Starling({
      apiUrl: 'http://localhost'
    })

    starlingCli
      .getCustomer(accessToken)
      .then(function ({ data }) {
        expect(data.firstName).toBe('Sam')
        expect(data.lastName).toBe('Jones')
        expect(data.dateOfBirth).toBe('1982-11-24')
        expect(data.email).toBe('samjonese121666@gmail.com')

        log(JSON.stringify(data))

        done()
      })
  })
})
