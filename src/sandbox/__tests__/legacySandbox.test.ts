/**
 * @author ruozhou.lu
 * @since 2020-08-23
 */

import LegacySandbox from '../legacy/sandbox';

test('prop should be assigned successfully after sandbox is inactive', () => {
  const sandbox = new LegacySandbox('inactive-test');
  const proxy = sandbox.proxy as any;
  sandbox.inactive();
  proxy.testA = 'abc';

  expect('testA' in proxy).toBeTruthy();
  expect(proxy.testA === 'abc').toBeTruthy();
});
