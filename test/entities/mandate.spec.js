import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import getMandatesResponse from '../responses/v2-get-mandates.json'
import getMandateResponse from '../responses/v2-get-mandate.json'

const log = debug('starling:mandate-test')

describe('List Mandates', () => {
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  const mandateUid = 'd63cd8a9-bb4c-4ec4-9e8c-8a7e6cf48a85'

  test('should retrieve the customer\'s mandates', done => {
    nock('http://localhost', expectAuthorizationHeader(accessToken))
      .get('/api/v2/direct-debit/mandates')
      .reply(200, getMandatesResponse)

    starlingCli
      .listMandates(accessToken)
      .then(function ({ data }) {
        expect(data.mandates).toHaveLength(1)
        expect(data.mandates[0].uid).toBe(mandateUid)
        expect(data.mandates[0].reference).toBe('Volcano Insurance')
        expect(data.mandates[0].status).toBe('LIVE')
        expect(data.mandates[0].source).toBe('ELECTRONIC')
        expect(data.mandates[0].created).toBe('2017-09-04T16:19:38.867Z')
        expect(data.mandates[0].cancelled).toBe('2017-09-04T16:22:02.527Z')
        expect(data.mandates[0].originatorName).toBe('ANTIQUARIES')
        expect(data.mandates[0].originatorUid).toBe('dfac6a0f-780a-4632-af6f-e9b9f341c2c6')
        expect(data.mandates[0].merchantUid).toBe('778b36c9-f07d-4f95-87ca-c4e57afc2cd1')

        log(JSON.stringify(data))

        done()
      })
  })

  test('should get the specified mandate', done => {
    nock('http://localhost', expectAuthorizationHeader(accessToken))
      .get(`/api/v2/direct-debit/mandates/${mandateUid}`)
      .reply(200, getMandateResponse)

    starlingCli
      .getMandate(accessToken, mandateUid)
      .then(function ({ data }) {
        expect(data.uid).toBe(mandateUid)
        expect(data.reference).toBe('Volcano Insurance')
        expect(data.status).toBe('LIVE')
        expect(data.source).toBe('ELECTRONIC')
        expect(data.created).toBe('2017-09-04T16:19:38.867Z')
        expect(data.cancelled).toBe('2017-09-04T16:22:02.527Z')
        expect(data.originatorName).toBe('ANTIQUARIES')
        expect(data.originatorUid).toBe('dfac6a0f-780a-4632-af6f-e9b9f341c2c6')
        expect(data.merchantUid).toBe('778b36c9-f07d-4f95-87ca-c4e57afc2cd1')

        log(JSON.stringify(data))

        done()
      })
  })

  test('should delete the specified mandate', done => {
    nock('http://localhost', expectAuthorizationHeader(accessToken))
      .delete(`/api/v2/direct-debit/mandates/${mandateUid}`)
      .reply(204)

    starlingCli
      .deleteMandate(accessToken, mandateUid)
      .then(function ({ status }) {
        expect(status).toBe(204)
        done()
      })
  })
})
