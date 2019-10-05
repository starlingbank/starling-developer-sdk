
export const expectAuthorizationHeader = (apiKey) => {
  return {
    reqheaders: {
      Authorization: function (value) {
        return value === `Bearer ${apiKey}`
      }
    }
  }
}
