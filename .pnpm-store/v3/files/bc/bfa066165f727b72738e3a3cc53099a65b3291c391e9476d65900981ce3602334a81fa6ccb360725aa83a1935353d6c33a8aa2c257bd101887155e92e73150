'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var postcss = require('postcss');
var gonzales = require('gonzales-pe');

var DEFAULT_RAWS_ROOT = {
  before: ''
};

var DEFAULT_RAWS_RULE = {
  before: '',
  between: ''
};

var DEFAULT_RAWS_DECL = {
  before: '',
  between: '',
  semicolon: false
};

var DEFAULT_COMMENT_DECL = {
  before: '',
  left: '',
  right: ''
};

var SassParser = function () {
  function SassParser(input) {
    _classCallCheck(this, SassParser);

    this.input = input;
  }

  _createClass(SassParser, [{
    key: 'parse',
    value: function parse() {
      try {
        this.node = gonzales.parse(this.input.css, { syntax: 'sass' });
      } catch (error) {
        throw this.input.error(error.message, error.line, 1);
      }
      this.lines = this.input.css.match(/^.*(\r?\n|$)/gm);
      this.root = this.stylesheet(this.node);
    }
  }, {
    key: 'extractSource',
    value: function extractSource(start, end) {
      var nodeLines = this.lines.slice(start.line - 1, end.line);

      nodeLines[0] = nodeLines[0].substring(start.column - 1);
      var last = nodeLines.length - 1;
      nodeLines[last] = nodeLines[last].substring(0, end.column);

      return nodeLines.join('');
    }
  }, {
    key: 'stylesheet',
    value: function stylesheet(node) {
      var _this = this;

      // Create and set parameters for Root node
      var root = postcss.root();
      root.source = {
        start: node.start,
        end: node.end,
        input: this.input
        // Raws for root node
      };root.raws = {
        semicolon: DEFAULT_RAWS_ROOT.semicolon,
        before: DEFAULT_RAWS_ROOT.before
        // Store spaces before root (if exist)
      };this.raws = {
        before: ''
      };
      node.content.forEach(function (contentNode) {
        return _this.process(contentNode, root);
      });
      return root;
    }
  }, {
    key: 'process',
    value: function process(node, parent) {
      if (this[node.type]) {
        return this[node.type](node, parent) || null;
      } else {
        return null;
      }
    }
  }, {
    key: 'ruleset',
    value: function ruleset(node, parent) {
      var _this2 = this;

      // Loop to find the deepest ruleset node
      this.raws.multiRuleProp = '';

      node.content.forEach(function (contentNode) {
        switch (contentNode.type) {
          case 'block':
            {
              // Create Rule node
              var rule = postcss.rule();
              rule.selector = '';
              // Object to store raws for Rule
              var ruleRaws = {
                before: _this2.raws.before || DEFAULT_RAWS_RULE.before,
                between: DEFAULT_RAWS_RULE.between

                // Variable to store spaces and symbols before declaration property
              };_this2.raws.before = '';
              _this2.raws.comment = false;

              // Look up throw all nodes in current ruleset node
              node.content.filter(function (content) {
                return content.type === 'block';
              }).forEach(function (innerContentNode) {
                return _this2.process(innerContentNode, rule);
              });

              if (rule.nodes.length) {
                // Write selector to Rule
                rule.selector = _this2.extractSource(node.start, contentNode.start).slice(0, -1).replace(/\s+$/, function (spaces) {
                  ruleRaws.between = spaces;
                  return '';
                });
                // Set parameters for Rule node
                rule.parent = parent;
                rule.source = {
                  start: node.start,
                  end: node.end,
                  input: _this2.input
                };
                rule.raws = ruleRaws;
                parent.nodes.push(rule);
              }
              break;
            }
          default:
        }
      });
    }
  }, {
    key: 'block',
    value: function block(node, parent) {
      var _this3 = this;

      // If nested rules exist, wrap current rule in new rule node
      if (this.raws.multiRule) {
        if (this.raws.multiRulePropVariable) {
          this.raws.multiRuleProp = '$' + this.raws.multiRuleProp;
        }
        var multiRule = Object.assign(postcss.rule(), {
          source: {
            start: {
              line: node.start.line - 1,
              column: node.start.column
            },
            end: node.end,
            input: this.input
          },
          raws: {
            before: this.raws.before || DEFAULT_RAWS_RULE.before,
            between: DEFAULT_RAWS_RULE.between
          },
          parent: parent,
          selector: (this.raws.customProperty ? '--' : '') + this.raws.multiRuleProp
        });
        parent.push(multiRule);
        parent = multiRule;
      }

      this.raws.before = '';

      // Looking for declaration node in block node
      node.content.forEach(function (contentNode) {
        return _this3.process(contentNode, parent);
      });
      if (this.raws.multiRule) {
        this.raws.beforeMulti = this.raws.before;
      }
    }
  }, {
    key: 'declaration',
    value: function declaration(node, parent) {
      var _this4 = this;

      var isBlockInside = false;
      // Create Declaration node
      var declarationNode = postcss.decl();
      declarationNode.prop = '';

      // Object to store raws for Declaration
      var declarationRaws = Object.assign(declarationNode.raws, {
        before: this.raws.before || DEFAULT_RAWS_DECL.before,
        between: DEFAULT_RAWS_DECL.between,
        semicolon: DEFAULT_RAWS_DECL.semicolon
      });

      this.raws.property = false;
      this.raws.betweenBefore = false;
      this.raws.comment = false;
      // Looking for property and value node in declaration node
      node.content.forEach(function (contentNode) {
        switch (contentNode.type) {
          case 'customProperty':
            _this4.raws.customProperty = true;
          // fall through
          case 'property':
            {
              /* this.raws.property to detect is property is already defined in current object */
              _this4.raws.property = true;
              _this4.raws.multiRuleProp = contentNode.content[0].content;
              _this4.raws.multiRulePropVariable = contentNode.content[0].type === 'variable';
              _this4.process(contentNode, declarationNode);
              break;
            }
          case 'propertyDelimiter':
            {
              if (_this4.raws.property && !_this4.raws.betweenBefore) {
                /* If property is already defined and there's no ':' before it */
                declarationRaws.between += contentNode.content;
                _this4.raws.multiRuleProp += contentNode.content;
              } else {
                /* If ':' goes before property declaration, like :width 100px */
                _this4.raws.betweenBefore = true;
                declarationRaws.before += contentNode.content;
                _this4.raws.multiRuleProp += contentNode.content;
              }
              break;
            }
          case 'space':
            {
              declarationRaws.between += contentNode.content;
              break;
            }
          case 'value':
            {
              // Look up for a value for current property
              switch (contentNode.content[0].type) {
                case 'block':
                  {
                    isBlockInside = true;
                    // If nested rules exist
                    if (Array.isArray(contentNode.content[0].content)) {
                      _this4.raws.multiRule = true;
                    }
                    _this4.process(contentNode.content[0], parent);
                    break;
                  }
                case 'variable':
                  {
                    declarationNode.value = '$';
                    _this4.process(contentNode, declarationNode);
                    break;
                  }
                case 'color':
                  {
                    declarationNode.value = '#';
                    _this4.process(contentNode, declarationNode);
                    break;
                  }
                case 'number':
                  {
                    if (contentNode.content.length > 1) {
                      declarationNode.value = contentNode.content.join('');
                    } else {
                      _this4.process(contentNode, declarationNode);
                    }
                    break;
                  }
                case 'parentheses':
                  {
                    declarationNode.value = '(';
                    _this4.process(contentNode, declarationNode);
                    break;
                  }
                default:
                  {
                    _this4.process(contentNode, declarationNode);
                  }
              }
              break;
            }
          default:
        }
      });

      if (!isBlockInside) {
        // Set parameters for Declaration node
        declarationNode.source = {
          start: node.start,
          end: node.end,
          input: this.input
        };
        declarationNode.parent = parent;
        parent.nodes.push(declarationNode);
      }

      this.raws.before = '';
      this.raws.customProperty = false;
      this.raws.multiRuleProp = '';
      this.raws.property = false;
    }
  }, {
    key: 'customProperty',
    value: function customProperty(node, parent) {
      this.property(node, parent);
      parent.prop = '--' + parent.prop;
    }
  }, {
    key: 'property',
    value: function property(node, parent) {
      // Set property for Declaration node
      switch (node.content[0].type) {
        case 'variable':
          {
            parent.prop += '$';
            break;
          }
        case 'interpolation':
          {
            this.raws.interpolation = true;
            parent.prop += '#{';
            break;
          }
        default:
      }
      parent.prop += node.content[0].content;
      if (this.raws.interpolation) {
        parent.prop += '}';
        this.raws.interpolation = false;
      }
    }
  }, {
    key: 'value',
    value: function value(node, parent) {
      if (!parent.value) {
        parent.value = '';
      }
      // Set value for Declaration node
      if (node.content.length) {
        node.content.forEach(function (contentNode) {
          switch (contentNode.type) {
            case 'important':
              {
                parent.raws.important = contentNode.content;
                parent.important = true;
                var match = parent.value.match(/^(.*?)(\s*)$/);
                if (match) {
                  parent.raws.important = match[2] + parent.raws.important;
                  parent.value = match[1];
                }
                break;
              }
            case 'parentheses':
              {
                parent.value += contentNode.content.join('') + ')';
                break;
              }
            case 'percentage':
              {
                parent.value += contentNode.content.join('') + '%';
                break;
              }
            default:
              {
                if (contentNode.content.constructor === Array) {
                  parent.value += contentNode.content.join('');
                } else {
                  parent.value += contentNode.content;
                }
              }
          }
        });
      }
    }
  }, {
    key: 'singlelineComment',
    value: function singlelineComment(node, parent) {
      return this.comment(node, parent, true);
    }
  }, {
    key: 'multilineComment',
    value: function multilineComment(node, parent) {
      return this.comment(node, parent, false);
    }
  }, {
    key: 'comment',
    value: function comment(node, parent, inline) {
      // https://github.com/nodesecurity/eslint-plugin-security#detect-unsafe-regex
      // eslint-disable-next-line security/detect-unsafe-regex
      var text = node.content.match(/^(\s*)((?:\S[\s\S]*?)?)(\s*)$/);

      this.raws.comment = true;

      var comment = Object.assign(postcss.comment(), {
        text: text[2],
        raws: {
          before: this.raws.before || DEFAULT_COMMENT_DECL.before,
          left: text[1],
          right: text[3],
          inline: inline
        },
        source: {
          start: {
            line: node.start.line,
            column: node.start.column
          },
          end: node.end,
          input: this.input
        },
        parent: parent
      });

      if (this.raws.beforeMulti) {
        comment.raws.before += this.raws.beforeMulti;
        this.raws.beforeMulti = undefined;
      }

      parent.nodes.push(comment);
      this.raws.before = '';
    }
  }, {
    key: 'space',
    value: function space(node, parent) {
      // Spaces before root and rule
      switch (parent.type) {
        case 'root':
          {
            this.raws.before += node.content;
            break;
          }
        case 'rule':
          {
            if (this.raws.comment) {
              this.raws.before += node.content;
            } else if (this.raws.loop) {
              parent.selector += node.content;
            } else {
              this.raws.before = (this.raws.before || '\n') + node.content;
            }
            break;
          }
        default:
      }
    }
  }, {
    key: 'declarationDelimiter',
    value: function declarationDelimiter(node) {
      this.raws.before += node.content;
    }
  }, {
    key: 'loop',
    value: function loop(node, parent) {
      var _this5 = this;

      var loop = postcss.rule();
      this.raws.comment = false;
      this.raws.multiRule = false;
      this.raws.loop = true;
      loop.selector = '';
      loop.raws = {
        before: this.raws.before || DEFAULT_RAWS_RULE.before,
        between: DEFAULT_RAWS_RULE.between
      };
      if (this.raws.beforeMulti) {
        loop.raws.before += this.raws.beforeMulti;
        this.raws.beforeMulti = undefined;
      }
      node.content.forEach(function (contentNode, i) {
        if (node.content[i + 1] && node.content[i + 1].type === 'block') {
          _this5.raws.loop = false;
        }
        _this5.process(contentNode, loop);
      });
      parent.nodes.push(loop);
      this.raws.loop = false;
    }
  }, {
    key: 'atkeyword',
    value: function atkeyword(node, parent) {
      parent.selector += '@' + node.content;
    }
  }, {
    key: 'operator',
    value: function operator(node, parent) {
      parent.selector += node.content;
    }
  }, {
    key: 'variable',
    value: function variable(node, parent) {
      if (this.raws.loop) {
        parent.selector += '$' + node.content[0].content;
      } else {
        parent.selector += '#' + node.content[0].content;
      }
    }
  }, {
    key: 'ident',
    value: function ident(node, parent) {
      parent.selector += node.content;
    }
  }]);

  return SassParser;
}();

module.exports = SassParser;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlci5lczYiXSwibmFtZXMiOlsicG9zdGNzcyIsInJlcXVpcmUiLCJnb256YWxlcyIsIkRFRkFVTFRfUkFXU19ST09UIiwiYmVmb3JlIiwiREVGQVVMVF9SQVdTX1JVTEUiLCJiZXR3ZWVuIiwiREVGQVVMVF9SQVdTX0RFQ0wiLCJzZW1pY29sb24iLCJERUZBVUxUX0NPTU1FTlRfREVDTCIsImxlZnQiLCJyaWdodCIsIlNhc3NQYXJzZXIiLCJpbnB1dCIsIm5vZGUiLCJwYXJzZSIsImNzcyIsInN5bnRheCIsImVycm9yIiwibWVzc2FnZSIsImxpbmUiLCJsaW5lcyIsIm1hdGNoIiwicm9vdCIsInN0eWxlc2hlZXQiLCJzdGFydCIsImVuZCIsIm5vZGVMaW5lcyIsInNsaWNlIiwic3Vic3RyaW5nIiwiY29sdW1uIiwibGFzdCIsImxlbmd0aCIsImpvaW4iLCJzb3VyY2UiLCJyYXdzIiwiY29udGVudCIsImZvckVhY2giLCJwcm9jZXNzIiwiY29udGVudE5vZGUiLCJwYXJlbnQiLCJ0eXBlIiwibXVsdGlSdWxlUHJvcCIsInJ1bGUiLCJzZWxlY3RvciIsInJ1bGVSYXdzIiwiY29tbWVudCIsImZpbHRlciIsImlubmVyQ29udGVudE5vZGUiLCJub2RlcyIsImV4dHJhY3RTb3VyY2UiLCJyZXBsYWNlIiwic3BhY2VzIiwicHVzaCIsIm11bHRpUnVsZSIsIm11bHRpUnVsZVByb3BWYXJpYWJsZSIsIk9iamVjdCIsImFzc2lnbiIsImN1c3RvbVByb3BlcnR5IiwiYmVmb3JlTXVsdGkiLCJpc0Jsb2NrSW5zaWRlIiwiZGVjbGFyYXRpb25Ob2RlIiwiZGVjbCIsInByb3AiLCJkZWNsYXJhdGlvblJhd3MiLCJwcm9wZXJ0eSIsImJldHdlZW5CZWZvcmUiLCJBcnJheSIsImlzQXJyYXkiLCJ2YWx1ZSIsImludGVycG9sYXRpb24iLCJpbXBvcnRhbnQiLCJjb25zdHJ1Y3RvciIsImlubGluZSIsInRleHQiLCJ1bmRlZmluZWQiLCJsb29wIiwiaSIsIm1vZHVsZSIs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LFVBQWpCIiwiZmlsZSI6InBhcnNlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHBvc3Rjc3MgPSByZXF1aXJlKCdwb3N0Y3NzJylcbmNvbnN0IGdvbnphbGVzID0gcmVxdWlyZSgnZ29uemFsZXMtcGUnKVxuXG5jb25zdCBERUZBVUxUX1JBV1NfUk9PVCA9IHtcbiAgYmVmb3JlOiAnJ1xufVxuXG5jb25zdCBERUZBVUxUX1JBV1NfUlVMRSA9IHtcbiAgYmVmb3JlOiAnJyxcbiAgYmV0d2VlbjogJydcbn1cblxuY29uc3QgREVGQVVMVF9SQVdTX0RFQ0wgPSB7XG4gIGJlZm9yZTogJycsXG4gIGJldHdlZW46ICcnLFxuICBzZW1pY29sb246IGZhbHNlXG59XG5cbmNvbnN0IERFRkFVTFRfQ09NTUVOVF9ERUNMID0ge1xuICBiZWZvcmU6ICcnLFxuICBsZWZ0OiAnJyxcbiAgcmlnaHQ6ICcnXG59XG5cbmNsYXNzIFNhc3NQYXJzZXIge1xuICBjb25zdHJ1Y3RvciAoaW5wdXQpIHtcbiAgICB0aGlzLmlucHV0ID0gaW5wdXRcbiAgfVxuICBwYXJzZSAoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMubm9kZSA9IGdvbnphbGVzLnBhcnNlKHRoaXMuaW5wdXQuY3NzLCB7IHN5bnRheDogJ3Nhc3MnIH0pXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRocm93IHRoaXMuaW5wdXQuZXJyb3IoZXJyb3IubWVzc2FnZSwgZXJyb3IubGluZSwgMSlcbiAgICB9XG4gICAgdGhpcy5saW5lcyA9IHRoaXMuaW5wdXQuY3NzLm1hdGNoKC9eLiooXFxyP1xcbnwkKS9nbSlcbiAgICB0aGlzLnJvb3QgPSB0aGlzLnN0eWxlc2hlZXQodGhpcy5ub2RlKVxuICB9XG4gIGV4dHJhY3RTb3VyY2UgKHN0YXJ0LCBlbmQpIHtcbiAgICBsZXQgbm9kZUxpbmVzID0gdGhpcy5saW5lcy5zbGljZShcbiAgICAgIHN0YXJ0LmxpbmUgLSAxLFxuICAgICAgZW5kLmxpbmVcbiAgICApXG5cbiAgICBub2RlTGluZXNbMF0gPSBub2RlTGluZXNbMF0uc3Vic3RyaW5nKHN0YXJ0LmNvbHVtbiAtIDEpXG4gICAgbGV0IGxhc3QgPSBub2RlTGluZXMubGVuZ3RoIC0gMVxuICAgIG5vZGVMaW5lc1tsYXN0XSA9IG5vZGVMaW5lc1tsYXN0XS5zdWJzdHJpbmcoMCwgZW5kLmNvbHVtbilcblxuICAgIHJldHVybiBub2RlTGluZXMuam9pbignJylcbiAgfVxuICBzdHlsZXNoZWV0IChub2RlKSB7XG4gICAgLy8gQ3JlYXRlIGFuZCBzZXQgcGFyYW1ldGVycyBmb3IgUm9vdCBub2RlXG4gICAgbGV0IHJvb3QgPSBwb3N0Y3NzLnJvb3QoKVxuICAgIHJvb3Quc291cmNlID0ge1xuICAgICAgc3RhcnQ6IG5vZGUuc3RhcnQsXG4gICAgICBlbmQ6IG5vZGUuZW5kLFxuICAgICAgaW5wdXQ6IHRoaXMuaW5wdXRcbiAgICB9XG4gICAgLy8gUmF3cyBmb3Igcm9vdCBub2RlXG4gICAgcm9vdC5yYXdzID0ge1xuICAgICAgc2VtaWNvbG9uOiBERUZBVUxUX1JBV1NfUk9PVC5zZW1pY29sb24sXG4gICAgICBiZWZvcmU6IERFRkFVTFRfUkFXU19ST09ULmJlZm9yZVxuICAgIH1cbiAgICAvLyBTdG9yZSBzcGFjZXMgYmVmb3JlIHJvb3QgKGlmIGV4aXN0KVxuICAgIHRoaXMucmF3cyA9IHtcbiAgICAgIGJlZm9yZTogJydcbiAgICB9XG4gICAgbm9kZS5jb250ZW50LmZvckVhY2goY29udGVudE5vZGUgPT4gdGhpcy5wcm9jZXNzKGNvbnRlbnROb2RlLCByb290KSlcbiAgICByZXR1cm4gcm9vdFxuICB9XG4gIHByb2Nlc3MgKG5vZGUsIHBhcmVudCkge1xuICAgIGlmICh0aGlzW25vZGUudHlwZV0pIHtcbiAgICAgIHJldHVybiB0aGlzW25vZGUudHlwZV0obm9kZSwgcGFyZW50KSB8fCBudWxsXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG4gIHJ1bGVzZXQgKG5vZGUsIHBhcmVudCkge1xuICAgIC8vIExvb3AgdG8gZmluZCB0aGUgZGVlcGVzdCBydWxlc2V0IG5vZGVcbiAgICB0aGlzLnJhd3MubXVsdGlSdWxlUHJvcCA9ICcnXG5cbiAgICBub2RlLmNvbnRlbnQuZm9yRWFjaChjb250ZW50Tm9kZSA9PiB7XG4gICAgICBzd2l0Y2ggKGNvbnRlbnROb2RlLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnYmxvY2snOiB7XG4gICAgICAgICAgLy8gQ3JlYXRlIFJ1bGUgbm9kZVxuICAgICAgICAgIGxldCBydWxlID0gcG9zdGNzcy5ydWxlKClcbiAgICAgICAgICBydWxlLnNlbGVjdG9yID0gJydcbiAgICAgICAgICAvLyBPYmplY3QgdG8gc3RvcmUgcmF3cyBmb3IgUnVsZVxuICAgICAgICAgIGxldCBydWxlUmF3cyA9IHtcbiAgICAgICAgICAgIGJlZm9yZTogdGhpcy5yYXdzLmJlZm9yZSB8fCBERUZBVUxUX1JBV1NfUlVMRS5iZWZvcmUsXG4gICAgICAgICAgICBiZXR3ZWVuOiBERUZBVUxUX1JBV1NfUlVMRS5iZXR3ZWVuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gVmFyaWFibGUgdG8gc3RvcmUgc3BhY2VzIGFuZCBzeW1ib2xzIGJlZm9yZSBkZWNsYXJhdGlvbiBwcm9wZXJ0eVxuICAgICAgICAgIHRoaXMucmF3cy5iZWZvcmUgPSAnJ1xuICAgICAgICAgIHRoaXMucmF3cy5jb21tZW50ID0gZmFsc2VcblxuICAgICAgICAgIC8vIExvb2sgdXAgdGhyb3cgYWxsIG5vZGVzIGluIGN1cnJlbnQgcnVsZXNldCBub2RlXG4gICAgICAgICAgbm9kZS5jb250ZW50XG4gICAgICAgICAgICAuZmlsdGVyKGNvbnRlbnQgPT4gY29udGVudC50eXBlID09PSAnYmxvY2snKVxuICAgICAgICAgICAgLmZvckVhY2goaW5uZXJDb250ZW50Tm9kZSA9PiB0aGlzLnByb2Nlc3MoaW5uZXJDb250ZW50Tm9kZSwgcnVsZSkpXG5cbiAgICAgICAgICBpZiAocnVsZS5ub2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIFdyaXRlIHNlbGVjdG9yIHRvIFJ1bGVcbiAgICAgICAgICAgIHJ1bGUuc2VsZWN0b3IgPSB0aGlzLmV4dHJhY3RTb3VyY2UoXG4gICAgICAgICAgICAgIG5vZGUuc3RhcnQsXG4gICAgICAgICAgICAgIGNvbnRlbnROb2RlLnN0YXJ0XG4gICAgICAgICAgICApLnNsaWNlKDAsIC0xKS5yZXBsYWNlKC9cXHMrJC8sIHNwYWNlcyA9PiB7XG4gICAgICAgICAgICAgIHJ1bGVSYXdzLmJldHdlZW4gPSBzcGFjZXNcbiAgICAgICAgICAgICAgcmV0dXJuICcnXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLy8gU2V0IHBhcmFtZXRlcnMgZm9yIFJ1bGUgbm9kZVxuICAgICAgICAgICAgcnVsZS5wYXJlbnQgPSBwYXJlbnRcbiAgICAgICAgICAgIHJ1bGUuc291cmNlID0ge1xuICAgICAgICAgICAgICBzdGFydDogbm9kZS5zdGFydCxcbiAgICAgICAgICAgICAgZW5kOiBub2RlLmVuZCxcbiAgICAgICAgICAgICAgaW5wdXQ6IHRoaXMuaW5wdXRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJ1bGUucmF3cyA9IHJ1bGVSYXdzXG4gICAgICAgICAgICBwYXJlbnQubm9kZXMucHVzaChydWxlKVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBibG9jayAobm9kZSwgcGFyZW50KSB7XG4gICAgLy8gSWYgbmVzdGVkIHJ1bGVzIGV4aXN0LCB3cmFwIGN1cnJlbnQgcnVsZSBpbiBuZXcgcnVsZSBub2RlXG4gICAgaWYgKHRoaXMucmF3cy5tdWx0aVJ1bGUpIHtcbiAgICAgIGlmICh0aGlzLnJhd3MubXVsdGlSdWxlUHJvcFZhcmlhYmxlKSB7XG4gICAgICAgIHRoaXMucmF3cy5tdWx0aVJ1bGVQcm9wID0gYCQkeyB0aGlzLnJhd3MubXVsdGlSdWxlUHJvcCB9YFxuICAgICAgfVxuICAgICAgbGV0IG11bHRpUnVsZSA9IE9iamVjdC5hc3NpZ24ocG9zdGNzcy5ydWxlKCksIHtcbiAgICAgICAgc291cmNlOiB7XG4gICAgICAgICAgc3RhcnQ6IHtcbiAgICAgICAgICAgIGxpbmU6IG5vZGUuc3RhcnQubGluZSAtIDEsXG4gICAgICAgICAgICBjb2x1bW46IG5vZGUuc3RhcnQuY29sdW1uXG4gICAgICAgICAgfSxcbiAgICAgICAgICBlbmQ6IG5vZGUuZW5kLFxuICAgICAgICAgIGlucHV0OiB0aGlzLmlucHV0XG4gICAgICAgIH0sXG4gICAgICAgIHJhd3M6IHtcbiAgICAgICAgICBiZWZvcmU6IHRoaXMucmF3cy5iZWZvcmUgfHwgREVGQVVMVF9SQVdTX1JVTEUuYmVmb3JlLFxuICAgICAgICAgIGJldHdlZW46IERFRkFVTFRfUkFXU19SVUxFLmJldHdlZW5cbiAgICAgICAgfSxcbiAgICAgICAgcGFyZW50LFxuICAgICAgICBzZWxlY3RvcjogKHRoaXMucmF3cy5jdXN0b21Qcm9wZXJ0eSA/ICctLScgOiAnJykgKyB0aGlzLnJhd3MubXVsdGlSdWxlUHJvcFxuICAgICAgfSlcbiAgICAgIHBhcmVudC5wdXNoKG11bHRpUnVsZSlcbiAgICAgIHBhcmVudCA9IG11bHRpUnVsZVxuICAgIH1cblxuICAgIHRoaXMucmF3cy5iZWZvcmUgPSAnJ1xuXG4gICAgLy8gTG9va2luZyBmb3IgZGVjbGFyYXRpb24gbm9kZSBpbiBibG9jayBub2RlXG4gICAgbm9kZS5jb250ZW50LmZvckVhY2goY29udGVudE5vZGUgPT4gdGhpcy5wcm9jZXNzKGNvbnRlbnROb2RlLCBwYXJlbnQpKVxuICAgIGlmICh0aGlzLnJhd3MubXVsdGlSdWxlKSB7XG4gICAgICB0aGlzLnJhd3MuYmVmb3JlTXVsdGkgPSB0aGlzLnJhd3MuYmVmb3JlXG4gICAgfVxuICB9XG4gIGRlY2xhcmF0aW9uIChub2RlLCBwYXJlbnQpIHtcbiAgICBsZXQgaXNCbG9ja0luc2lkZSA9IGZhbHNlXG4gICAgLy8gQ3JlYXRlIERlY2xhcmF0aW9uIG5vZGVcbiAgICBsZXQgZGVjbGFyYXRpb25Ob2RlID0gcG9zdGNzcy5kZWNsKClcbiAgICBkZWNsYXJhdGlvbk5vZGUucHJvcCA9ICcnXG5cbiAgICAvLyBPYmplY3QgdG8gc3RvcmUgcmF3cyBmb3IgRGVjbGFyYXRpb25cbiAgICBsZXQgZGVjbGFyYXRpb25SYXdzID0gT2JqZWN0LmFzc2lnbihkZWNsYXJhdGlvbk5vZGUucmF3cywge1xuICAgICAgYmVmb3JlOiB0aGlzLnJhd3MuYmVmb3JlIHx8IERFRkFVTFRfUkFXU19ERUNMLmJlZm9yZSxcbiAgICAgIGJldHdlZW46IERFRkFVTFRfUkFXU19ERUNMLmJldHdlZW4sXG4gICAgICBzZW1pY29sb246IERFRkFVTFRfUkFXU19ERUNMLnNlbWljb2xvblxuICAgIH0pXG5cbiAgICB0aGlzLnJhd3MucHJvcGVydHkgPSBmYWxzZVxuICAgIHRoaXMucmF3cy5iZXR3ZWVuQmVmb3JlID0gZmFsc2VcbiAgICB0aGlzLnJhd3MuY29tbWVudCA9IGZhbHNlXG4gICAgLy8gTG9va2luZyBmb3IgcHJvcGVydHkgYW5kIHZhbHVlIG5vZGUgaW4gZGVjbGFyYXRpb24gbm9kZVxuICAgIG5vZGUuY29udGVudC5mb3JFYWNoKGNvbnRlbnROb2RlID0+IHtcbiAgICAgIHN3aXRjaCAoY29udGVudE5vZGUudHlwZSkge1xuICAgICAgICBjYXNlICdjdXN0b21Qcm9wZXJ0eSc6XG4gICAgICAgICAgdGhpcy5yYXdzLmN1c3RvbVByb3BlcnR5ID0gdHJ1ZVxuICAgICAgICAgIC8vIGZhbGwgdGhyb3VnaFxuICAgICAgICBjYXNlICdwcm9wZXJ0eSc6IHtcbiAgICAgICAgICAvKiB0aGlzLnJhd3MucHJvcGVydHkgdG8gZGV0ZWN0IGlzIHByb3BlcnR5IGlzIGFscmVhZHkgZGVmaW5lZCBpbiBjdXJyZW50IG9iamVjdCAqL1xuICAgICAgICAgIHRoaXMucmF3cy5wcm9wZXJ0eSA9IHRydWVcbiAgICAgICAgICB0aGlzLnJhd3MubXVsdGlSdWxlUHJvcCA9IGNvbnRlbnROb2RlLmNvbnRlbnRbMF0uY29udGVudFxuICAgICAgICAgIHRoaXMucmF3cy5tdWx0aVJ1bGVQcm9wVmFyaWFibGUgPSBjb250ZW50Tm9kZS5jb250ZW50WzBdLnR5cGUgPT09ICd2YXJpYWJsZSdcbiAgICAgICAgICB0aGlzLnByb2Nlc3MoY29udGVudE5vZGUsIGRlY2xhcmF0aW9uTm9kZSlcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ3Byb3BlcnR5RGVsaW1pdGVyJzoge1xuICAgICAgICAgIGlmICh0aGlzLnJhd3MucHJvcGVydHkgJiYgIXRoaXMucmF3cy5iZXR3ZWVuQmVmb3JlKSB7XG4gICAgICAgICAgICAvKiBJZiBwcm9wZXJ0eSBpcyBhbHJlYWR5IGRlZmluZWQgYW5kIHRoZXJlJ3Mgbm8gJzonIGJlZm9yZSBpdCAqL1xuICAgICAgICAgICAgZGVjbGFyYXRpb25SYXdzLmJldHdlZW4gKz0gY29udGVudE5vZGUuY29udGVudFxuICAgICAgICAgICAgdGhpcy5yYXdzLm11bHRpUnVsZVByb3AgKz0gY29udGVudE5vZGUuY29udGVudFxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvKiBJZiAnOicgZ29lcyBiZWZvcmUgcHJvcGVydHkgZGVjbGFyYXRpb24sIGxpa2UgOndpZHRoIDEwMHB4ICovXG4gICAgICAgICAgICB0aGlzLnJhd3MuYmV0d2VlbkJlZm9yZSA9IHRydWVcbiAgICAgICAgICAgIGRlY2xhcmF0aW9uUmF3cy5iZWZvcmUgKz0gY29udGVudE5vZGUuY29udGVudFxuICAgICAgICAgICAgdGhpcy5yYXdzLm11bHRpUnVsZVByb3AgKz0gY29udGVudE5vZGUuY29udGVudFxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ3NwYWNlJzoge1xuICAgICAgICAgIGRlY2xhcmF0aW9uUmF3cy5iZXR3ZWVuICs9IGNvbnRlbnROb2RlLmNvbnRlbnRcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIGNhc2UgJ3ZhbHVlJzoge1xuICAgICAgICAgIC8vIExvb2sgdXAgZm9yIGEgdmFsdWUgZm9yIGN1cnJlbnQgcHJvcGVydHlcbiAgICAgICAgICBzd2l0Y2ggKGNvbnRlbnROb2RlLmNvbnRlbnRbMF0udHlwZSkge1xuICAgICAgICAgICAgY2FzZSAnYmxvY2snOiB7XG4gICAgICAgICAgICAgIGlzQmxvY2tJbnNpZGUgPSB0cnVlXG4gICAgICAgICAgICAgIC8vIElmIG5lc3RlZCBydWxlcyBleGlzdFxuICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjb250ZW50Tm9kZS5jb250ZW50WzBdLmNvbnRlbnQpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yYXdzLm11bHRpUnVsZSA9IHRydWVcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB0aGlzLnByb2Nlc3MoY29udGVudE5vZGUuY29udGVudFswXSwgcGFyZW50KVxuICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSAndmFyaWFibGUnOiB7XG4gICAgICAgICAgICAgIGRlY2xhcmF0aW9uTm9kZS52YWx1ZSA9ICckJ1xuICAgICAgICAgICAgICB0aGlzLnByb2Nlc3MoY29udGVudE5vZGUsIGRlY2xhcmF0aW9uTm9kZSlcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ2NvbG9yJzoge1xuICAgICAgICAgICAgICBkZWNsYXJhdGlvbk5vZGUudmFsdWUgPSAnIydcbiAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzKGNvbnRlbnROb2RlLCBkZWNsYXJhdGlvbk5vZGUpXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlICdudW1iZXInOiB7XG4gICAgICAgICAgICAgIGlmIChjb250ZW50Tm9kZS5jb250ZW50Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBkZWNsYXJhdGlvbk5vZGUudmFsdWUgPSBjb250ZW50Tm9kZS5jb250ZW50LmpvaW4oJycpXG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzKGNvbnRlbnROb2RlLCBkZWNsYXJhdGlvbk5vZGUpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgJ3BhcmVudGhlc2VzJzoge1xuICAgICAgICAgICAgICBkZWNsYXJhdGlvbk5vZGUudmFsdWUgPSAnKCdcbiAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzKGNvbnRlbnROb2RlLCBkZWNsYXJhdGlvbk5vZGUpXG4gICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgIHRoaXMucHJvY2Vzcyhjb250ZW50Tm9kZSwgZGVjbGFyYXRpb25Ob2RlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICB9XG4gICAgfSlcblxuICAgIGlmICghaXNCbG9ja0luc2lkZSkge1xuICAgICAgLy8gU2V0IHBhcmFtZXRlcnMgZm9yIERlY2xhcmF0aW9uIG5vZGVcbiAgICAgIGRlY2xhcmF0aW9uTm9kZS5zb3VyY2UgPSB7XG4gICAgICAgIHN0YXJ0OiBub2RlLnN0YXJ0LFxuICAgICAgICBlbmQ6IG5vZGUuZW5kLFxuICAgICAgICBpbnB1dDogdGhpcy5pbnB1dFxuICAgICAgfVxuICAgICAgZGVjbGFyYXRpb25Ob2RlLnBhcmVudCA9IHBhcmVudFxuICAgICAgcGFyZW50Lm5vZGVzLnB1c2goZGVjbGFyYXRpb25Ob2RlKVxuICAgIH1cblxuICAgIHRoaXMucmF3cy5iZWZvcmUgPSAnJ1xuICAgIHRoaXMucmF3cy5jdXN0b21Qcm9wZXJ0eSA9IGZhbHNlXG4gICAgdGhpcy5yYXdzLm11bHRpUnVsZVByb3AgPSAnJ1xuICAgIHRoaXMucmF3cy5wcm9wZXJ0eSA9IGZhbHNlXG4gIH1cbiAgY3VzdG9tUHJvcGVydHkgKG5vZGUsIHBhcmVudCkge1xuICAgIHRoaXMucHJvcGVydHkobm9kZSwgcGFyZW50KVxuICAgIHBhcmVudC5wcm9wID0gYC0tJHsgcGFyZW50LnByb3AgfWBcbiAgfVxuICBwcm9wZXJ0eSAobm9kZSwgcGFyZW50KSB7XG4gICAgLy8gU2V0IHByb3BlcnR5IGZvciBEZWNsYXJhdGlvbiBub2RlXG4gICAgc3dpdGNoIChub2RlLmNvbnRlbnRbMF0udHlwZSkge1xuICAgICAgY2FzZSAndmFyaWFibGUnOiB7XG4gICAgICAgIHBhcmVudC5wcm9wICs9ICckJ1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgY2FzZSAnaW50ZXJwb2xhdGlvbic6IHtcbiAgICAgICAgdGhpcy5yYXdzLmludGVycG9sYXRpb24gPSB0cnVlXG4gICAgICAgIHBhcmVudC5wcm9wICs9ICcjeydcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgfVxuICAgIHBhcmVudC5wcm9wICs9IG5vZGUuY29udGVudFswXS5jb250ZW50XG4gICAgaWYgKHRoaXMucmF3cy5pbnRlcnBvbGF0aW9uKSB7XG4gICAgICBwYXJlbnQucHJvcCArPSAnfSdcbiAgICAgIHRoaXMucmF3cy5pbnRlcnBvbGF0aW9uID0gZmFsc2VcbiAgICB9XG4gIH1cbiAgdmFsdWUgKG5vZGUsIHBhcmVudCkge1xuICAgIGlmICghcGFyZW50LnZhbHVlKSB7XG4gICAgICBwYXJlbnQudmFsdWUgPSAnJ1xuICAgIH1cbiAgICAvLyBTZXQgdmFsdWUgZm9yIERlY2xhcmF0aW9uIG5vZGVcbiAgICBpZiAobm9kZS5jb250ZW50Lmxlbmd0aCkge1xuICAgICAgbm9kZS5jb250ZW50LmZvckVhY2goY29udGVudE5vZGUgPT4ge1xuICAgICAgICBzd2l0Y2ggKGNvbnRlbnROb2RlLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICdpbXBvcnRhbnQnOiB7XG4gICAgICAgICAgICBwYXJlbnQucmF3cy5pbXBvcnRhbnQgPSBjb250ZW50Tm9kZS5jb250ZW50XG4gICAgICAgICAgICBwYXJlbnQuaW1wb3J0YW50ID0gdHJ1ZVxuICAgICAgICAgICAgbGV0IG1hdGNoID0gcGFyZW50LnZhbHVlLm1hdGNoKC9eKC4qPykoXFxzKikkLylcbiAgICAgICAgICAgIGlmIChtYXRjaCkge1xuICAgICAgICAgICAgICBwYXJlbnQucmF3cy5pbXBvcnRhbnQgPSBtYXRjaFsyXSArIHBhcmVudC5yYXdzLmltcG9ydGFudFxuICAgICAgICAgICAgICBwYXJlbnQudmFsdWUgPSBtYXRjaFsxXVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FzZSAncGFyZW50aGVzZXMnOiB7XG4gICAgICAgICAgICBwYXJlbnQudmFsdWUgKz0gY29udGVudE5vZGUuY29udGVudC5qb2luKCcnKSArICcpJ1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FzZSAncGVyY2VudGFnZSc6IHtcbiAgICAgICAgICAgIHBhcmVudC52YWx1ZSArPSBjb250ZW50Tm9kZS5jb250ZW50LmpvaW4oJycpICsgJyUnXG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICBpZiAoY29udGVudE5vZGUuY29udGVudC5jb25zdHJ1Y3RvciA9PT0gQXJyYXkpIHtcbiAgICAgICAgICAgICAgcGFyZW50LnZhbHVlICs9IGNvbnRlbnROb2RlLmNvbnRlbnQuam9pbignJylcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBhcmVudC52YWx1ZSArPSBjb250ZW50Tm9kZS5jb250ZW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuICBzaW5nbGVsaW5lQ29tbWVudCAobm9kZSwgcGFyZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuY29tbWVudChub2RlLCBwYXJlbnQsIHRydWUpXG4gIH1cbiAgbXVsdGlsaW5lQ29tbWVudCAobm9kZSwgcGFyZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuY29tbWVudChub2RlLCBwYXJlbnQsIGZhbHNlKVxuICB9XG4gIGNvbW1lbnQgKG5vZGUsIHBhcmVudCwgaW5saW5lKSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGVzZWN1cml0eS9lc2xpbnQtcGx1Z2luLXNlY3VyaXR5I2RldGVjdC11bnNhZmUtcmVnZXhcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgc2VjdXJpdHkvZGV0ZWN0LXVuc2FmZS1yZWdleFxuICAgIGxldCB0ZXh0ID0gbm9kZS5jb250ZW50Lm1hdGNoKC9eKFxccyopKCg/OlxcU1tcXHNcXFNdKj8pPykoXFxzKikkLylcblxuICAgIHRoaXMucmF3cy5jb21tZW50ID0gdHJ1ZVxuXG4gICAgbGV0IGNvbW1lbnQgPSBPYmplY3QuYXNzaWduKHBvc3Rjc3MuY29tbWVudCgpLCB7XG4gICAgICB0ZXh0OiB0ZXh0WzJdLFxuICAgICAgcmF3czoge1xuICAgICAgICBiZWZvcmU6IHRoaXMucmF3cy5iZWZvcmUgfHwgREVGQVVMVF9DT01NRU5UX0RFQ0wuYmVmb3JlLFxuICAgICAgICBsZWZ0OiB0ZXh0WzFdLFxuICAgICAgICByaWdodDogdGV4dFszXSxcbiAgICAgICAgaW5saW5lXG4gICAgICB9LFxuICAgICAgc291cmNlOiB7XG4gICAgICAgIHN0YXJ0OiB7XG4gICAgICAgICAgbGluZTogbm9kZS5zdGFydC5saW5lLFxuICAgICAgICAgIGNvbHVtbjogbm9kZS5zdGFydC5jb2x1bW5cbiAgICAgICAgfSxcbiAgICAgICAgZW5kOiBub2RlLmVuZCxcbiAgICAgICAgaW5wdXQ6IHRoaXMuaW5wdXRcbiAgICAgIH0sXG4gICAgICBwYXJlbnRcbiAgICB9KVxuXG4gICAgaWYgKHRoaXMucmF3cy5iZWZvcmVNdWx0aSkge1xuICAgICAgY29tbWVudC5yYXdzLmJlZm9yZSArPSB0aGlzLnJhd3MuYmVmb3JlTXVsdGlcbiAgICAgIHRoaXMucmF3cy5iZWZvcmVNdWx0aSA9IHVuZGVmaW5lZFxuICAgIH1cblxuICAgIHBhcmVudC5ub2Rlcy5wdXNoKGNvbW1lbnQpXG4gICAgdGhpcy5yYXdzLmJlZm9yZSA9ICcnXG4gIH1cbiAgc3BhY2UgKG5vZGUsIHBhcmVudCkge1xuICAgIC8vIFNwYWNlcyBiZWZvcmUgcm9vdCBhbmQgcnVsZVxuICAgIHN3aXRjaCAocGFyZW50LnR5cGUpIHtcbiAgICAgIGNhc2UgJ3Jvb3QnOiB7XG4gICAgICAgIHRoaXMucmF3cy5iZWZvcmUgKz0gbm9kZS5jb250ZW50XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBjYXNlICdydWxlJzoge1xuICAgICAgICBpZiAodGhpcy5yYXdzLmNvbW1lbnQpIHtcbiAgICAgICAgICB0aGlzLnJhd3MuYmVmb3JlICs9IG5vZGUuY29udGVudFxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmF3cy5sb29wKSB7XG4gICAgICAgICAgcGFyZW50LnNlbGVjdG9yICs9IG5vZGUuY29udGVudFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRoaXMucmF3cy5iZWZvcmUgPSAodGhpcy5yYXdzLmJlZm9yZSB8fCAnXFxuJykgKyBub2RlLmNvbnRlbnRcbiAgICAgICAgfVxuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICB9XG4gIH1cbiAgZGVjbGFyYXRpb25EZWxpbWl0ZXIgKG5vZGUpIHtcbiAgICB0aGlzLnJhd3MuYmVmb3JlICs9IG5vZGUuY29udGVudFxuICB9XG4gIGxvb3AgKG5vZGUsIHBhcmVudCkge1xuICAgIGxldCBsb29wID0gcG9zdGNzcy5ydWxlKClcbiAgICB0aGlzLnJhd3MuY29tbWVudCA9IGZhbHNlXG4gICAgdGhpcy5yYXdzLm11bHRpUnVsZSA9IGZhbHNlXG4gICAgdGhpcy5yYXdzLmxvb3AgPSB0cnVlXG4gICAgbG9vcC5zZWxlY3RvciA9ICcnXG4gICAgbG9vcC5yYXdzID0ge1xuICAgICAgYmVmb3JlOiB0aGlzLnJhd3MuYmVmb3JlIHx8IERFRkFVTFRfUkFXU19SVUxFLmJlZm9yZSxcbiAgICAgIGJldHdlZW46IERFRkFVTFRfUkFXU19SVUxFLmJldHdlZW5cbiAgICB9XG4gICAgaWYgKHRoaXMucmF3cy5iZWZvcmVNdWx0aSkge1xuICAgICAgbG9vcC5yYXdzLmJlZm9yZSArPSB0aGlzLnJhd3MuYmVmb3JlTXVsdGlcbiAgICAgIHRoaXMucmF3cy5iZWZvcmVNdWx0aSA9IHVuZGVmaW5lZFxuICAgIH1cbiAgICBub2RlLmNvbnRlbnQuZm9yRWFjaCgoY29udGVudE5vZGUsIGkpID0+IHtcbiAgICAgIGlmIChub2RlLmNvbnRlbnRbaSArIDFdICYmIG5vZGUuY29udGVudFtpICsgMV0udHlwZSA9PT0gJ2Jsb2NrJykge1xuICAgICAgICB0aGlzLnJhd3MubG9vcCA9IGZhbHNlXG4gICAgICB9XG4gICAgICB0aGlzLnByb2Nlc3MoY29udGVudE5vZGUsIGxvb3ApXG4gICAgfSlcbiAgICBwYXJlbnQubm9kZXMucHVzaChsb29wKVxuICAgIHRoaXMucmF3cy5sb29wID0gZmFsc2VcbiAgfVxuICBhdGtleXdvcmQgKG5vZGUsIHBhcmVudCkge1xuICAgIHBhcmVudC5zZWxlY3RvciArPSBgQCR7IG5vZGUuY29udGVudCB9YFxuICB9XG4gIG9wZXJhdG9yIChub2RlLCBwYXJlbnQpIHtcbiAgICBwYXJlbnQuc2VsZWN0b3IgKz0gbm9kZS5jb250ZW50XG4gIH1cbiAgdmFyaWFibGUgKG5vZGUsIHBhcmVudCkge1xuICAgIGlmICh0aGlzLnJhd3MubG9vcCkge1xuICAgICAgcGFyZW50LnNlbGVjdG9yICs9IGAkJHsgbm9kZS5jb250ZW50WzBdLmNvbnRlbnQgfWBcbiAgICB9IGVsc2Uge1xuICAgICAgcGFyZW50LnNlbGVjdG9yICs9IGAjJHsgbm9kZS5jb250ZW50WzBdLmNvbnRlbnQgfWBcbiAgICB9XG4gIH1cbiAgaWRlbnQgKG5vZGUsIHBhcmVudCkge1xuICAgIHBhcmVudC5zZWxlY3RvciArPSBub2RlLmNvbnRlbnRcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNhc3NQYXJzZXJcbiJdfQ==