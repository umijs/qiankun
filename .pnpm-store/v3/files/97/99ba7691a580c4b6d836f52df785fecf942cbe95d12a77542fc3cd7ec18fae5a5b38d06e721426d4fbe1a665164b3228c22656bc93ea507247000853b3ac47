import { {{{ creator }}}, History } from '{{{ runtimePath }}}';

let options = {{{ options }}};
if ((<any>window).routerBase) {
  options.basename = (<any>window).routerBase;
}

// remove initial history because of ssr
let history: History = process.env.__IS_SERVER ? null : {{{ creator }}}(options);
export const createHistory = (hotReload = false) => {
  if (!hotReload) {
    history = {{{ creator }}}(options);
  }

  return history;
};

export { history };
