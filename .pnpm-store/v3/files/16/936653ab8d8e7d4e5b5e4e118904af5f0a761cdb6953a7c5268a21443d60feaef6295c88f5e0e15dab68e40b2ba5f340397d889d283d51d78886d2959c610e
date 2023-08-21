"use strict";

var _fs = require("fs");

var _path = require("path");

var _ = _interopRequireDefault(require("../"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ruleNames = Object.keys(_.default.rules);
const numberOfRules = 41;
describe('rules', () => {
  it('should have a corresponding doc for each rule', () => {
    ruleNames.forEach(rule => {
      const docPath = (0, _path.resolve)(__dirname, '../../docs/rules', `${rule}.md`);

      if (!(0, _fs.existsSync)(docPath)) {
        throw new Error(`Could not find documentation file for rule "${rule}" in path "${docPath}"`);
      }
    });
  });
  it('should have the correct amount of rules', () => {
    const length = ruleNames.length;

    if (length !== numberOfRules) {
      throw new Error(`There should be exactly ${numberOfRules} rules, but there are ${length}. If you've added a new rule, please update this number.`);
    }
  });
});