/**
 * @author Kuitos
 * @since 2023-10-09
 */
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
