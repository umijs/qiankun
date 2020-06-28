/**
 * @author Saviio
 * @since 2020-4-19
 */

// https://developer.mozilla.org/en-US/docs/Web/API/CSSRule
enum RuleType {
  // type: rule will be rewrote
  STYLE = 1,
  MEDIA = 4,
  SUPPORTS = 12,

  // type: value will be keeped
  IMPORT = 3,
  FONT_FACE = 5,
  PAGE = 6,
  KEYFRAMES = 7,
  KEYFRAME = 8,
}

const arrayify = <T>(list: CSSRuleList | any[]) => {
  return [].slice.call(list, 0) as T[];
};

class ScopedCSS {
  private static ModifiedTag = 'Symbol(style-modified-qiankun)';

  private sheet: StyleSheet;

  private swapNode: HTMLStyleElement;

  constructor() {
    const styleNode = document.createElement('style');
    document.body.appendChild(styleNode);

    this.swapNode = styleNode;
    this.sheet = styleNode.sheet!;
    this.sheet.disabled = true;
  }

  process(styleNode: HTMLStyleElement, prefix: string = '') {
    if (styleNode.textContent !== '') {
      const textNode = document.createTextNode(styleNode.textContent || '');
      this.swapNode.appendChild(textNode);
      const sheet = this.swapNode.sheet as any; // type is missing
      const rules = arrayify<CSSRule>(sheet?.cssRules ?? []);
      const css = this.rewrite(rules, prefix);
      // eslint-disable-next-line no-param-reassign
      styleNode.textContent = css;

      // cleanup
      this.swapNode.removeChild(textNode);
      return;
    }

    const mutator = new MutationObserver(mutations => {
      for (let i = 0; i < mutations.length; i += 1) {
        const mutation = mutations[i];

        if (ScopedCSS.ModifiedTag in styleNode) {
          return;
        }

        if (mutation.type === 'childList') {
          const sheet = styleNode.sheet as any;
          const rules = arrayify<CSSRule>(sheet?.cssRules ?? []);
          const css = this.rewrite(rules, prefix);

          // eslint-disable-next-line no-param-reassign
          styleNode.textContent = css;
          // eslint-disable-next-line no-param-reassign
          (styleNode as any)[ScopedCSS.ModifiedTag] = true;
        }
      }
    });

    // since observer will be deleted when node be removed
    // we dont need create a cleanup function manually
    // see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/disconnect
    mutator.observe(styleNode, { childList: true });
  }

  private rewrite(rules: CSSRule[], prefix: string = '') {
    let css = '';

    rules.forEach(rule => {
      switch (rule.type) {
        case RuleType.STYLE:
          css += this.ruleStyle(rule as CSSStyleRule, prefix);
          break;
        case RuleType.MEDIA:
          css += this.ruleMedia(rule as CSSMediaRule, prefix);
          break;
        case RuleType.SUPPORTS:
          css += this.ruleSupport(rule as CSSSupportsRule, prefix);
          break;
        default:
          css += `${rule.cssText}`;
          break;
      }
    });

    return css;
  }

  // handle case:
  // .app-main {}
  // html, body {}

  // eslint-disable-next-line class-methods-use-this
  private ruleStyle(rule: CSSStyleRule, prefix: string) {
    const rootSelectorRE = /((html)|(body)|(:root))/g;

    if (rootSelectorRE.test(rule.selectorText)) {
      return rule.cssText.replace(rootSelectorRE, prefix);
    }

    return `${prefix} ${rule.cssText}`;
  }

  // handle case:
  // @media screen and (max-width: 300px) {}
  private ruleMedia(rule: CSSMediaRule, prefix: string) {
    const css = this.rewrite(arrayify(rule.cssRules), prefix);
    return `@media ${rule.conditionText} {${css}}`;
  }

  // handle case:
  // @supports (display: grid) {}
  private ruleSupport(rule: CSSSupportsRule, prefix: string) {
    const css = this.rewrite(arrayify(rule.cssRules), prefix);
    return `@supports ${rule.conditionText} {${css}}`;
  }
}

const processor = new ScopedCSS();

export const QiankunCSSRewriteAttr = 'data-qiankun';
const process = (appWrapper: HTMLElement, stylesheetElement: HTMLStyleElement | HTMLLinkElement, appName: string) => {
  if (stylesheetElement.tagName === 'LINK') {
    console.warn('Feature: sandbox.experimentalStyleIsolation is not support for link element yet.');
  }

  const mountDOM = appWrapper;
  if (!mountDOM) {
    return;
  }

  const tag = (mountDOM.tagName || '').toLowerCase();

  if (tag && stylesheetElement.tagName === 'STYLE') {
    const prefix = `${tag}[${QiankunCSSRewriteAttr}=${appName}]`;
    processor.process(stylesheetElement, prefix);
  }
};

export { process, processor };
