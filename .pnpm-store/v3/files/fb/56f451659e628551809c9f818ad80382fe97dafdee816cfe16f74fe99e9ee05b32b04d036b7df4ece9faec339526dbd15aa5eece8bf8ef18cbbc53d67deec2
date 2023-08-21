/**
 * Create a valid URL from parsed URL parts.
 * @param {import('./getSocketUrlParts').SocketUrlParts} urlParts The parsed URL parts.
 * @param {boolean} [enforceWs] Enforce using the WebSocket protocols.
 * @returns {string} The generated URL.
 */
function urlFromParts(urlParts, enforceWs) {
  let fullProtocol = 'http:';
  if (urlParts.protocol) {
    fullProtocol = urlParts.protocol;
  }
  if (enforceWs) {
    fullProtocol = fullProtocol.replace(/^(?:http|.+-extension|file)/i, 'ws');
  }

  fullProtocol = fullProtocol + '//';

  let fullHost = urlParts.hostname;
  if (urlParts.auth) {
    const fullAuth = urlParts.auth.split(':').map(encodeURIComponent).join(':') + '@';
    fullHost = fullAuth + fullHost;
  }
  if (urlParts.port) {
    fullHost = fullHost + ':' + urlParts.port;
  }

  const url = new URL(urlParts.pathname, fullProtocol + fullHost);
  return url.href;
}

export default urlFromParts;
