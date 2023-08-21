'use strict';

/**
 * Module dependencies.
 */

const typeis = require('type-is');
const json = require('./json');
const form = require('./form');
const text = require('./text');

const jsonTypes = [ 'json', 'application/*+json', 'application/csp-report' ];
const formTypes = [ 'urlencoded' ];
const textTypes = [ 'text' ];

/**
 * Return a Promise which parses form and json requests
 * depending on the Content-Type.
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
  opts = opts || {};

  // json
  const jsonType = opts.jsonTypes || jsonTypes;
  if (typeis(req, jsonType)) return json(req, opts);

  // form
  const formType = opts.formTypes || formTypes;
  if (typeis(req, formType)) return form(req, opts);

  // text
  const textType = opts.textTypes || textTypes;
  if (typeis(req, textType)) return text(req, opts);

  // invalid
  const type = req.headers['content-type'] || '';
  const message = type ? 'Unsupported content-type: ' + type : 'Missing content-type';
  const err = new Error(message);
  err.status = 415;
  throw err;
};
