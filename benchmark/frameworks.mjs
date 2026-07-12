export const FRAMEWORK_ADAPTER_API_VERSION = 3;

export const FRAMEWORK_ADAPTERS = {
  garfish: {
    capabilities: {
      acceptsChunkedResponse: true,
      crossSiteEntry: true,
      htmlEntry: true,
      progressiveHtmlParsing: false,
    },
    hostPage: 'garfish.html',
    id: 'garfish',
    initialization: { disablePreloadApp: true },
    packageName: 'garfish',
  },
  'micro-app': {
    capabilities: {
      acceptsChunkedResponse: true,
      crossSiteEntry: true,
      htmlEntry: true,
      progressiveHtmlParsing: false,
    },
    hostPage: 'micro-app.html',
    id: 'micro-app',
    initialization: { prefetch: false, start: true },
    packageName: '@micro-zoe/micro-app',
  },
  native: {
    capabilities: {
      acceptsChunkedResponse: true,
      crossSiteEntry: true,
      htmlEntry: true,
      progressiveHtmlParsing: true,
    },
    hostPage: 'native.html',
    id: 'native',
    initialization: {},
    packageName: null,
  },
  qiankun: {
    capabilities: {
      acceptsChunkedResponse: true,
      crossSiteEntry: true,
      htmlEntry: true,
      progressiveHtmlParsing: true,
    },
    hostPage: 'qiankun.html',
    id: 'qiankun',
    initialization: { start: true },
    packageName: 'qiankun',
  },
  'qiankun-v2': {
    capabilities: {
      acceptsChunkedResponse: true,
      crossSiteEntry: true,
      htmlEntry: true,
      progressiveHtmlParsing: false,
    },
    hostPage: 'qiankun-v2.html',
    id: 'qiankun-v2',
    initialization: { prefetch: false, start: true },
    packageName: 'qiankun-v2',
  },
  wujie: {
    capabilities: {
      acceptsChunkedResponse: true,
      crossSiteEntry: true,
      htmlEntry: true,
      progressiveHtmlParsing: false,
    },
    hostPage: 'wujie.html',
    id: 'wujie',
    initialization: {},
    packageName: 'wujie',
  },
};

export function getFrameworkAdapter(id) {
  const adapter = FRAMEWORK_ADAPTERS[id];
  if (!adapter) throw new Error(`unknown benchmark framework adapter: ${id}`);
  return adapter;
}

export function getVariantHostPage(variant) {
  return getFrameworkAdapter(variant.framework).hostPage;
}

export function assertFrameworkVariantSupported(variant) {
  const adapter = getFrameworkAdapter(variant.framework);
  if (variant.entrySite === 'cross-site' && !adapter.capabilities.crossSiteEntry) {
    throw new Error(`${adapter.id} does not support cross-site HTML entries`);
  }
  if (variant.delivery === 'streamed' && !adapter.capabilities.acceptsChunkedResponse) {
    throw new Error(`${adapter.id} does not accept chunked HTML responses`);
  }
}
