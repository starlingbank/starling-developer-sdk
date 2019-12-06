import { struct, minAPIParameterValidator } from '../../src/utils/validator'

describe('Type Validator', () => {
  test('minAPIParameterValidator should not throw when types are correct', () => {
    expect(() => {
      minAPIParameterValidator({
        accessToken: 'abcd',
        apiUrl: 'https://api.starlingbank.com'
      })
    }).not.toThrow()
  })

  test('minAPIParameterValidator should not throw when properties are a superset', () => {
    expect(() => {
      minAPIParameterValidator({
        accessToken: 'abcd',
        apiUrl: 'https://api.starlingbank.com',
        otherThing: 'shouldntAffectTheValidation'
      })
    }).not.toThrow()
  })

  test('minAPIParameterValidator should throw when accessToken is missing', () => {
    expect(() => {
      minAPIParameterValidator({
        apiUrl: 'https://api.starlingbank.com'
      })
    }).toThrow('Expected a value of type `string` for `accessToken` but received `undefined`.')
  })

  test('minAPIParameterValidator should throw when apiUrl is missing', () => {
    expect(() => {
      minAPIParameterValidator({
        accessToken: 'abcd'
      })
    }).toThrow('Expected a value of type `string` for `apiUrl` but received `undefined`.')
  })

  test('minAPIParameterValidator should throw when accessToken and apiUrl is missing', () => {
    expect(() => {
      minAPIParameterValidator({})
    }).toThrow()
  })

  test('minAPIParameterValidator should throw when given undefined', () => {
    expect(() => {
      minAPIParameterValidator(undefined)
    }).toThrow('Expected a value of type `interface<{accessToken,apiUrl}>` but received `undefined`.')
  })

  test('struct with a uuid should throw when given empty object', () => {
    expect(() => {
      struct.interface({ accountUid: 'uuid' })({})
    }).toThrow('Expected a value of type `uuid` for `accountUid` but received `undefined`.')
  })

  test('struct with a uuid should throw when given an non-uuid like string', () => {
    expect(() => {
      struct.interface({ accountUid: 'uuid' })({
        accountUid: 'abcd'
      })
    }).toThrow('Expected a value of type `uuid` for `accountUid` but received `"abcd"`.')
  })

  test('struct with a uuid should throw when given an invalid uuid', () => {
    expect(() => {
      struct.interface({ accountUid: 'uuid' })({
        accountUid: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
      })
    }).toThrow('Expected a value of type `uuid` for `accountUid` but received `"aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"`.')
  })

  test('struct with a uuid should not throw when given a valid uuid', () => {
    expect(() => {
      struct.interface({ accountUid: 'uuid' })({
        accountUid: 'c845736c-6cc9-4dd1-a0c5-4cdc497dcde7'
      })
    }).not.toThrow()
  })

  test('struct with a yearMonth should throw when given an non-yearMonth like string', () => {
    expect(() => {
      struct.interface({ ym: 'yearMonth' })({
        ym: 'abcd'
      })
    }).toThrow('Expected a value of type `yearMonth` for `ym` but received `"abcd"`.')
  })

  test('struct with a yearMonth should throw when given an invalid yearMonth', () => {
    expect(() => {
      struct.interface({ ym: 'yearMonth' })({
        ym: '2019-14'
      })
    }).toThrow('Expected a value of type `yearMonth` for `ym` but received `"2019-14"`.')
  })

  test('struct with a yearMonth should not throw when given a valid yearMonth', () => {
    expect(() => {
      struct.interface({ ym: 'yearMonth' })({
        ym: '2019-12'
      })
    }).not.toThrow()
  })

  test('struct with a date should throw when given an non-date like string', () => {
    expect(() => {
      struct.interface({ d: 'date' })({
        d: 'abcd'
      })
    }).toThrow('Expected a value of type `date` for `d` but received `"abcd"`.')
  })

  test('struct with a date should throw when given an invalid date', () => {
    expect(() => {
      struct.interface({ d: 'date' })({
        d: '2019-14-01'
      })
    }).toThrow('Expected a value of type `date` for `d` but received `"2019-14-01"`.')
  })

  test('struct with a date should not throw when given a valid date', () => {
    expect(() => {
      struct.interface({ d: 'date' })({
        d: '2019-12-01'
      })
    }).not.toThrow()
  })

  test('struct with a timestamp should throw when given an non-timestamp like string', () => {
    expect(() => {
      struct.interface({ t: 'timestamp' })({
        t: 'abcd'
      })
    }).toThrow('Expected a value of type `timestamp` for `t` but received `"abcd"`.')
  })

  test('struct with a timestamp should throw when given an invalid timestamp', () => {
    expect(() => {
      struct.interface({ t: 'timestamp' })({
        t: '2019-14-01T23:18:47Z'
      })
    }).toThrow('Expected a value of type `timestamp` for `t` but received `"2019-14-01T23:18:47Z"`.')
  })

  test('struct with a timestamp should not throw when given a valid timestamp', () => {
    expect(() => {
      struct.interface({ t: 'timestamp' })({
        t: '2019-12-01T23:18:47Z'
      })
    }).not.toThrow()

    expect(() => {
      struct.interface({ t: 'timestamp' })({
        t: '2019-12-01T23:18:47'
      })
    }).not.toThrow()

    expect(() => {
      struct.interface({ t: 'timestamp' })({
        t: '2019-12-01T23:18:47.1Z'
      })
    }).not.toThrow()

    expect(() => {
      struct.interface({ t: 'timestamp' })({
        t: '2019-12-01T23:18:47.123Z'
      })
    }).not.toThrow()
  })
})
