import React, { useContext } from 'react'; // @ts-ignore

import { history } from 'dumi';
import { context, Link } from 'dumi/theme';
import './LocaleSelect.less';

var LocaleSelect = function LocaleSelect(_ref) {
  var location = _ref.location;

  var _useContext = useContext(context),
      base = _useContext.base,
      locale = _useContext.locale,
      locales = _useContext.config.locales;

  var firstDiffLocale = locales.find(function (_ref2) {
    var name = _ref2.name;
    return name !== locale;
  });

  function getLocaleTogglePath(target) {
    var baseWithoutLocale = base.replace("/".concat(locale), '');
    var pathnameWithoutLocale = location.pathname.replace(new RegExp("^".concat(base, "(/|$)")), "".concat(baseWithoutLocale, "$1")) || '/'; // append locale prefix to path if it is not the default locale

    if (target !== locales[0].name) {
      // compatiable with integrate route prefix /~docs
      var routePrefix = "".concat(baseWithoutLocale, "/").concat(target).replace(/\/\//, '/');
      var pathnameWithoutBase = location.pathname.replace( // to avoid stripped the first /
      base.replace(/^\/$/, '//'), '');
      return "".concat(routePrefix).concat(pathnameWithoutBase).replace(/\/$/, '');
    }

    return pathnameWithoutLocale;
  }

  return firstDiffLocale ? /*#__PURE__*/React.createElement("div", {
    className: "__dumi-default-locale-select",
    "data-locale-count": locales.length
  }, locales.length > 2 ? /*#__PURE__*/React.createElement("select", {
    value: locale,
    onChange: function onChange(ev) {
      return history.push(getLocaleTogglePath(ev.target.value));
    }
  }, locales.map(function (localeItem) {
    return /*#__PURE__*/React.createElement("option", {
      value: localeItem.name,
      key: localeItem.name
    }, localeItem.label);
  })) : /*#__PURE__*/React.createElement(Link, {
    to: getLocaleTogglePath(firstDiffLocale.name)
  }, firstDiffLocale.label)) : null;
};

export default LocaleSelect;