export const defaultHeaders = (accessToken) => {
  return {
    Accept: 'application/json',
    Authorization: `Bearer ${accessToken}`
  };
};

export const postHeaders = (accessToken) => {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`
  };
};