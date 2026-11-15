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

test.describe('writable-dom deferred text placeholder (real browser)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/writable-dom.html');
  });

  test('preserves appended live host text when deferred transform resolves after ordinary close()', async ({
    page,
  }) => {
    const result = await page.evaluate(async () => {
      const writableDOM = (window as unknown as WritableDomWindow).__WRITABLE_DOM_UNDER_TEST__;
      const target = document.createElement('div');
      document.body.append(target);
      let graft: Node | undefined;
      const sink = writableDOM(target, null, (node) => {
        if (node.nodeName === 'STYLE' && node.textContent) {
          graft = node;
          node.textContent = '';
        }
        return node;
      });
      sink.write('<style>.old{color:red}</style><span>ready</span>');
      await sink.close();

      const style = target.querySelector('style')!;
      style.append(document.createTextNode('.app-added{color:blue}'));
      graft!.textContent = '.resolved{color:green}';
      await new Promise<void>((resolve) => queueMicrotask(resolve));

      const text = style.textContent;
      target.remove();
      return text;
    });

    expect(result).toBe('.resolved{color:green}.app-added{color:blue}');
  });

  test('invalidates pending observer writes after sink.abort()', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const writableDOM = (window as unknown as WritableDomWindow).__WRITABLE_DOM_UNDER_TEST__;
      const target = document.createElement('div');
      document.body.append(target);
      let graft: Node | undefined;
      const sink = writableDOM(target, null, (node) => {
        if (node.nodeName === 'STYLE' && node.textContent) {
          graft = node;
          node.textContent = '';
        }
        return node;
      });
      sink.write('<style>.old{color:red}</style><span>ready</span>');

      const style = target.querySelector('style')!;
      style.append(document.createTextNode('.app-added{color:blue}'));
      sink.abort(new Error('cancel'));
      graft!.textContent = '.resolved{color:green}';
      await new Promise<void>((resolve) => queueMicrotask(resolve));

      const text = style.textContent;
      target.remove();
      return text;
    });

    expect(result).toBe('.app-added{color:blue}');
  });

  test('does not resurrect writes when the placeholder or host element has been removed', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const writableDOM = (window as unknown as WritableDomWindow).__WRITABLE_DOM_UNDER_TEST__;

      // Case 1: placeholder text node cleared/removed from live style
      const t1 = document.createElement('div');
      document.body.append(t1);
      let g1: Node | undefined;
      const s1 = writableDOM(t1, null, (node) => {
        if (node.nodeName === 'STYLE' && node.textContent) {
          g1 = node;
          node.textContent = '';
        }
        return node;
      });
      s1.write('<style>.old{}</style>');
      await s1.close();
      const style1 = t1.querySelector('style')!;
      const placeholder1 = style1.firstChild as Text;
      placeholder1.remove();
      g1!.textContent = '.resolved{}';
      await new Promise<void>((resolve) => queueMicrotask(resolve));
      const clearedPlaceholderState = {
        styleText: style1.textContent,
        placeholderData: placeholder1.data,
        placeholderConnected: placeholder1.isConnected,
      };
      t1.remove();

      // Case 2: entire host style detached before resolution
      const t2 = document.createElement('div');
      document.body.append(t2);
      let g2: Node | undefined;
      const s2 = writableDOM(t2, null, (node) => {
        if (node.nodeName === 'STYLE' && node.textContent) {
          g2 = node;
          node.textContent = '';
        }
        return node;
      });
      s2.write('<style>.old{}</style>');
      await s2.close();
      const style2 = t2.querySelector('style')!;
      style2.remove();
      g2!.textContent = '.resolved{}';
      await new Promise<void>((resolve) => queueMicrotask(resolve));
      const removedHostState = {
        styleConnected: style2.isConnected,
        styleText: style2.textContent,
        targetHasStyle: t2.querySelector('style') !== null,
      };
      t2.remove();

      return { clearedPlaceholderState, removedHostState };
    });

    expect(result.clearedPlaceholderState).toEqual({
      styleText: '',
      placeholderData: '',
      placeholderConnected: false,
    });
    expect(result.removedHostState).toEqual({
      styleConnected: false,
      styleText: '',
      targetHasStyle: false,
    });
  });

  test('leaves host empty when inline text is synchronously cleared without ever backfilling', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const writableDOM = (window as unknown as WritableDomWindow).__WRITABLE_DOM_UNDER_TEST__;
      const target = document.createElement('div');
      document.body.append(target);
      const sink = writableDOM(target, null, (node) => {
        if (node.nodeName === 'STYLE' && node.textContent) {
          node.textContent = '';
        }
        return node;
      });
      sink.write('<style>.old{color:red}</style>');
      await sink.close();
      await new Promise<void>((resolve) => queueMicrotask(resolve));

      const style = target.querySelector('style')!;
      const text = style.textContent;
      target.remove();
      return text;
    });

    expect(result).toBe('');
  });

  test('disconnects observer after deferred completion and ignores subsequent graft mutations', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const writableDOM = (window as unknown as WritableDomWindow).__WRITABLE_DOM_UNDER_TEST__;
      const target = document.createElement('div');
      document.body.append(target);
      let graft: Node | undefined;
      const sink = writableDOM(target, null, (node) => {
        if (node.nodeName === 'STYLE' && node.textContent) {
          graft = node;
          node.textContent = '';
        }
        return node;
      });
      sink.write('<style>.old{color:red}</style>');
      await sink.close();

      const style = target.querySelector('style')!;
      graft!.textContent = '.resolved-once{color:green}';
      await new Promise<void>((resolve) => queueMicrotask(resolve));
      const afterFirstWrite = style.textContent;

      graft!.textContent = '.mutated-twice{color:red}';
      await new Promise<void>((resolve) => queueMicrotask(resolve));
      const afterSecondWrite = style.textContent;
      target.remove();

      return { afterFirstWrite, afterSecondWrite };
    });

    expect(result).toEqual({
      afterFirstWrite: '.resolved-once{color:green}',
      afterSecondWrite: '.resolved-once{color:green}',
    });
  });
});
