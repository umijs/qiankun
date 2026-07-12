export const CROSS_SITE_APP_HOSTNAME = 'benchmark-app.localhost';

export const CHROMIUM_LAUNCH_ARGS = ['--site-per-process'];

function replaceHostname(origin, hostname) {
  const url = new URL(origin);
  url.hostname = hostname;
  return url.origin;
}

export function createBenchmarkOrigins({ fixtureOrigin, hostOrigins }) {
  return {
    fixtureOrigins: {
      'cross-site': replaceHostname(fixtureOrigin, CROSS_SITE_APP_HOSTNAME),
      'same-site': fixtureOrigin,
    },
    hostOrigins,
  };
}

export function resolveVariantEntryOrigin(variant, fixtureOrigins) {
  const origin = fixtureOrigins[variant.entrySite];
  if (!origin) throw new Error(`fixture origin is unavailable for entry site: ${variant.entrySite}`);
  return origin;
}
