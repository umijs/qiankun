import React, { useContext } from 'react';
import { context, useApiData } from 'dumi/theme';
var LOCALE_TEXTS = {
  'zh-CN': {
    name: '属性名',
    description: '描述',
    type: '类型',
    default: '默认值',
    required: '(必选)'
  },
  'en-US': {
    name: 'Name',
    description: 'Description',
    type: 'Type',
    default: 'Default',
    required: '(required)'
  }
};
export default (function (_ref) {
  var identifier = _ref.identifier,
      expt = _ref.export;
  var data = useApiData(identifier);

  var _useContext = useContext(context),
      locale = _useContext.locale;

  var texts = /^zh|cn$/i.test(locale) ? LOCALE_TEXTS['zh-CN'] : LOCALE_TEXTS['en-US'];
  return /*#__PURE__*/React.createElement(React.Fragment, null, data && /*#__PURE__*/React.createElement("table", {
    style: {
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, texts.name), /*#__PURE__*/React.createElement("th", null, texts.description), /*#__PURE__*/React.createElement("th", null, texts.type), /*#__PURE__*/React.createElement("th", null, texts.default))), /*#__PURE__*/React.createElement("tbody", null, data[expt].map(function (row) {
    return /*#__PURE__*/React.createElement("tr", {
      key: row.identifier
    }, /*#__PURE__*/React.createElement("td", null, row.identifier), /*#__PURE__*/React.createElement("td", null, row.description || '--'), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", null, row.type)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("code", null, row.default || row.required && texts.required || '--')));
  }))));
});