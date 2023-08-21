"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _webpack() {
  const data = _interopRequireDefault(require("@umijs/deps/compiled/webpack"));

  _webpack = function _webpack() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CssDependency extends _webpack().default.Dependency {
  constructor({
    identifier,
    content,
    media,
    sourceMap
  }, context, identifierIndex) {
    super();
    this.identifier = identifier;
    this.identifierIndex = identifierIndex;
    this.content = content;
    this.media = media;
    this.sourceMap = sourceMap;
    this.context = context;
  }

  getResourceIdentifier() {
    return `css-module-${this.identifier}-${this.identifierIndex}`;
  } // eslint-disable-next-line class-methods-use-this


  getModuleEvaluationSideEffectsState() {
    return _webpack().default.ModuleGraphConnection.TRANSITIVE_ONLY;
  }

  serialize(context) {
    const write = context.write;
    write(this.identifier);
    write(this.content);
    write(this.media);
    write(this.sourceMap);
    write(this.context);
    write(this.identifierIndex);
    super.serialize(context);
  }

  deserialize(context) {
    super.deserialize(context);
  }

}

if (_webpack().default.util && _webpack().default.util.serialization) {
  _webpack().default.util.serialization.register(CssDependency, 'mini-css-extract-plugin/dist/CssDependency', null, {
    serialize(instance, context) {
      instance.serialize(context);
    },

    deserialize(context) {
      const read = context.read;
      const dep = new CssDependency({
        identifier: read(),
        content: read(),
        media: read(),
        sourceMap: read()
      }, read(), read());
      dep.deserialize(context);
      return dep;
    }

  });
}

var _default = CssDependency;
exports.default = _default;