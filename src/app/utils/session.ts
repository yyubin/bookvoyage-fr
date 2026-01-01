export const generateSessionId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 11);
  return `session-${timestamp}-${random}`;
};
