import React from 'react';
import { ApplyPluginsType{{ #config.dynamicImport }}, dynamic{{ /config.dynamicImport }} } from '{{{ runtimePath }}}';
import * as umiExports from './umiExports';
import { plugin } from './plugin';
{{ #loadingComponent }}
import LoadingComponent from '{{{ loadingComponent }}}';
{{ /loadingComponent }}

export function getRoutes() {
  const routes = {{{ routes }}};

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
