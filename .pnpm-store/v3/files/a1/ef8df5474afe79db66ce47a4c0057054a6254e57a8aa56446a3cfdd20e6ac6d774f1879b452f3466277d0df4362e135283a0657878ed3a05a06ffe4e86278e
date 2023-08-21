import getCurrentScriptSource from './getCurrentScriptSource.js';
import parseQuery from './parseQuery.js';

/**
 * @typedef {Object} SocketUrlParts
 * @property {string} [auth]
 * @property {string} hostname
 * @property {string} [protocol]
 * @property {string} pathname
 * @property {string} port
 */

/**
 * Parse current location and Webpack's `__resourceQuery` into parts that can create a valid socket URL.
 * @param {string} [resourceQuery] The Webpack `__resourceQuery` string.
 * @returns {SocketUrlParts} The parsed URL parts.
 * @see https://webpack.js.org/api/module-variables/#__resourcequery-webpack-specific
 */
function getSocketUrlParts(resourceQuery) {
  const scriptSource = getCurrentScriptSource();

  let url = {};
  try {
    // The placeholder `baseURL` with `window.location.href`,
    // is to allow parsing of path-relative or protocol-relative URLs,
    // and will have no effect if `scriptSource` is a fully valid URL.
    url = new URL(scriptSource, window.location.href);
  } catch (e) {
    // URL parsing failed, do nothing.
    // We will still proceed to see if we can recover using `resourceQuery`
  }

  /** @type {string | undefined} */
  let auth;
  /** @type {string | undefined} */
  let hostname = url.hostname;
  /** @type {string | undefined} */
  let protocol = url.protocol;
  let pathname = '/sockjs-node'; // This is hard-coded in WDS
  /** @type {string | undefined} */
  let port = url.port;

  // Parse authentication credentials in case we need them
  if (url.username) {
    // Since HTTP basic authentication does not allow empty username,
    // we only include password if the username is not empty.
    // Result: <username>:<password>
    auth = [url.username, url.password].filter(Boolean).join(':');
  }

  // Check for IPv4 and IPv6 host addresses that corresponds to `any`/`empty`.
  // This is important because `hostname` can be empty for some hosts,
  // such as `about:blank` or `file://` URLs.
  const isEmptyHostname = url.hostname === '0.0.0.0' || url.hostname === '[::]' || !url.hostname;

  // We only re-assign the hostname if we are using HTTP/HTTPS protocols
  if (
    isEmptyHostname &&
    window.location.hostname &&
    window.location.protocol.indexOf('http') !== -1
  ) {
    hostname = window.location.hostname;
  }

  // We only re-assign `protocol` when `hostname` is available and is empty,
  // since otherwise we risk creating an invalid URL.
  // We also do this when `https` is used as it mandates the use of secure sockets.
  if (hostname && (isEmptyHostname || window.location.protocol === 'https:')) {
    protocol = window.location.protocol;
  }

  // We only re-assign port when it is not available
  if (!port) {
    port = window.location.port;
  }

  // If the resource query is available,
  // parse it and overwrite everything we received from the script host.
  const parsedQuery = parseQuery(resourceQuery || '');
  hostname = parsedQuery.sockHost || hostname;
  pathname = parsedQuery.sockPath || pathname;
  port = parsedQuery.sockPort || port;

  // Make sure the protocol from resource query has a trailing colon
  if (parsedQuery.sockProtocol) {
    protocol = parsedQuery.sockProtocol + ':';
  }

  if (!hostname || !pathname || !port) {
    throw new Error(
      [
        '[React Refresh] Failed to get an URL for the socket connection.',
        "This usually means that the current executed script doesn't have a `src` attribute set.",
        'You should either specify the socket path parameters under the `devServer` key in your Webpack config, or use the `overlay` option.',
        'https://github.com/pmmmwh/react-refresh-webpack-plugin/blob/main/docs/API.md#overlay',
      ].join('\n')
    );
  }

  return {
    auth: auth,
    hostname: hostname,
    pathname: pathname,
    protocol: protocol,
    port: port,
  };
}

export default getSocketUrlParts;
