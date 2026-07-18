/**
 * @author Kuitos
 * @since 2023-10-09
 */
import { memoize } from 'lodash';

export const createReusingObjectUrl = memoize(
  (src: string, url: string, type: 'text/javascript' | 'text/css'): string => {
    return URL.createObjectURL(
      new Blob([`/* ${src} is reusing the execution result of ${url} */`], {
        type,
      }),
    );
  },
  (src, url, type) => `${src}#${url}#${type}`,
);

export const isValidJavaScriptType = (type?: string): boolean => {
  const handleTypes = [
    'text/javascript',
    'module',
    'application/javascript',
    'text/ecmascript',
    'application/ecmascript',
  ];
  return !type || handleTypes.indexOf(type) !== -1;
};
