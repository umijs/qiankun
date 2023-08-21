import { RuleTester } from 'eslint';
import parserOptionsMapper from '../../__util__/parserOptionsMapper';
import rule from '../../../src/rules/prefer-tag-over-role';

const ruleTester = new RuleTester();

const expectedError = (role, tag) => ({
  message: `Use ${tag} instead of the "${role}" role to ensure accessibility across all devices.`,
  type: 'JSXOpeningElement',
});

ruleTester.run('element-role', rule, {
  valid: [
    { code: '<div />;' },
    { code: '<div role="unknown" />;' },
    { code: '<div role="also unknown" />;' },
    { code: '<other />' },
    { code: '<img role="img" />' },
    { code: '<input role="checkbox" />' },
  ].map(parserOptionsMapper),
  invalid: [
    {
      code: '<div role="checkbox" />',
      errors: [expectedError('checkbox', '<input type="checkbox">')],
    },
    {
      code: '<div role="button checkbox" />',
      errors: [expectedError('checkbox', '<input type="checkbox">')],
    },
    {
      code: '<div role="heading" />',
      errors: [
        expectedError('heading', '<h1>, <h2>, <h3>, <h4>, <h5>, or <h6>'),
      ],
    },
    {
      code: '<div role="link" />',
      errors: [
        expectedError(
          'link',
          '<a href=...>, <area href=...>, or <link href=...>',
        ),
      ],
    },
    {
      code: '<div role="rowgroup" />',
      errors: [expectedError('rowgroup', '<tbody>, <tfoot>, or <thead>')],
    },
    {
      code: '<span role="checkbox" />',
      errors: [expectedError('checkbox', '<input type="checkbox">')],
    },
    {
      code: '<other role="checkbox" />',
      errors: [expectedError('checkbox', '<input type="checkbox">')],
    },
    {
      code: '<other role="checkbox" />',
      errors: [expectedError('checkbox', '<input type="checkbox">')],
    },
    {
      code: '<div role="banner" />',
      errors: [expectedError('banner', '<header>')],
    },
  ].map(parserOptionsMapper),
});
