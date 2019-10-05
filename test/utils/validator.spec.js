import { typeValidation } from '../../src/utils/validator'

describe('Type Validator', () => {
  let apiCallArgs
  function setupApiCallArgs () { apiCallArgs = arguments }

  const ruleSet = [
    { name: 'iAmRequiredObject', validations: ['required', 'object'] },
    { name: 'iAmRequiredNumber', validations: ['required', 'number'] },
    { name: 'iAmRequiredString', validations: ['required', 'string'] }]

  const anotherRuleSet = [
    { name: 'iAmRequiredNumber', validations: ['required', 'number'] },
    { name: 'iAmRequiredString', validations: ['required', 'string'] },
    { name: 'iAmOptionalString', validations: ['optional', 'string'] }]

  const wonkyRuleSet = [
    { name: 'iAmRequiredNumber', validations: ['required', 'number'] },
    { name: 'iAmOptionalString', validations: ['optional', 'string'] },
    { name: 'iAmRequiredString', validations: ['required', 'string'] }]

  test('should not throw errors, as types are correct', () => {
    expect(() => {
      setupApiCallArgs({ a: 1 }, 42, 'HAI')
      typeValidation(apiCallArgs, ruleSet)
    }).not.toThrow()
  })

  test(
    'should not throw errors, as types are correct, even though we have been given spares',
    () => {
      expect(() => {
        setupApiCallArgs({ a: 1 }, 42, 'HAI', 1, 2, 3, 4)
        typeValidation(apiCallArgs, ruleSet)
      }).not.toThrow()
    }
  )

  test('should not throw errors as required args are specified', () => {
    expect(() => {
      setupApiCallArgs(42, 'HAI')
      typeValidation(apiCallArgs, anotherRuleSet)
    }).not.toThrow()
  })

  test('should not throw errors as required args are specified', () => {
    expect(() => {
      setupApiCallArgs(42, 'HAI', undefined)
      typeValidation(apiCallArgs, anotherRuleSet)
    }).not.toThrow()
  })

  test('should throw an error as the undefined input is required', () => {
    expect(() => {
      setupApiCallArgs()
      typeValidation(apiCallArgs, ruleSet)
    }).toThrow([
      'iAmRequiredObject parameter in position 0 is a required object but was undefined',
      'iAmRequiredNumber parameter in position 1 is a required number but was undefined',
      'iAmRequiredString parameter in position 2 is a required string but was undefined'
    ].toString())
  })

  test('should cope with less args than defs', () => {
    expect(() => {
      setupApiCallArgs(undefined, undefined, undefined)
      typeValidation(apiCallArgs, wonkyRuleSet)
    }).toThrow([
      'iAmRequiredNumber parameter in position 0 is a required number but was undefined',
      'iAmRequiredString parameter in position 2 is a required string but was undefined'
    ].toString())
  })

  test('should throw with optional args as wrong type', () => {
    expect(() => {
      setupApiCallArgs(1, 3, 'sd')
      typeValidation(apiCallArgs, anotherRuleSet)
    }).toThrow([
      'iAmRequiredString parameter in position 1 is a required string but was number'
    ].toString())
  })
})
