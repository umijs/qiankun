/**
 * @author tang-haibo
 * @since 2021-06-30
 */
import { sleep } from '../../../utils';
import patch from '../storage';

test('patch storage', async () => {
  const free = patch(window, 'react');
  const testValue = '123';
  window.sessionStorage.setItem('test1', testValue);
  window.sessionStorage.setItem('test2', testValue);
  window.sessionStorage.setItem('test3', testValue);
  expect(window.sessionStorage.getItem('test1')).toEqual(testValue);
  window.sessionStorage.removeItem('test2');
  expect(window.sessionStorage.getItem('test2')).toEqual(null);
  window.sessionStorage.clear();
  await sleep(1);
  free();
});
