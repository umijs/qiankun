import { greet } from '../index';

test('should greet with name', () => {
  const name = 'qiankun3';

  expect(greet(name)).toBe('Hello qiankun3');
});
