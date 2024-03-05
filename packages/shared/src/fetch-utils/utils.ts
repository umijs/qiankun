export type Fetch = typeof window.fetch;

export const isValidaResponse = (status: number): boolean => {
  return status >= 200 && status < 400;
};
