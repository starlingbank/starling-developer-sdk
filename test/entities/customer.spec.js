import nock from 'nock'
import expect from 'must'
import debug from 'debug'

import Starling from '../../src/starling'
import getCustomerResponse from '../responses/v1-get-customers.json'
import { expectAuthorizationHeader } from '../testSupport'

const log = debug('starling:customer-test')

describe('Customer', function () {
  this.timeout(30 * 1000)

  const accessToken = '0123456789'

  nock('http://localhost:8080', expectAuthorizationHeader(accessToken))
    .get('/api/v1/customers')
    .reply(200, getCustomerResponse)

  it('should retrieve the customer details', function (done) {
    const starlingCli = new Starling({
      apiUrl: 'http://localhost:8080'
    })

    starlingCli
      .getCustomer(accessToken)
      .then(function ({ data }) {
        expect(data.firstName).to.be('Sam')
        expect(data.lastName).to.be('Jones')
        expect(data.dateOfBirth).to.be('1982-11-24')
        expect(data.email).to.be('samjonese121666@gmail.com')

        log(JSON.stringify(data))

        done()
      }).catch(done)
  })
})
