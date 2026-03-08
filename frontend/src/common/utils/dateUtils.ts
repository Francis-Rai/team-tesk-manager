export const toInstant = (value?: string) => {
  if (!value) return undefined;
  return new Date(value).toISOString();
};
