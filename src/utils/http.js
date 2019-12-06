export const defaultHeaders = (accessToken) => ({
  Accept: 'application/json',
  Authorization: `Bearer ${accessToken}`
})

export const payloadHeaders = (accessToken) => ({
  ...defaultHeaders(accessToken),
  'Content-Type': 'application/json'
})
