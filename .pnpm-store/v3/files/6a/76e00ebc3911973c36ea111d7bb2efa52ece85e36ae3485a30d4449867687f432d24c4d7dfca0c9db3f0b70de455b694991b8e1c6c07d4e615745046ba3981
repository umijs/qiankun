import { createRequire } from 'node:module';

const __require = createRequire(import.meta.url);
let inspector;
function setupInspect(config) {
  const isEnabled = config.inspect || config.inspectBrk;
  if (isEnabled) {
    inspector = __require("node:inspector");
    const isOpen = inspector.url() !== void 0;
    if (!isOpen) {
      inspector.open();
      if (config.inspectBrk)
        inspector.waitForDebugger();
    }
  }
  const keepOpen = config.watch && !config.isolate && config.singleThread;
  return function cleanup() {
    if (isEnabled && !keepOpen && inspector)
      inspector.close();
  };
}

export { setupInspect as s };
