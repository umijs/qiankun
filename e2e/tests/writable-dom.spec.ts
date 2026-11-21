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
        sink.write('<style>@import "theme.css";</style><span>ready</span>');
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
