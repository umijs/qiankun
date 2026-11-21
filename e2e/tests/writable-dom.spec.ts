import { expect, test } from '@playwright/test';

type WritableDomWindow = {
  __WRITABLE_DOM_UNDER_TEST__: (
    target: ParentNode,
    previousSibling?: ChildNode | null,
    assetTransformer?: <T extends Node>(clone: T) => T,
  ) => {
    write(html: string): void;
    abort(err: Error): void;
    close(): Promise<void>;
  };
};

test.describe('writable-dom inline text (real browser)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/writable-dom.html');
  });

  for (const tag of ['style', 'script']) {
    for (const layout of ['complete', 'split', 'unterminated']) {
      test(`${tag} keeps one text node after ${layout} writes and close`, async ({ page }) => {
        const result = await page.evaluate(
          async ({ tag, layout }) => {
            const writableDOM = (window as unknown as WritableDomWindow).__WRITABLE_DOM_UNDER_TEST__;
            const target = document.body.appendChild(document.createElement('div'));
            target.id = 'inline-text';
            target.dataset.runs = '0';
            const text =
              tag === 'style' ? '.probe{color:red}' : 'document.querySelector("#inline-text").dataset.runs++;';
            const chunks =
              layout === 'split'
                ? [`<${tag}>${text.slice(0, 5)}`, `${text.slice(5)}</${tag}>`]
                : [`<${tag}>${text}${layout === 'complete' ? `</${tag}>` : ''}`];
            const sink = writableDOM(target);
            for (const chunk of chunks) sink.write(chunk);
            sink.write('');
            await sink.close();
            const element = target.querySelector(tag)!;
            return {
              text: element.textContent,
              expected: text,
              children: element.childNodes.length,
              runs: target.dataset.runs,
            };
          },
          { tag, layout },
        );
        expect(result.text).toBe(result.expected);
        expect(result.children).toBe(1);
        expect(result.runs).toBe(tag === 'script' ? '1' : '0');
      });
    }
  }

  for (const scoped of [false, true]) {
    for (const [name, chunks] of [
      ['complete', ['<style>/*</div>*/.probe{color:red}</style>']],
      ['unfinished-rule', ['<style>/*</div>*/.probe{', 'color:red}</style>']],
      ['closing-tag-in-comment', ['<style>/*</div>', '*/.probe{color:red}</style>']],
    ] as const) {
      test(`preserves ${scoped ? 'scoped' : 'raw'} growing style text: ${name}`, async ({ page }) => {
        const result = await page.evaluate(
          async ({ scoped, chunks }) => {
            const writableDOM = (window as unknown as WritableDomWindow).__WRITABLE_DOM_UNDER_TEST__;
            const { transpileAssets } = (
              window as unknown as {
                __STYLE_ASSETS_UNDER_TEST__: typeof import('@qiankunjs/shared');
              }
            ).__STYLE_ASSETS_UNDER_TEST__;
            const target = document.body.appendChild(document.createElement('div'));
            target.id = 'growing-style';
            target.innerHTML = '<span class="probe">inside</span>';
            const outside = document.body.appendChild(document.createElement('span'));
            outside.className = 'probe';
            const outsideColor = getComputedStyle(outside).color;
            const sink = writableDOM(
              target,
              null,
              scoped
                ? (node) =>
                    transpileAssets(node, document.baseURI, {
                      fetch: window.fetch,
                      styleIsolation: { appName: 'growing-style', scopeRoot: '#growing-style' },
                    })
                : undefined,
            );
            for (const chunk of chunks) sink.write(chunk);
            sink.write('');
            await sink.close();
            const style = target.querySelector('style')!;
            return {
              text: style.textContent,
              children: style.childNodes.length,
              inside: getComputedStyle(target.querySelector('.probe')!).color,
              outside: getComputedStyle(outside).color,
              outsideColor,
            };
          },
          { scoped, chunks },
        );
        expect(result.text).toBe(
          scoped ? '@scope (#growing-style) {\n/*</div>*/.probe{color:red}\n}' : '/*</div>*/.probe{color:red}',
        );
        expect(result.children).toBe(1);
        expect(result.inside).toBe('rgb(255, 0, 0)');
        expect(result.outside).toBe(scoped ? result.outsideColor : 'rgb(255, 0, 0)');
      });
    }
  }

  test('updates growing async style text without losing isolation or repeating the transform on close', async ({
    page,
  }) => {
    await page.evaluate(async () => {
      const writableDOM = (window as unknown as WritableDomWindow).__WRITABLE_DOM_UNDER_TEST__;
      const { transpileAssets } = (
        window as unknown as {
          __STYLE_ASSETS_UNDER_TEST__: typeof import('@qiankunjs/shared');
        }
      ).__STYLE_ASSETS_UNDER_TEST__;
      const target = document.body.appendChild(document.createElement('div'));
      target.id = 'async-growth';
      target.innerHTML = '<span class="probe">inside</span>';
      const outside = document.body.appendChild(document.createElement('span'));
      outside.id = 'outside-growth';
      outside.className = 'probe';
      const releases: Array<() => void> = [];
      let fetches = 0;
      const fetchCSS: typeof fetch = async () => {
        fetches++;
        await new Promise<void>((resolve) => releases.push(resolve));
        return new Response('.resolved { color: green; }');
      };
      const sink = writableDOM(target, null, (node) =>
        transpileAssets(node, document.baseURI, {
          fetch: fetchCSS,
          styleIsolation: { appName: 'async-growth', scopeRoot: '#async-growth' },
        }),
      );
      sink.write('<style>@import "theme.css";/*</div>');
      const oldText = target.querySelector('style')!.firstChild as Text;
      sink.write('*/.probe{color:red}</style>');
      const text = target.querySelector('style')!.firstChild as Text;
      sink.write('');
      await sink.close();
      Object.assign(window, {
        __asyncGrowth: {
          oldText,
          text,
          outsideColor: getComputedStyle(outside).color,
          fetches: () => fetches,
          release: () => releases.forEach((resolve) => resolve()),
        },
      });
    });
    await expect(page.locator('#async-growth style')).toHaveText('');
    await page.evaluate(() => (window as unknown as { __asyncGrowth: { release(): void } }).__asyncGrowth.release());
    await expect(page.locator('#async-growth .probe')).toHaveCSS('color', 'rgb(255, 0, 0)');
    const result = await page.evaluate(() => {
      const { oldText, text, outsideColor, fetches } = (
        window as unknown as {
          __asyncGrowth: { oldText: Text; text: Text; outsideColor: string; fetches(): number };
        }
      ).__asyncGrowth;
      const style = document.querySelector('#async-growth style')!;
      return {
        text: style.textContent,
        children: style.childNodes.length,
        sameText: style.firstChild === text,
        oldText: oldText.data,
        oldParent: oldText.parentNode === null,
        fetches: fetches(),
        outside: getComputedStyle(document.querySelector('#outside-growth')!).color,
        outsideColor,
      };
    });
    expect(result.text).toContain('@scope (#async-growth)');
    expect(result.text).toContain('.resolved');
    expect(result.children).toBe(1);
    expect(result.sameText).toBe(true);
    expect(result.oldText).toBe('');
    expect(result.oldParent).toBe(true);
    expect(result.fetches).toBe(2);
    expect(result.outside).toBe(result.outsideColor);
  });

  test('moves stable async style text, preserves siblings, and respects disposal and removal', async ({ page }) => {
    await page.evaluate(() => {
      const writableDOM = (window as unknown as WritableDomWindow).__WRITABLE_DOM_UNDER_TEST__;
      const { transpileAssets, disposeCompartmentAssets } = (
        window as unknown as {
          __STYLE_ASSETS_UNDER_TEST__: typeof import('@qiankunjs/shared');
        }
      ).__STYLE_ASSETS_UNDER_TEST__;
      let release!: () => void;
      const gate = new Promise<void>((resolve) => {
        release = resolve;
      });
      const styles: HTMLStyleElement[] = [];
      const texts: Text[] = [];
      for (const mode of ['disposed', 'removed-text', 'removed-host', 'live']) {
        const target = document.createElement('div');
        target.id = mode;
        document.body.append(target);
        const fetchCSS: typeof fetch = async () => {
          await gate;
          return new Response('.resolved { color: green; }');
        };
        const sink = writableDOM(target, null, (node) =>
          transpileAssets(node, document.baseURI, {
            fetch: fetchCSS,
            styleIsolation: { appName: mode, scopeRoot: `#${mode}` },
          }),
        );
        sink.write('<style>@import "theme.css";</style>');
        void sink.close();
        const style = target.querySelector('style')!;
        const text = style.firstChild as Text;
        styles.push(style);
        texts.push(text);
        style.append(document.createTextNode('.app-added { color: blue; }'));
        if (mode === 'disposed') disposeCompartmentAssets(fetchCSS);
        if (mode === 'removed-text') text.remove();
        if (mode === 'removed-host') style.remove();
      }
      Object.assign(window, { __styleResult: { styles, texts, release } });
    });
    const before = await page.locator('#live style').textContent();
    expect(before).toBe('.app-added { color: blue; }');
    await page.evaluate(() => (window as unknown as { __styleResult: { release(): void } }).__styleResult.release());
    // All four transforms share the same explicit fetch barrier; the live control
    // verifies completion rather than waiting an arbitrary amount of time.
    await expect.poll(() => page.locator('#live style').textContent()).toContain('.resolved');
    const result = await page.evaluate(() => {
      const { styles, texts } = (
        window as unknown as {
          __styleResult: { styles: HTMLStyleElement[]; texts: Text[] };
        }
      ).__styleResult;
      return {
        disposed: styles[0].textContent,
        removedText: styles[1].textContent,
        removedTextData: texts[1].data,
        removedHostConnected: styles[2].isConnected,
        resurrected: document.querySelector('#removed-host style') !== null,
        sameText: styles[3].firstChild === texts[3],
        live: styles[3].textContent,
      };
    });
    expect(result.disposed).toBe(before);
    expect(result.removedText).toBe(before);
    expect(result.removedTextData).toBe('');
    expect(result.removedHostConnected).toBe(false);
    expect(result.resurrected).toBe(false);
    expect(result.sameText).toBe(true);
    expect(result.live).toContain('@scope (#live)');
    expect(result.live).toContain(before);
  });

  test('allows a transformer to synchronously clear inline text', async ({ page }) => {
    const text = await page.evaluate(async () => {
      const writableDOM = (window as unknown as WritableDomWindow).__WRITABLE_DOM_UNDER_TEST__;
      const target = document.createElement('div');
      document.body.append(target);
      const sink = writableDOM(target, null, (node) => {
        if (node.nodeName === 'STYLE') node.textContent = '';
        return node;
      });
      sink.write('<style>.old{color:red}</style>');
      await sink.close();
      return target.querySelector('style')!.textContent;
    });
    expect(text).toBe('');
  });
});
