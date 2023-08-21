'use strict';

/**
 * Module dependencies.
 */

const raw = require('raw-body');
const inflate = require('inflation');
const qs = require('qs');
const utils = require('./utils');

/**
 * Return a Promise which parses x-www-form-urlencoded requests.
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
  const queryString = opts.queryString || {};

  // keep compatibility with qs@4
  if (queryString.allowDots === undefined) queryString.allowDots = true;

  // defaults
  const len = req.headers['content-length'];
  const encoding = req.headers['content-encoding'] || 'identity';
  if (len && encoding === 'identity') opts.length = ~~len;
  opts.encoding = opts.encoding || 'utf8';
  opts.limit = opts.limit || '56kb';
  opts.qs = opts.qs || qs;

  const str = await raw(inflate(req), opts);
  try {
    const parsed = opts.qs.parse(str, queryString);
    return opts.returnRawBody ? { parsed, raw: str } : parsed;
  } catch (err) {
    err.status = 400;
    err.body = str;
    throw err;
  }
};
