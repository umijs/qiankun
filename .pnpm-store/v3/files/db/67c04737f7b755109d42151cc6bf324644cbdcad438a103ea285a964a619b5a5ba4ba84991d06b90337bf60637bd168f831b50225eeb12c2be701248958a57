const matchesStringOrRegExp = require("./utils/matchesStringOrRegExp");
const stylelint = require("stylelint");
const vendorPrefixes = require("./utils/vendorPrefixes");
const report = stylelint.utils.report;
const ruleMessages = stylelint.utils.ruleMessages;
const validateOptions = stylelint.utils.validateOptions;

const ruleName = "plugin/declaration-block-no-ignored-properties";

const messages = ruleMessages(ruleName, {
  rejected: (ignore, cause) => `Unexpected "${ignore}" with "${cause}"`,
});

const ignored = [
  {
    property: "display",
    value: "inline",
    ignoredProperties: [
      "width",
      "min-width",
      "max-width",
      "height",
      "min-height",
      "max-height",
      "margin",
      "margin-top",
      "margin-bottom",
      "overflow",
      "overflow-x",
      "overflow-y",
      "inline-size",
      "min-inline-size",
      "max-inline-size",
      "block-size",
      "min-block-size",
      "max-block-size",
      "margin-block-start",
      "margin-block-end",
      "overflow-block",
      "overflow-inline",
    ],
  },
  {
    property: "display",
    value: "list-item",
    ignoredProperties: ["vertical-align"],
  },
  {
    property: "display",
    value: "block",
    ignoredProperties: ["vertical-align"],
  },
  {
    property: "display",
    value: "flex",
    ignoredProperties: ["vertical-align"],
  },
  {
    property: "display",
    value: "table",
    ignoredProperties: ["vertical-align"],
  },
  {
    property: "display",
    value:
      "/^table-(row|row-group|column|column-group|header-group|footer-group|cell)$/",
    ignoredProperties: [
      "margin",
      "margin-top",
      "margin-right",
      "margin-bottom",
      "margin-left",
      "margin-block-start",
      "margin-inline-end",
      "margin-block-end",
      "margin-inline-start",
    ],
  },
  {
    property: "display",
    value:
      "/^table-(row|row-group|column|column-group|header-group|footer-group)$/",
    ignoredProperties: [
      "padding",
      "padding-top",
      "padding-right",
      "padding-bottom",
      "padding-left",
      "padding-block-start",
      "padding-inline-end",
      "padding-block-end",
      "padding-inline-start",
    ],
  },
  {
    property: "display",
    value:
      "/^table-(row|row-group|column|column-group|header-group|footer-group|caption)$/",
    ignoredProperties: ["vertical-align"],
  },
  {
    property: "display",
    value: "/^table-(row|row-group)$/",
    ignoredProperties: [
      "width",
      "min-width",
      "max-width",
      "inline-size",
      "min-inline-size",
      "max-inline-size",
    ],
  },
  {
    property: "display",
    value: "/^table-(column|column-group)$/",
    ignoredProperties: [
      "height",
      "min-height",
      "max-height",
      "block-size",
      "min-block-size",
      "max-block-size",
    ],
  },
  {
    property: "float",
    value: "left",
    ignoredProperties: ["vertical-align"],
  },
  {
    property: "float",
    value: "right",
    ignoredProperties: ["vertical-align"],
  },
  {
    property: "position",
    value: "static",
    ignoredProperties: [
      "top",
      "right",
      "bottom",
      "left",
      "z-index",
      "inset-block-start",
      "inset-inline-end",
      "inset-block-end",
      "inset-inline-start",
    ],
  },
  {
    property: "position",
    value: "absolute",
    ignoredProperties: ["float", "clear", "vertical-align"],
  },
  {
    property: "position",
    value: "fixed",
    ignoredProperties: ["float", "clear", "vertical-align"],
  },
  {
    property: "list-style-type",
    value: "none",
    ignoredProperties: ["list-style-image"],
  },
  {
    property: "overflow",
    value: "visible",
    ignoredProperties: ["resize"],
  },
];

const rule = (actual) => {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual });

    if (!validOptions) {
      return;
    }

    root.walkRules((rule) => {
      const uniqueDecls = {};
      rule.walkDecls((decl) => {
        uniqueDecls[decl.prop] = decl;
      });

      function check(prop, index) {
        const decl = uniqueDecls[prop];
        const value = decl.value;
        const unprefixedProp = vendorPrefixes.unprefixed(prop);
        const unprefixedValue = vendorPrefixes.unprefixed(value);

        ignored.forEach((ignore) => {
          const matchProperty = matchesStringOrRegExp(
            unprefixedProp.toLowerCase(),
            ignore.property
          );
          const matchValue = matchesStringOrRegExp(
            unprefixedValue.toLowerCase(),
            ignore.value
          );

          if (!matchProperty || !matchValue) {
            return;
          }

          const ignoredProperties = ignore.ignoredProperties;

          decl.parent.nodes.forEach((node, nodeIndex) => {
            if (
              !node.prop ||
              ignoredProperties.indexOf(node.prop.toLowerCase()) === -1 ||
              index === nodeIndex
            ) {
              return;
            }

            report({
              message: messages.rejected(node.prop, decl.toString()),
              node,
              result,
              ruleName,
            });
          });
        });
      }

      Object.keys(uniqueDecls).forEach(check);
    });
  };
};

module.exports = stylelint.createPlugin(ruleName, rule);
module.exports.ruleName = ruleName;
module.exports.messages = messages;
