import type { NodePath } from '@babel/traverse';
import { t, winPath } from '@umijs/utils';
import { extname, isAbsolute } from 'path';

type TLibs = (RegExp | string)[];

interface IAlias {
  [key: string]: string;
}

type IExternal =
  | {
      [key: string]: string;
    }
  | Function;
type IExternals = IExternal[] | {};

export interface IOpts {
  libs?: TLibs;
  matchAll?: boolean;
  remoteName: string;
  alias?: IAlias;
  webpackAlias?: IAlias;
  webpackExternals?: IExternals;
  onTransformDeps?: Function;
  exportAllMembers?: Record<string, string[]>;
}

export function specifiersToProperties(specifiers: any[]) {
  return specifiers.reduce(
    (memo, s) => {
      if (t.isImportDefaultSpecifier(s)) {
        memo.properties.push(
          t.objectProperty(t.identifier('default'), s.local),
        );
      } else if (t.isExportDefaultSpecifier(s)) {
        memo.properties.push(
          t.objectProperty(t.identifier('default'), s.exported),
        );
      } else if (t.isExportSpecifier(s)) {
        if (t.isIdentifier(s.exported, { name: 'default' })) {
          memo.defaultIdentifier = s.local.name;
          memo.properties.push(t.objectProperty(s.local, s.local));
        } else {
          memo.properties.push(t.objectProperty(s.local, s.exported));
        }
      } else if (t.isImportNamespaceSpecifier(s)) {
        memo.namespaceIdentifier = s.local;
      } else {
        memo.properties.push(t.objectProperty(s.imported, s.local));
      }
      return memo;
    },
    { properties: [], namespaceIdentifier: null, defaultIdentifier: null },
  );
}

const RE_NODE_MODULES = /node_modules/;
const RE_UMI_LOCAL_DEV = /umi\/packages\//;

function getAlias(opts: { path: string; webpackAlias: IAlias }) {
  for (const key of Object.keys(opts.webpackAlias)) {
    const value = opts.webpackAlias[key];
    // exact alias
    // ref: https://webpack.js.org/configuration/resolve/#resolvealias
    if (key.endsWith('$')) {
      if (opts.path === key.slice(0, -1)) return value;
      continue;
    }

    if (opts.path === key) {
      return value;
    }
    const path = isJSFile(opts.webpackAlias[key]) ? key : addLastSlash(key);
    if (opts.path.startsWith(path)) {
      return value;
    }
  }
  return null;
}

function isJSFile(path: string) {
  return ['.js', '.jsx', '.ts', '.tsx'].includes(extname(path));
}

function addLastSlash(path: string) {
  return path.endsWith('/') ? path : `${path}/`;
}

function makeArray<T>(item: any): T[] {
  return Array.isArray(item) ? item : [item];
}

function isExternals(opts: { webpackExternals: IExternals; path: string }) {
  const webpackExternals = makeArray<IExternal>(opts.webpackExternals);
  const path = opts.path;
  if (
    webpackExternals.some((webpackExternal) =>
      isExternal({
        webpackExternal,
        path,
      }),
    )
  ) {
    return true;
  }
  return false;
}

function isExternal(opts: { webpackExternal: IExternal; path: string }) {
  if (typeof opts.webpackExternal === 'object') {
    return !!opts.webpackExternal[opts.path];
  } else if (typeof opts.webpackExternal === 'function') {
    let ret = false;
    opts.webpackExternal({}, opts.path, (_: any, b: any) => {
      ret = !!b;
    });
    return ret;
  } else {
    return false;
  }
}

function isMatchLib(
  path: string,
  libs: TLibs | undefined,
  matchAll: boolean | undefined,
  remoteName: string,
  alias: IAlias,
  webpackAlias: IAlias,
  webpackExternals: IExternals,
) {
  if (matchAll) {
    if (path === 'umi' || path === 'dumi' || path === '@alipay/bigfish')
      return false;
    if (path.startsWith(`${remoteName}/`)) return false;

    // don't match dynamic path
    // e.g. @umijs/deps/compiled/babel/svgr-webpack.js?-svgo,+titleProp,+ref!./umi.svg
    if (winPath(path).includes('babel/svgr-webpack')) return false;

    // don't match webpack loader
    // e.g. !!dumi-raw-code-loader!/path/to/VerticalProgress/index.module.less?dumi-raw-code
    if (path.startsWith('!!')) return false;

    if (
      isExternals({
        webpackExternals,
        path,
      })
    ) {
      return false;
    }

    if (isAbsolute(path)) {
      return RE_NODE_MODULES.test(path) || RE_UMI_LOCAL_DEV.test(path);
    } else if (path.charAt(0) === '.') {
      return false;
    } else {
      const aliasPath = getAlias({ path, webpackAlias });
      if (aliasPath) {
        return (
          RE_NODE_MODULES.test(aliasPath) || RE_UMI_LOCAL_DEV.test(aliasPath)
        );
      }
      return true;
    }
  }

  return (libs || []).concat(Object.keys(alias)).some((lib) => {
    if (typeof lib === 'string') {
      return lib === path;
    } else if (lib instanceof RegExp) {
      return lib.test(path);
    } else {
      throw new Error('Unsupported lib format.');
    }
  });
}

function getPath(path: string, alias: IAlias) {
  const keys = Object.keys(alias);
  for (const key of keys) {
    if (path.startsWith(key)) {
      return path.replace(key, alias[key]);
    }
  }
  return path;
}

export default function () {
  return {
    visitor: {
      Program: {
        exit(path: NodePath<t.Program>, { opts }: { opts: IOpts }) {
          const variableDeclarations = [];
          const exportDefaultDeclarations = [];
          let index = path.node.body.length - 1;
          while (index >= 0) {
            const d = path.node.body[index];

            if (t.isImportDeclaration(d)) {
              const isMatch = isMatchLib(
                d.source.value,
                opts.libs,
                opts.matchAll,
                opts.remoteName,
                opts.alias || {},
                opts.webpackAlias || {},
                opts.webpackExternals || {},
              );
              opts.onTransformDeps?.({
                source: d.source.value,
                // @ts-ignore
                file: path.hub.file.opts.filename,
                isMatch,
              });

              if (
                isMatch ||
                // css 走异步加载，修复 mfsu 场景下样式覆盖顺序的问题
                /\.(css|less|sass|scss|stylus|styl)(\?.+?)?$/.test(
                  d.source.value,
                )
              ) {
                const { properties, namespaceIdentifier } =
                  specifiersToProperties(d.specifiers);
                const id = t.objectPattern(properties);
                const init = t.awaitExpression(
                  t.callExpression(t.import(), [
                    t.stringLiteral(
                      isMatch
                        ? `${opts.remoteName}/${getPath(
                            d.source.value,
                            opts.alias || {},
                          )}`
                        : d.source.value,
                    ),
                  ]),
                );
                if (namespaceIdentifier) {
                  if (properties.length) {
                    variableDeclarations.unshift(
                      t.variableDeclaration('const', [
                        t.variableDeclarator(id, namespaceIdentifier),
                      ]),
                    );
                  }
                  variableDeclarations.unshift(
                    t.variableDeclaration('const', [
                      t.variableDeclarator(namespaceIdentifier, init),
                    ]),
                  );
                } else {
                  variableDeclarations.unshift(
                    t.variableDeclaration('const', [
                      t.variableDeclarator(id, init),
                    ]),
                  );
                }
                path.node.body.splice(index, 1);
              }
            }

            // export * from 'foo';
            if (t.isExportAllDeclaration(d) && d.source) {
              const isMatch = isMatchLib(
                d.source.value,
                opts.libs,
                opts.matchAll,
                opts.remoteName,
                opts.alias || {},
                opts.webpackAlias || {},
                opts.webpackExternals || {},
              );
              opts.onTransformDeps?.({
                source: d.source.value,
                // @ts-ignore
                file: path.hub.file.opts.filename,
                isMatch:
                  isMatch && opts.exportAllMembers?.[d.source.value]?.length,
                isExportAllDeclaration: true,
              });

              const exportAllIdentifier = t.identifier(
                `__all_exports_${d.source.value.replace(/(@|\/|-)/g, '_')}`,
              );

              if (isMatch && opts.exportAllMembers?.[d.source.value]) {
                if (opts.exportAllMembers[d.source.value].length) {
                  const id = exportAllIdentifier;
                  const init = t.awaitExpression(
                    t.callExpression(t.import(), [
                      t.stringLiteral(
                        `${opts.remoteName}/${getPath(
                          d.source.value,
                          opts.alias || {},
                        )}`,
                      ),
                    ]),
                  );
                  variableDeclarations.unshift(
                    t.variableDeclaration('const', [
                      t.variableDeclarator(id, init),
                    ]),
                  );

                  // replace node with export const { a, b, c } = __all_exports
                  // a, b, c was declared from opts.exportAllMembers
                  path.node.body[index] = t.exportNamedDeclaration(
                    t.variableDeclaration('const', [
                      t.variableDeclarator(
                        t.objectPattern(
                          opts.exportAllMembers[d.source.value].map((m) =>
                            t.objectProperty(t.identifier(m), t.identifier(m)),
                          ),
                        ),
                        exportAllIdentifier,
                      ),
                    ]),
                  );
                }
                // 有些 export * 只是为了类型
                else {
                  path.node.body[index] = t.expressionStatement(
                    t.numericLiteral(1),
                  );
                }
              }
            }

            // export { bar } from 'foo';
            if (t.isExportNamedDeclaration(d) && d.source) {
              const isMatch = isMatchLib(
                d.source.value,
                opts.libs,
                opts.matchAll,
                opts.remoteName,
                opts.alias || {},
                opts.webpackAlias || {},
                opts.webpackExternals || {},
              );
              opts.onTransformDeps?.({
                source: d.source.value,
                // @ts-ignore
                file: path.hub.file.opts.filename,
                isMatch,
              });

              if (isMatch) {
                const { properties, defaultIdentifier } =
                  specifiersToProperties(d.specifiers);
                const id = t.objectPattern(properties);
                const init = t.awaitExpression(
                  t.callExpression(t.import(), [
                    t.stringLiteral(
                      `${opts.remoteName}/${getPath(
                        d.source.value,
                        opts.alias || {},
                      )}`,
                    ),
                  ]),
                );
                variableDeclarations.unshift(
                  t.variableDeclaration('const', [
                    t.variableDeclarator(id, init),
                  ]),
                );
                d.source = null;
                d.specifiers = d.specifiers.filter((node) => {
                  return !(
                    t.isExportSpecifier(node) &&
                    t.isIdentifier(node.exported) &&
                    node.exported.name === 'default'
                  );
                });
                if (d.specifiers.length) {
                  d.specifiers.forEach((node) => {
                    if (
                      t.isExportSpecifier(node) &&
                      t.isIdentifier(node.local) &&
                      t.isIdentifier(node.exported)
                    ) {
                      node.local = node.exported;
                    }
                  });
                } else {
                  path.node.body.splice(index, 1);
                }

                if (defaultIdentifier) {
                  exportDefaultDeclarations.push(
                    t.exportDefaultDeclaration(t.identifier(defaultIdentifier)),
                  );
                }
              }
            }

            index -= 1;
          }
          path.node.body = [
            ...variableDeclarations,
            ...path.node.body,
            ...exportDefaultDeclarations,
          ];
        },
      },

      CallExpression(
        path: NodePath<t.CallExpression>,
        { opts }: { opts: IOpts },
      ) {
        const { node } = path;
        if (
          t.isImport(node.callee) &&
          node.arguments.length === 1 &&
          node.arguments[0].type === 'StringLiteral'
        ) {
          const value = node.arguments[0].value;
          const isMatch = isMatchLib(
            value,
            opts.libs,
            opts.matchAll,
            opts.remoteName,
            opts.alias || {},
            opts.webpackAlias || {},
            opts.webpackExternals || {},
          );
          opts.onTransformDeps?.({
            source: value,
            // @ts-ignore
            file: path.hub.file.opts.filename,
            isMatch,
          });
          if (isMatch) {
            node.arguments[0] = t.stringLiteral(
              `${opts.remoteName}/${getPath(value, opts.alias || {})}`,
            );
          }
        }
      },
    },
  };
}
