const stylelint = require('stylelint');
const plugin = require('../plugin');

const { ruleName } = plugin;

const getExtendedConfig = code => ({
  code,
  config: {
    extends: ['../index'],
  },
  configBasedir: __dirname,
});

const getPluginOptions = (code, rules) => ({
  code,
  config: {
    plugins: ['../plugin'],
    rules,
  },
  configBasedir: __dirname,
});

describe('stylelint-config-rational-order default config', () => {
  const wrong = `
    a {
      width: auto;
      height: auto;
      display: block;
      margin: 10px;
      position: relative;
      color: red;
      padding: 10px;
      border: 1px solid blue;
      background: white;
    }
  `;
  const correct = `
    a {
      position: relative;
      display: block;
      width: auto;
      height: auto;
      margin: 10px;
      padding: 10px;
      color: red;
      background: white;
      border: 1px solid blue;
    }
  `;

  it('wrong', () =>
    stylelint.lint(getExtendedConfig(wrong)).then(output => {
      const { errored } = output;
      const { warnings } = output.results[0];
      const expectedWarnings = [
        'Expected "display" to come before "height" in group "Box Model" (order/properties-order)',
        'Expected "position" to come before "margin" in group "Positioning" (order/properties-order)',
        'Expected "padding" to come before "color" in group "Box Model" (order/properties-order)',
        'Expected "background" to come before "border" in group "Visual" (order/properties-order)',
      ];
      expect(errored).toBeTruthy();
      warnings.forEach(({ text }, idx) => {
        expect(text).toEqual(expect.stringContaining(expectedWarnings[idx]));
      });
    }));

  it('correct', () =>
    stylelint.lint(getExtendedConfig(correct)).then(output => {
      const { errored } = output;
      const { warnings } = output.results[0];
      expect(errored).toBeFalsy();
      expect(warnings).toHaveLength(0);
    }));
});

describe('stylelint-config-rational-order/plugin', () => {
  describe('correct order with enabled plugin', () => {
    it('with default values (border in visual section and no empty lines between groups)', () => {
      const rules = {
        [ruleName]: true,
      };
      const correct = `
        a {
          position: relative;
          display: block;
          color: red;
          background: white;
          border: 1px solid blue;
        }
      `;
      return stylelint.lint(getPluginOptions(correct, rules)).then(output => {
        const { errored } = output;
        const { warnings } = output.results[0];
        expect(errored).toBeFalsy();
        expect(warnings).toHaveLength(0);
      });
    });

    it('with "border-in-box-model" = true', () => {
      const rules = {
        [ruleName]: [
          true,
          {
            'border-in-box-model': true,
          },
        ],
      };
      const correct = `
        a {
          position: relative;
          display: block;
          border: 1px solid blue;
          color: red;
          background: white;
        }
      `;
      return stylelint.lint(getPluginOptions(correct, rules)).then(output => {
        const { errored } = output;
        const { warnings } = output.results[0];
        expect(errored).toBeFalsy();
        expect(warnings).toHaveLength(0);
      });
    });

    it('with "empty-line-between-groups" = true', () => {
      const rules = {
        [ruleName]: [
          true,
          {
            'empty-line-between-groups': true,
          },
        ],
      };
      const correct = `
        a {
          position: relative;
          z-index: 10;

          display: block;
          width: auto;
          height: auto;
          margin: 10px;
          padding: 10px;

          color: red;

          background: white;
          border: 1px solid blue;
        }
      `;
      return stylelint.lint(getPluginOptions(correct, rules)).then(output => {
        const { errored } = output;
        const { warnings } = output.results[0];
        expect(errored).toBeFalsy();
        expect(warnings).toHaveLength(0);
      });
    });

    it('with "border-in-box-model" = true AND with "empty-line-between-groups" = true', () => {
      const rules = {
        [ruleName]: [
          true,
          {
            'border-in-box-model': true,
            'empty-line-between-groups': true,
          },
        ],
      };
      const correct = `
        a {
          position: relative;
          z-index: 10;

          display: block;
          width: auto;
          height: auto;
          margin: 10px;
          padding: 10px;
          border: 1px solid blue;
          overflow: auto;

          color: red;

          background: white;
        }
      `;
      return stylelint.lint(getPluginOptions(correct, rules)).then(output => {
        const { errored } = output;
        const { warnings } = output.results[0];
        expect(errored).toBeFalsy();
        expect(warnings).toHaveLength(0);
      });
    });
  });

  describe('wrong order with disabled plugin', () => {
    it('correct', () => {
      const rules = {
        [ruleName]: false,
      };
      const wrong = `
        a {
          border: 1px solid blue;
          position: relative;
          display: block;
          color: red;

          background: white;
        }
      `;
      return stylelint.lint(getPluginOptions(wrong, rules)).then(output => {
        const { errored } = output;
        const { warnings } = output.results[0];
        expect(errored).toBeFalsy();
        expect(warnings).toHaveLength(0);
      });
    });
  });

  describe('wrong plugin options', () => {
    it('correct', () => {
      const rules = {
        [ruleName]: [
          true,
          {
            borderInBoxModel: true,
            emptyLineBetweenGroups: true,
            'bla-bla-bla': false,
          },
        ],
      };
      const wrong = `
        a {
          border: 1px solid blue;
          position: relative;
          display: block;
          color: red;

          background: white;
        }
      `;
      return stylelint.lint(getPluginOptions(wrong, rules)).then(output => {
        expect(output.errored).toBeTruthy();
      });
    });
  });
});
