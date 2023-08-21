import { transform } from '@babel/core';
import { winPath } from '@umijs/utils';

function transformWithPlugin(code: string) {
  const filename = 'file.js';
  return transform(code, {
    filename,
    plugins: [[require.resolve('./index.ts'), {}]],
  })!.code;
}

test('match', () => {
  expect(winPath(transformWithPlugin(`import 'core-js/foo'`)!)).toContain(
    `/core-js/foo`,
  );
});

test('not match', () => {
  expect(transformWithPlugin(`import 'foo'`)).toEqual(`import 'foo';`);
});
