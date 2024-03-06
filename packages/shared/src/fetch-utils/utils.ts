export type Fetch = typeof window.fetch;

export const isValidResponse = (status: number): boolean => {
  return status >= 200 && status < 400;
};
