'use strict';

const parse = require('co-body');
const copy = require('copy-to');
const typeis = require('type-is');

/**
 * @param [Object] opts
 *   - {String} jsonLimit default '1mb'
 *   - {String} formLimit default '56kb'
 *   - {string} encoding default 'utf-8'
 *   - {Object} extendTypes
 */

module.exports = function(opts) {
  opts = opts || {};
  const {detectJSON} = opts;
  const {onerror} = opts;

  const enableTypes = opts.enableTypes || ['json', 'form'];
  const enableForm = checkEnable(enableTypes, 'form');
  const enableJson = checkEnable(enableTypes, 'json');
  const enableText = checkEnable(enableTypes, 'text');
  const enableXml = checkEnable(enableTypes, 'xml');

  opts.detectJSON = undefined;
  opts.onerror = undefined; // eslint-disable-line unicorn/prefer-add-event-listener

  // force co-body return raw body
  opts.returnRawBody = true;

  // default json types
  const jsonTypes = [
    'application/json',
    'application/json-patch+json',
    'application/vnd.api+json',
    'application/csp-report',
    'application/scim+json'
  ];

  // default form types
  const formTypes = ['application/x-www-form-urlencoded'];

  // default text types
  const textTypes = ['text/plain'];

  // default xml types
  const xmlTypes = ['text/xml', 'application/xml'];

  const jsonOpts = formatOptions(opts, 'json');
  const formOpts = formatOptions(opts, 'form');
  const textOpts = formatOptions(opts, 'text');
  const xmlOpts = formatOptions(opts, 'xml');

  const extendTypes = opts.extendTypes || {};

  extendType(jsonTypes, extendTypes.json);
  extendType(formTypes, extendTypes.form);
  extendType(textTypes, extendTypes.text);
  extendType(xmlTypes, extendTypes.xml);

  // eslint-disable-next-line func-names
  return async function bodyParser(ctx, next) {
    if (ctx.request.body !== undefined || ctx.disableBodyParser)
      return await next(); // eslint-disable-line no-return-await
    try {
      const res = await parseBody(ctx);
      ctx.request.body = 'parsed' in res ? res.parsed : {};
      if (ctx.request.rawBody === undefined) ctx.request.rawBody = res.raw;
    } catch (err) {
      if (onerror) {
        onerror(err, ctx);
      } else {
        throw err;
      }
    }

    await next();
  };

  async function parseBody(ctx) {
    if (
      enableJson &&
      ((detectJSON && detectJSON(ctx)) ||
        isTypes(ctx.request.get('content-type'), jsonTypes))
    ) {
      return await parse.json(ctx, jsonOpts); // eslint-disable-line no-return-await
    }

    if (enableForm && ctx.request.is(formTypes)) {
      return await parse.form(ctx, formOpts); // eslint-disable-line no-return-await
    }

    if (enableText && ctx.request.is(textTypes)) {
      return (await parse.text(ctx, textOpts)) || '';
    }

    if (enableXml && ctx.request.is(xmlTypes)) {
      return (await parse.text(ctx, xmlOpts)) || '';
    }

    return {};
  }
};

function formatOptions(opts, type) {
  const res = {};
  copy(opts).to(res);
  res.limit = opts[type + 'Limit'];
  return res;
}

function extendType(original, extend) {
  if (extend) {
    if (!Array.isArray(extend)) {
      extend = [extend];
    }

    extend.forEach(function(extend) {
      original.push(extend);
    });
  }
}

function checkEnable(types, type) {
  return types.includes(type);
}

function isTypes(contentTypeValue, types) {
  if (typeof contentTypeValue === 'string') {
    // trim extra semicolon
    contentTypeValue = contentTypeValue.replace(/;$/, '');
  }

  return typeis.is(contentTypeValue, types);
}
