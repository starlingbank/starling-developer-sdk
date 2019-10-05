import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import listMandatesResponse from '../responses/v1-list-mandates.json'
import getMandateResponse from '../responses/v1-get-mandate.json'

const log = debug('starling:mandate-test')

describe('List Mandates', () => {
  const accessToken = '0123456789'

  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })

  test('should retrieve the customer\'s mandates', done => {
    nock('http://localhost', expectAuthorizationHeader(accessToken))
      .get('/api/v1/direct-debit/mandates')
      .reply(200, listMandatesResponse)

    starlingCli
      .listMandates(accessToken)
      .then(function ({ data }) {
        const man = data._embedded.mandates[1]
        expect(man.uid).toBe('d645e090-d704-415e-84d6-e249f02aa642')
        expect(man.reference).toBe('18187876L02')
        expect(man.status).toBe('LIVE')
        expect(man.source).toBe('ELECTRONIC')
        expect(man.created).toBe('2017-02-02T09:05:15.771Z')
        expect(man.originatorName).toBe('ASSURANT DIRECT LTD')
        expect(man.originatorUid).toBe('3fd24317-2b24-4b6a-b8f9-3ab7f5ed00e0')
        log(JSON.stringify(data))
        done()
      })
  })

  const mandateId = '12345-12345'

  test('should get the specified mandate', done => {
    nock('http://localhost', expectAuthorizationHeader(accessToken))
      .get(`/api/v1/direct-debit/mandates/${mandateId}`)
      .reply(200, getMandateResponse)

    starlingCli
      .getMandate(accessToken, mandateId)
      .then(function ({ data }) {
        expect(data.uid).toBe('0931e8a3-7b4a-4c2d-9729-df2296dde98')
        expect(data.reference).toBe('747338448')
        expect(data.status).toBe('LIVE')
        expect(data.source).toBe('ELECTRONIC')
        expect(data.created).toBe('2017-02-21T08:53:26.144Z')
        expect(data.originatorName).toBe('AFFINITY WATER LTD')
        expect(data.originatorUid).toBe('c44adbfe-779b-4afe-b03f-a861db75ab78')
        log(JSON.stringify(data))
        done()
      })
  })

  test('should delete the specified mandate', done => {
    nock('http://localhost', expectAuthorizationHeader(accessToken))
      .delete(`/api/v1/direct-debit/mandates/${mandateId}`)
      .reply(204)

    starlingCli
      .deleteMandate(accessToken, mandateId)
      .then(function ({ status }) {
        expect(status).toBe(204)
        done()
      })
  })
})
