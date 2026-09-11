/**
 * @vitest-environment happy-dom
 * @vitest-environment-options {"settings":{"navigation":{"disableMainFrameNavigation":true,"disableChildFrameNavigation":true,"disableChildPageNavigation":true}}}
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createApp, h, nextTick, ref, type App } from 'vue';
import { navigateToUrl } from 'qiankun';
import { MicroAppLink, type MicroAppLinkProps } from '../index';

vi.mock('qiankun', () => ({ loadMicroApp: vi.fn(), navigateToUrl: vi.fn() }));

describe('MicroAppLink', () => {
  let host: HTMLDivElement;
  let app: App | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    // Native anchor behavior changes happy-dom's URL even with network navigation disabled.
    (window as unknown as { happyDOM: { setURL(url: string): void } }).happyDOM.setURL('http://localhost:3000/');
    window.history.replaceState(null, '', '/');
    host = document.createElement('div');
    document.body.appendChild(host);
  });

  afterEach(() => {
    app?.unmount();
    app = undefined;
    host.remove();
    vi.restoreAllMocks();
  });

  const mount = (props: Partial<MicroAppLinkProps> = {}) => {
    app = createApp({
      render: () => h(MicroAppLink, { to: '/app1/foo', ...props }, { default: () => h('span', 'Open micro app') }),
    });
    app.mount(host);
    return host.querySelector('a')!;
  };

  const click = (anchor: HTMLAnchorElement, init: MouseEventInit = {}) => {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, ...init });
    const preventDefault = vi.spyOn(event, 'preventDefault');
    anchor.dispatchEvent(event);
    return { event, preventDefault };
  };

  it('renders an anchor with its default slot and anchor attributes', () => {
    const props: InstanceType<typeof MicroAppLink>['$props'] = {
      to: '/app1/foo',
      className: 'link',
      class: 'custom',
      title: 'Application',
      target: '_self',
      rel: 'bookmark',
      onClick: vi.fn(),
      'aria-label': 'Open app',
    };
    const anchor = mount(props);

    expect(anchor.getAttribute('href')).toBe('/app1/foo');
    expect(anchor.querySelector('span')?.textContent).toBe('Open micro app');
    expect(anchor.className).toBe('custom link');
    expect(anchor.title).toBe('Application');
    expect(anchor.getAttribute('aria-label')).toBe('Open app');
    expect(anchor.target).toBe('_self');
    expect(anchor.rel).toBe('bookmark');
    expect(anchor.hasAttribute('to')).toBe(false);
    expect(anchor.hasAttribute('replace')).toBe(false);
    expect(anchor.hasAttribute('activeclassname')).toBe(false);
  });

  it('prevents default and navigates an ordinary left click after calling the user handler once', () => {
    const onClick = vi.fn((event: MouseEvent) => {
      expect(event.defaultPrevented).toBe(false);
      expect(navigateToUrl).not.toHaveBeenCalled();
    });
    const anchor = mount({ onClick });
    const { event, preventDefault } = click(anchor);

    expect(onClick).toHaveBeenCalledExactlyOnceWith(event);
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(event.defaultPrevented).toBe(true);
    expect(navigateToUrl).toHaveBeenCalledExactlyOnceWith(anchor.href);
  });

  it('lets the user handler cancel navigation', () => {
    const onClick = vi.fn((event: MouseEvent) => event.preventDefault());
    const anchor = mount({ onClick });
    const { event, preventDefault } = click(anchor);

    expect(onClick).toHaveBeenCalledExactlyOnceWith(event);
    expect(preventDefault).toHaveBeenCalledOnce();
    expect(navigateToUrl).not.toHaveBeenCalled();
  });

  it('does not navigate an event that was already prevented', () => {
    const anchor = mount();
    const event = new MouseEvent('click', { cancelable: true });
    event.preventDefault();
    anchor.dispatchEvent(event);

    expect(navigateToUrl).not.toHaveBeenCalled();
  });

  it.each<MouseEventInit>([
    { button: 1 },
    { button: 2 },
    { metaKey: true },
    { ctrlKey: true },
    { altKey: true },
    { shiftKey: true },
  ])('preserves native behavior for mouse options %j', (options) => {
    const { preventDefault } = click(mount(), options);

    expect(preventDefault).not.toHaveBeenCalled();
    expect(navigateToUrl).not.toHaveBeenCalled();
  });

  it.each(['https://external.example/app', '//external.example/app', 'mailto:hello@example.com'])(
    'preserves native behavior for external destination %s',
    (to) => {
      const { preventDefault } = click(mount({ to }));

      expect(preventDefault).not.toHaveBeenCalled();
      expect(navigateToUrl).not.toHaveBeenCalled();
    },
  );

  it.each(['_blank', '_parent', 'named-frame'])('preserves native behavior for target %s', (target) => {
    const { preventDefault } = click(mount({ target }));

    expect(preventDefault).not.toHaveBeenCalled();
    expect(navigateToUrl).not.toHaveBeenCalled();
  });

  it('navigates links targeting the current browsing context', () => {
    const anchor = mount({ target: '_self' });
    const { preventDefault } = click(anchor);

    expect(preventDefault).toHaveBeenCalledOnce();
    expect(navigateToUrl).toHaveBeenCalledExactlyOnceWith(anchor.href);
  });

  it('preserves native download behavior', () => {
    const { preventDefault } = click(mount({ download: 'export.html' }));

    expect(preventDefault).not.toHaveBeenCalled();
    expect(navigateToUrl).not.toHaveBeenCalled();
  });

  it('replaces the current history entry and emits popstate', () => {
    window.history.replaceState({ retained: true }, '', '/before');
    const replaceState = vi.spyOn(window.history, 'replaceState');
    const onPopState = vi.fn();
    window.addEventListener('popstate', onPopState);
    try {
      const anchor = mount({ replace: true });
      const { preventDefault } = click(anchor);

      expect(preventDefault).toHaveBeenCalledOnce();
      expect(replaceState).toHaveBeenCalledExactlyOnceWith({ retained: true }, '', anchor.href);
      expect(window.location.pathname).toBe('/app1/foo');
      expect(onPopState).toHaveBeenCalledOnce();
      expect(navigateToUrl).not.toHaveBeenCalled();
    } finally {
      window.removeEventListener('popstate', onPopState);
    }
  });

  it.each(['popstate', 'hashchange', 'single-spa:routing-event'])(
    'updates its active class after %s',
    async (eventName) => {
      const anchor = mount({ to: '/app1', className: 'link', activeClassName: 'active' });
      expect(anchor.className).toBe('link');

      window.history.replaceState(null, '', '/app1/foo');
      window.dispatchEvent(new Event(eventName));
      await nextTick();
      expect(anchor.className).toBe('link active');

      window.history.replaceState(null, '', '/app2');
      window.dispatchEvent(new Event(eventName));
      await nextTick();
      expect(anchor.className).toBe('link');
    },
  );

  it('updates the active class when the destination prop changes', async () => {
    window.history.replaceState(null, '', '/app1/foo');
    const to = ref('/app1');
    app = createApp({ render: () => h(MicroAppLink, { to: to.value, activeClassName: 'active' }) });
    app.mount(host);
    const anchor = host.querySelector('a')!;
    expect(anchor.className).toBe('active');

    to.value = '/app2';
    await nextTick();
    expect(anchor.className).toBe('');
    expect(anchor.getAttribute('href')).toBe('/app2');
  });

  it('updates active links when the navigation routing event arrives', async () => {
    vi.mocked(navigateToUrl).mockImplementationOnce((url) => {
      if (typeof url === 'string') {
        window.history.pushState(null, '', url);
      }
    });
    const anchor = mount({ activeClassName: 'active' });
    click(anchor);
    await nextTick();

    expect(window.location.pathname).toBe('/app1/foo');
    expect(anchor.className).toBe('');

    window.dispatchEvent(new Event('single-spa:routing-event'));
    await nextTick();
    expect(anchor.className).toBe('active');
  });

  it('preserves the original active link when navigation is silently canceled', async () => {
    window.history.replaceState(null, '', '/before');
    vi.mocked(navigateToUrl).mockImplementationOnce((url) => {
      if (typeof url === 'string') {
        window.history.pushState(null, '', url);
      }
    });
    app = createApp({
      render: () =>
        h('nav', [
          h(MicroAppLink, { to: '/before', activeClassName: 'active' }),
          h(MicroAppLink, { to: '/app1/foo', activeClassName: 'active' }),
        ]),
    });
    app.mount(host);
    const [original, destination] = host.querySelectorAll('a');
    expect(original.className).toBe('active');
    expect(destination.className).toBe('');

    click(destination);
    await nextTick();
    expect(window.location.pathname).toBe('/app1/foo');
    expect(original.className).toBe('active');
    expect(destination.className).toBe('');

    // single-spa restores canceled navigation without dispatching a routing event.
    window.history.replaceState(null, '', '/before');
    await nextTick();
    expect(original.className).toBe('active');
    expect(destination.className).toBe('');
  });

  it('removes location listeners when unmounted', () => {
    const addEventListener = vi.spyOn(window, 'addEventListener');
    const removeEventListener = vi.spyOn(window, 'removeEventListener');
    mount({ activeClassName: 'active' });
    const locationSubscriptions = addEventListener.mock.calls.filter(([name]) =>
      ['popstate', 'hashchange', 'single-spa:routing-event'].includes(name),
    );
    expect(locationSubscriptions).toHaveLength(3);

    app?.unmount();
    app = undefined;

    for (const [name, listener] of locationSubscriptions) {
      expect(removeEventListener).toHaveBeenCalledWith(name, listener);
    }
  });
});
