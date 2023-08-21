"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function _fs() {
  const data = _interopRequireDefault(require("fs"));
  _fs = function _fs() {
    return data;
  };
  return data;
}
function _path() {
  const data = _interopRequireDefault(require("path"));
  _path = function _path() {
    return data;
  };
  return data;
}
function _utils() {
  const data = require("@umijs/utils");
  _utils = function _utils() {
    return data;
  };
  return data;
}
var _loader = _interopRequireDefault(require("../../../theme/loader"));
var _useDemoUrl = require("../../../theme/hooks/useDemoUrl");
var _utils2 = require("../../../transformer/utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
const debug = (0, _utils().createDebug)('dumi:demos');
var _default = api => {
  const demos = {};
  const generateDemosFile = api.utils.lodash.debounce( /*#__PURE__*/_asyncToGenerator(function* () {
    // must start with 1 instead of 0 (falsy value), otherwise, rawCode0 could be override by rawCode1 when rawCode0 and rawCode1 is the same importation.
    let hoistImportCount = 1;
    const hoistImports = {};
    const tpl = _fs().default.readFileSync(_path().default.join(__dirname, 'demos.mst'), 'utf8');
    const items = Object.keys(demos).map(uuid => {
      const componentName = demos[uuid].previewerProps.componentName;
      // collect component related module (react component & source code) into one chunk
      const chunkName = componentName && `demos_${[...componentName]
      // reverse component name to avoid some special component (such as Advertisement) be blocked by ADBlock when dynamic loading
      .reverse().join('')}` || 'demos_no_comp';
      const itemHoistImports = {};
      let demoComponent = demos[uuid].component;
      // replace to dynamic component for await import component
      demoComponent = (0, _utils2.decodeImportRequireWithAutoDynamic)(demoComponent, chunkName);
      // hoist all raw code import statements
      Object.entries(demos[uuid].previewerProps.sources).forEach(([file, oContent]) => {
        const content = file === '_' ? Object.values(oContent)[0] : oContent.content;
        if ((0, _utils2.isHoistImport)(content)) {
          if (!hoistImports[content]) {
            hoistImports[content] = hoistImportCount;
            hoistImportCount += 1;
          }
          itemHoistImports[content] = hoistImports[content];
        }
      });
      // replace collected import statments to rawCode var
      const previewerPropsStr = Object.entries(itemHoistImports).reduce((str, [stmt, no]) => str.replace(new RegExp(`"${stmt.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'), `rawCode${no}`), JSON.stringify(demos[uuid].previewerProps));
      return {
        uuid,
        component: demoComponent,
        previewerProps: previewerPropsStr
      };
    });
    // write demos entry file
    api.writeTmpFile({
      path: 'dumi/demos/index.ts',
      content: api.utils.Mustache.render(tpl, {
        demos: items,
        rawCodes: Object.entries(hoistImports).map(([stmt, no]) => (0, _utils2.decodeHoistImport)(stmt, `rawCode${no}`))
      })
    });
    debug('.dumi/demos files generated');
  }));
  // pass platform env
  if (process.env.PLATFORM_TYPE) {
    api.modifyDefaultConfig(memo => {
      memo.define = Object.assign(memo.define || {}, {
        'process.env.PLATFORM_TYPE': process.env.PLATFORM_TYPE
      });
      return memo;
    });
  }
  // write all demos into .umi dir
  api.onGenerateFiles(generateDemosFile);
  // register demo detections
  api.register({
    key: 'dumi.detectDemo',
    fn({
      uuid,
      code,
      previewerProps
    }) {
      const isUpdating = Boolean(demos[uuid]);
      demos[uuid] = {
        previewerProps,
        component: code
      };
      if (isUpdating) {
        generateDemosFile();
      }
    }
  });
  // add single demo render route
  api.modifyRoutes( /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator(function* (routes) {
      const theme = yield (0, _loader.default)();
      const prependRoutes = [{
        path: `/${(0, _useDemoUrl.getDemoRouteName)()}/:uuid${api.config.exportStatic && api.config.exportStatic.htmlSuffix ? '.html' : ''}`,
        // use to disable pro-layout in integrated mode
        layout: false
      }];
      const Previewer = theme.builtins.concat(theme.fallbacks).find(({
        identifier
      }) => identifier === 'Previewer');
      // both compatible with dumi 1.0 & Basement
      /* istanbul ignore else */
      if (prependRoutes[0].path !== '/_demos/:uuid') {
        prependRoutes.push({
          path: '/_demos/:uuid',
          redirect: '/~demos/:uuid'
        });
      }
      const demoRenderBody = `
      const { demos } = React.useContext(context);
      const [renderArgs, setRenderArgs] = React.useState([]);

      // update render args when props changed
      React.useLayoutEffect(() => {
        setRenderArgs(getDemoRenderArgs(props, demos));
      }, [props.match.params.uuid, props.location.query.wrapper, props.location.query.capture]);

      // for listen prefers-color-schema media change in demo single route
      usePrefersColor();

      switch (renderArgs.length) {
        case 1:
          // render demo directly
          return renderArgs[0];

        case 2:
          // render demo with previewer
          return React.createElement(
            Previewer,
            renderArgs[0],
            renderArgs[1],
          );

        default:
          return \`Demo $\{props.match.params.uuid\} not found :(\`;
      }
    `;
      const demoRouteComponent = (0, _utils2.isDynamicEnable)() ? `dynamic({
          loader: async () => {
            const React = await import('react');
            const { default: getDemoRenderArgs } = await import(/* webpackChunkName: 'dumi_demos' */ '${api.utils.winPath(_path().default.join(__dirname, './getDemoRenderArgs'))}');
            const { default: Previewer } = await import(/* webpackChunkName: 'dumi_demos' */ '${Previewer.source}');
            const { usePrefersColor, context } = await import(/* webpackChunkName: 'dumi_demos' */ 'dumi/theme');

            return props => {
              ${demoRenderBody}
            }
          },
          loading: () => null,
        }))(` // hack to execute and return dynamic, to avoid use React.createElement and can works with umi routeToJSON
      : `{
        const React = require('react');
        const { default: getDemoRenderArgs } = require('${api.utils.winPath(_path().default.join(__dirname, './getDemoRenderArgs'))}');
        const { default: Previewer } = require('${Previewer.source}');
        const { usePrefersColor, context } = require('dumi/theme');

        ${demoRenderBody}
        }`;
      prependRoutes[0].wrappers = [
      // builtin outer layout for initialize context (.umi/dumi/layout.tsx)
      '../dumi/layout', theme.layoutPaths.demo].filter(Boolean);
      prependRoutes[0].component = `((props) => ${demoRouteComponent})`;
      routes.unshift(...prependRoutes);
      return routes;
    });
    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }());
  // export static for dynamic demos
  api.modifyExportRouteMap(memo => {
    const exportStatic = api.config.exportStatic;
    if (exportStatic) {
      memo.push(...Object.keys(demos).map(uuid => {
        const demoRoutePath = `/${(0, _useDemoUrl.getDemoRouteName)()}/${uuid}`;
        return {
          route: {
            path: demoRoutePath
          },
          file: `${demoRoutePath}${exportStatic.htmlSuffix ? '' : '/index'}.html`
        };
      }));
      /* istanbul ignore if */
      if (api.utils.isWindows) {
        // do not generate dynamic route file for Windows, to avoid throw error
        memo = memo.filter(item => !item.route.path.includes('/:'));
      }
    }
    return memo;
  });
};
exports.default = _default;