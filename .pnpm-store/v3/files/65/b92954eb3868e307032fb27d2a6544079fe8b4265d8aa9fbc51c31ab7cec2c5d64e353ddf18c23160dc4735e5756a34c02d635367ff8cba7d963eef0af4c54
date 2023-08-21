import {insert} from '../../../../js/util/Options.js';

export function registerTeX(packageList = [], tex = true) {
  if (MathJax.startup) {
    if (tex) {
      MathJax.startup.registerConstructor('tex', MathJax._.input.tex_ts.TeX);
      MathJax.startup.useInput('tex');
    }
    if (!MathJax.config.tex) {
      MathJax.config.tex = {};
    }
    let packages = MathJax.config.tex.packages;
    MathJax.config.tex.packages = packageList;
    if (packages) {
      insert(MathJax.config.tex, {packages});
    }
  }
}
