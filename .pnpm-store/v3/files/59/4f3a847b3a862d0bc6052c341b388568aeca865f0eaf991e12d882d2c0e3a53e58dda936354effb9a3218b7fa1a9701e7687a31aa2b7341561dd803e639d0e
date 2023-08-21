/* global __webpack_dev_server_client__ */

import getSocketUrlParts from './utils/getSocketUrlParts.js';
import getUrlFromParts from './utils/getUrlFromParts';

/**
 * Initializes a socket server for HMR for webpack-dev-server.
 * @param {function(*): void} messageHandler A handler to consume Webpack compilation messages.
 * @param {string} [resourceQuery] Webpack's `__resourceQuery` string.
 * @returns {void}
 */
function initWDSSocket(messageHandler, resourceQuery) {
  if (typeof __webpack_dev_server_client__ !== 'undefined') {
    const SocketClient = __webpack_dev_server_client__;

    const urlParts = getSocketUrlParts(resourceQuery);

    let enforceWs = false;
    if (
      typeof SocketClient.name !== 'undefined' &&
      SocketClient.name !== null &&
      SocketClient.name.toLowerCase().includes('websocket')
    ) {
      enforceWs = true;
    }

    const connection = new SocketClient(getUrlFromParts(urlParts, enforceWs));

    connection.onMessage(function onSocketMessage(data) {
      const message = JSON.parse(data);
      messageHandler(message);
    });
  }
}

export const init = initWDSSocket;
