import nock from 'nock'
import debug from 'debug'
import { expectAuthorizationHeader } from '../testSupport'

import Starling from '../../src/starling'
import getFeedItemsResponse from '../responses/v2-get-feed-items.json'
import getFeedItemResponse from '../responses/v2-get-feed-item.json'

const log = debug('starling:transaction-test')

const timestampRegex = /^((?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z)?$/

describe('Transaction feed', () => {
  const accessToken = '0123456789'
  const starlingCli = new Starling({
    apiUrl: 'http://localhost'
  })
  const accountUid = 'b0b20c9d-3b6b-42f1-a7d0-e70d4538e0d9'
  const categoryUid = 'cc2d03f9-9438-4c7b-a426-ba3199740d73'
  const feedItemUid = '3303f51a-de75-43ad-b6b5-62c4b7c5b059'

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get(`/api/v2/feed/account/${accountUid}/category/${categoryUid}/transactions-between`)
    .query(params => params.minTransactionTimestamp && params.maxTransactionTimestamp && timestampRegex.test(params.minTransactionTimestamp) && timestampRegex.test(params.maxTransactionTimestamp))
    .reply(200, getFeedItemsResponse)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get(`/api/v2/feed/account/${accountUid}/category/${categoryUid}/${feedItemUid}`)
    .reply(200, getFeedItemResponse)

  nock('http://localhost', expectAuthorizationHeader(accessToken))
    .get(`/api/v2/feed/account/${accountUid}/category/${categoryUid}`)
    .query(params => params.changesSince && timestampRegex.test(params.changesSince))
    .reply(200, getFeedItemsResponse)

  test('should retrieve the category\'s feed items between two timestamps', done => {
    starlingCli
      .feedItem
      .getFeedItemsBetween({ accessToken, accountUid, categoryUid, minTransactionTimestamp: '2019-10-23T00:00:00.000Z', maxTransactionTimestamp: '2019-10-26T00:00:00.000Z' })
      .then(({ data }) => {
        expect(data.feedItems).toHaveLength(5)

        const train = data.feedItems[0]
        expect(train.feedItemUid).toBe(feedItemUid)
        expect(train.categoryUid).toBe(categoryUid)
        expect(train.amount.currency).toBe('GBP')
        expect(train.amount.minorUnits).toBe(2375)
        expect(train.sourceAmount.currency).toBe('GBP')
        expect(train.sourceAmount.minorUnits).toBe(2375)
        expect(train.direction).toBe('OUT')
        expect(train.updatedAt).toBe('2019-10-25T22:37:51.094Z')
        expect(train.transactionTime).toBe('2019-10-25T22:37:51.016Z')
        expect(train.source).toBe('MASTER_CARD')
        expect(train.sourceSubType).toBe('ONLINE')
        expect(train.status).toBe('PENDING')
        expect(train.counterPartyType).toBe('MERCHANT')
        expect(train.counterPartyUid).toBe('332a9d91-2815-4d21-a03f-62423a1a66d0')
        expect(train.counterPartyName).toBe('Virgin Trains')
        expect(train.counterPartySubEntityUid).toBe('26cea656-1e68-48c7-806d-9c2c7e311f45')
        expect(train.reference).toBe('Virgin Trains          London        GBR')
        expect(train.country).toBe('GB')
        expect(train.spendingCategory).toBe('TRANSPORT')
        expect(train.userNote).toBe('To travel down on the 30th')

        const internalTransfer = data.feedItems[1]
        expect(internalTransfer.feedItemUid).toBe('220f236e-6a67-4cfe-97b0-cb806f1f612f')
        expect(internalTransfer.categoryUid).toBe('cc2d03f9-9438-4c7b-a426-ba3199740d73')
        expect(internalTransfer.amount.currency).toBe('GBP')
        expect(internalTransfer.amount.minorUnits).toBe(1000)
        expect(internalTransfer.sourceAmount.currency).toBe('GBP')
        expect(internalTransfer.sourceAmount.minorUnits).toBe(1000)
        expect(internalTransfer.direction).toBe('OUT')
        expect(internalTransfer.updatedAt).toBe('2019-10-25T20:23:02.701Z')
        expect(internalTransfer.transactionTime).toBe('2019-10-25T20:23:02.623Z')
        expect(internalTransfer.settlementTime).toBe('2019-10-25T20:23:02.623Z')
        expect(internalTransfer.source).toBe('INTERNAL_TRANSFER')
        expect(internalTransfer.status).toBe('SETTLED')
        expect(internalTransfer.counterPartyType).toBe('CATEGORY')
        expect(internalTransfer.counterPartyUid).toBe('5031325f-49b2-4c8c-b9cb-3f5cfa7f6d6e')
        expect(internalTransfer.counterPartyName).toBe('Trip to Paris')
        expect(internalTransfer.country).toBe('GB')
        expect(internalTransfer.spendingCategory).toBe('SAVING')

        log(JSON.stringify(data))

        done()
      })
  })

  test('should retrieve the category\'s feed items changed since a timestamp', done => {
    starlingCli
      .feedItem
      .getFeedItemsChangedSince({ accessToken, accountUid, categoryUid, changesSince: '2019-10-23T00:00:00.000Z' })
      .then(({ data }) => {
        expect(data.feedItems).toHaveLength(5)

        const train = data.feedItems[0]
        expect(train.feedItemUid).toBe(feedItemUid)
        expect(train.categoryUid).toBe(categoryUid)
        expect(train.amount.currency).toBe('GBP')
        expect(train.amount.minorUnits).toBe(2375)
        expect(train.sourceAmount.currency).toBe('GBP')
        expect(train.sourceAmount.minorUnits).toBe(2375)
        expect(train.direction).toBe('OUT')
        expect(train.updatedAt).toBe('2019-10-25T22:37:51.094Z')
        expect(train.transactionTime).toBe('2019-10-25T22:37:51.016Z')
        expect(train.source).toBe('MASTER_CARD')
        expect(train.sourceSubType).toBe('ONLINE')
        expect(train.status).toBe('PENDING')
        expect(train.counterPartyType).toBe('MERCHANT')
        expect(train.counterPartyUid).toBe('332a9d91-2815-4d21-a03f-62423a1a66d0')
        expect(train.counterPartyName).toBe('Virgin Trains')
        expect(train.counterPartySubEntityUid).toBe('26cea656-1e68-48c7-806d-9c2c7e311f45')
        expect(train.reference).toBe('Virgin Trains          London        GBR')
        expect(train.country).toBe('GB')
        expect(train.spendingCategory).toBe('TRANSPORT')
        expect(train.userNote).toBe('To travel down on the 30th')

        const internalTransfer = data.feedItems[1]
        expect(internalTransfer.feedItemUid).toBe('220f236e-6a67-4cfe-97b0-cb806f1f612f')
        expect(internalTransfer.categoryUid).toBe('cc2d03f9-9438-4c7b-a426-ba3199740d73')
        expect(internalTransfer.amount.currency).toBe('GBP')
        expect(internalTransfer.amount.minorUnits).toBe(1000)
        expect(internalTransfer.sourceAmount.currency).toBe('GBP')
        expect(internalTransfer.sourceAmount.minorUnits).toBe(1000)
        expect(internalTransfer.direction).toBe('OUT')
        expect(internalTransfer.updatedAt).toBe('2019-10-25T20:23:02.701Z')
        expect(internalTransfer.transactionTime).toBe('2019-10-25T20:23:02.623Z')
        expect(internalTransfer.settlementTime).toBe('2019-10-25T20:23:02.623Z')
        expect(internalTransfer.source).toBe('INTERNAL_TRANSFER')
        expect(internalTransfer.status).toBe('SETTLED')
        expect(internalTransfer.counterPartyType).toBe('CATEGORY')
        expect(internalTransfer.counterPartyUid).toBe('5031325f-49b2-4c8c-b9cb-3f5cfa7f6d6e')
        expect(internalTransfer.counterPartyName).toBe('Trip to Paris')
        expect(internalTransfer.country).toBe('GB')
        expect(internalTransfer.spendingCategory).toBe('SAVING')

        log(JSON.stringify(data))

        done()
      })
  })

  test('should retrieve an individual feed item', done => {
    starlingCli
      .feedItem
      .getFeedItem({ accessToken, accountUid, categoryUid, feedItemUid })
      .then(({ data }) => {
        expect(data.feedItemUid).toBe(feedItemUid)
        expect(data.categoryUid).toBe(categoryUid)
        expect(data.amount.currency).toBe('GBP')
        expect(data.amount.minorUnits).toBe(2375)
        expect(data.sourceAmount.currency).toBe('GBP')
        expect(data.sourceAmount.minorUnits).toBe(2375)
        expect(data.direction).toBe('OUT')
        expect(data.updatedAt).toBe('2019-10-25T22:37:51.094Z')
        expect(data.transactionTime).toBe('2019-10-25T22:37:51.016Z')
        expect(data.source).toBe('MASTER_CARD')
        expect(data.sourceSubType).toBe('ONLINE')
        expect(data.status).toBe('PENDING')
        expect(data.counterPartyType).toBe('MERCHANT')
        expect(data.counterPartyUid).toBe('332a9d91-2815-4d21-a03f-62423a1a66d0')
        expect(data.counterPartyName).toBe('Virgin Trains')
        expect(data.counterPartySubEntityUid).toBe('26cea656-1e68-48c7-806d-9c2c7e311f45')
        expect(data.reference).toBe('Virgin Trains          London        GBR')
        expect(data.country).toBe('GB')
        expect(data.spendingCategory).toBe('TRANSPORT')
        expect(data.userNote).toBe('To travel down on the 30th')

        log(JSON.stringify(data))

        done()
      })
  })
})
