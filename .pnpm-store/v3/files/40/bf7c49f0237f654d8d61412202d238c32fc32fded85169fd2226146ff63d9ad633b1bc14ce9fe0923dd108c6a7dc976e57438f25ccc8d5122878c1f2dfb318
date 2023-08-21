'use strict';

/**
 * Module dependencies.
 */

const raw = require('raw-body');
const inflate = require('inflation');
const utils = require('./utils');

/**
 * Return a Promise which parses text/plain requests.
 *
 * Pass a node request or an object with `.req`,
 * such as a koa Context.
 *
 * @param {Request} req
 * @param {Options} [opts]
 * @return {Function}
 * @api public
 */

module.exports = async function(req, opts) {
  req = req.req || req;
  opts = utils.clone(opts);

  // defaults
  const len = req.headers['content-length'];
  const encoding = req.headers['content-encoding'] || 'identity';
  if (len && encoding === 'identity') opts.length = ~~len;
  opts.encoding = opts.encoding === undefined ? 'utf8' : opts.encoding;
  opts.limit = opts.limit || '1mb';

  const str = await raw(inflate(req), opts);
  // ensure return the same format with json / form
  return opts.returnRawBody ? { parsed: str, raw: str } : str;
};
