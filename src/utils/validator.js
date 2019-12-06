const superstruct = require('superstruct').superstruct
export const struct = superstruct({
  types: {
    uuid: value => /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value),
    yearMonth: value => /^[0-9]{4}-(?:1[0-2]|0[1-9])$/.test(value),
    date: value => /^[0-9]{4}-(?:1[0-2]|0[1-9])-(?:3[01]|[12]\d|0[1-9])$/.test(value),
    timestamp: value => /^((?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z)?$/.test(value)
  }
})
export const minAPIParameterDefintion = { accessToken: 'string', apiUrl: 'string' }
export const minAPIParameterValidator = struct.interface(minAPIParameterDefintion)
