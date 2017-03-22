export const defaultHeaders = (accessToken) => {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`
  };
};
