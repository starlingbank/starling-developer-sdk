import expect from 'must';
import {typeValidation} from  '../../src/utils/validator'

describe('Type Validator', function () {

  let apiCallArgs;
  function setupApiCallArgs() { apiCallArgs = arguments; }

  const ruleSet = [
    {name: 'iAmRequiredObject', validations: ['required', 'object']},
    {name: 'iAmRequiredNumber', validations: ['required', 'number']},
    {name: 'iAmRequiredString', validations: ['required', 'string']}];

  const anotherRuleSet = [
    {name: 'iAmRequiredNumber', validations: ['required', 'number']},
    {name: 'iAmRequiredString', validations: ['required', 'string']},
    {name: 'iAmOptionalString', validations: ['optional', 'string']}];

  const wonkyRuleSet = [
    {name: 'iAmRequiredNumber', validations: ['required', 'number']},
    {name: 'iAmOptionalString', validations: ['optional', 'string']},
    {name: 'iAmRequiredString', validations: ['required', 'string']}];

  it('should not throw errors, as types are correct', function () {
    try {
      setupApiCallArgs({a: 1}, 42, 'HAI');
      typeValidation(apiCallArgs, ruleSet);
    } catch (problems) {
      expect('this line not').to.be('called');
    }
  });

  it('should not throw errors, as types are correct, even though we have been given spares', function () {
    try {
      setupApiCallArgs({a: 1}, 42, 'HAI', 1, 2, 3, 4);
      typeValidation(apiCallArgs, ruleSet);
    } catch (problems) {
      expect('this line not').to.be('called');
    }
  });

  it('should not throw errors as required args are specified', function () {
    try {
      setupApiCallArgs(42, 'HAI');
      typeValidation(apiCallArgs, anotherRuleSet);
    } catch (problems) {
      expect('this line not').to.be('called');
    }
  });

  it('should not throw errors as required args are specified', function () {
    try {
      setupApiCallArgs(42, 'HAI', undefined);
      typeValidation(apiCallArgs, anotherRuleSet);
    } catch (problems) {
      expect('this line not').to.be('called');
    }
  });

  it('should throw an error as the undefined input is required', function () {
    try {
      setupApiCallArgs();
      typeValidation(apiCallArgs, ruleSet);
      expect('this line not').to.be('called');
    } catch (e) {
      e.must.have.length(3);
      e[0].must.equal('iAmRequiredObject parameter in position 0 is a required object but was undefined');
      e[1].must.equal('iAmRequiredNumber parameter in position 1 is a required number but was undefined');
      e[2].must.equal('iAmRequiredString parameter in position 2 is a required string but was undefined');
    }
  });


  it('should cope with less args than defs', function () {
    try {
      setupApiCallArgs(undefined, undefined, undefined);
      typeValidation(apiCallArgs, wonkyRuleSet);
      expect('this line not').to.be('called');
    } catch (e) {
      e.must.have.length(2);
      e[0].must.include('position 0', 'number but was undefined');
      e[1].must.include('position 2', 'string but was undefined');
    }
  });

  it('should throw with optional args as wrong type', function () {
    try {
      setupApiCallArgs(1, 3, 'sd');
      typeValidation(apiCallArgs, anotherRuleSet);
      expect('this line not').to.be('called');
    } catch (e) {
      e.must.have.length(1);
      e[0].must.include('position 1', 'string but was number');
    }
  });
});