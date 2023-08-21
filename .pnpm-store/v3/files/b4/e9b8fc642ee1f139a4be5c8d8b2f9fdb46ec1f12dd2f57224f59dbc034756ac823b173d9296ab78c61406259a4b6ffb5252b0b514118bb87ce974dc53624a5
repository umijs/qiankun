{{{ polyfillImports }}}
{{{ importsAhead }}}
import { plugin } from './core/plugin';
import './core/pluginRegister';
{{#enableHistory}}
import { createHistory } from './core/history';
{{/enableHistory}}
import { ApplyPluginsType } from '{{{ runtimePath }}}';
import { renderClient } from '{{{ rendererPath }}}';
import { getRoutes } from './core/routes';
{{{ imports }}}

{{{ entryCodeAhead }}}

const getClientRender = (args: { hot?: boolean; routes?: any[] } = {}) => plugin.applyPlugins({
  key: 'render',
  type: ApplyPluginsType.compose,
  initialValue: () => {
    const opts = plugin.applyPlugins({
      key: 'modifyClientRenderOpts',
      type: ApplyPluginsType.modify,
      initialValue: {
        routes: args.routes || getRoutes(),
        plugin,
{{#enableHistory}}
        history: createHistory(args.hot),
{{/enableHistory}}
        isServer: process.env.__IS_SERVER,
{{#enableSSR}}
        ssrProps: {},
{{/enableSSR}}
{{#dynamicImport}}
        dynamicImport: {{{ dynamicImport }}},
{{/dynamicImport}}
        rootElement: '{{{ rootElement }}}',
{{#enableTitle}}
        defaultTitle: `{{{ defaultTitle }}}`,
{{/enableTitle}}
      },
    });
    return renderClient(opts);
  },
  args,
});

const clientRender = getClientRender();
export default clientRender();

{{{ entryCode }}}

// hot module replacement
// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept('./core/routes', () => {
    const ret = require('./core/routes');
    if (ret.then) {
      ret.then(({ getRoutes }) => {
        getClientRender({ hot: true, routes: getRoutes() })();
      });
    } else {
      getClientRender({ hot: true, routes: ret.getRoutes() })();
    }
  });
}
