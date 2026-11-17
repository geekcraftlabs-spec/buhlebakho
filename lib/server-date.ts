// Server-side date helper.
// If MOCK_DATE env var is set (format: "2026-11-15"), this returns that date.
// Remove MOCK_DATE from env to use real time.

export function getNow(): Date {
  const mock = process.env.MOCK_DATE;
  if (mock && /^\d{4}-\d{2}-\d{2}$/.test(mock)) {
    // Set to midday UTC to avoid timezone edge cases
    return new Date(`${mock}T12:00:00Z`);
  }
  return new Date();
}

export function isMockActive(): boolean {
  const mock = process.env.MOCK_DATE;
  return !!mock && /^\d{4}-\d{2}-\d{2}$/.test(mock);
}