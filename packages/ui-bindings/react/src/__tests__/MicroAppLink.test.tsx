/**
 * @vitest-environment happy-dom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type Window } from 'happy-dom';

vi.mock('qiankun', () => ({ loadMicroApp: vi.fn(), navigateToUrl: vi.fn() }));

import React, { act, createRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { navigateToUrl } from 'qiankun';
import { MicroAppLink, type MicroAppLinkProps } from '../index';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const navigateToUrlMock = vi.mocked(navigateToUrl);

describe('MicroAppLink', () => {
  let host: HTMLDivElement;
  let root: Root;
  let originalHref: string;

  beforeEach(() => {
    vi.clearAllMocks();
    const happyWindow = window as unknown as Window;
    happyWindow.happyDOM.settings.navigation.disableMainFrameNavigation = true;
    happyWindow.happyDOM.settings.navigation.disableChildFrameNavigation = true;
    happyWindow.happyDOM.settings.navigation.disableChildPageNavigation = true;
    originalHref = window.location.href;
    window.history.replaceState(null, '', '/');
    host = document.createElement('div');
    document.body.appendChild(host);
    root = createRoot(host);
    navigateToUrlMock.mockImplementation((url) => {
      window.history.pushState(null, '', url as string);
    });
  });

  afterEach(() => {
    act(() => root.unmount());
    host.remove();
    // Native external links change happy-dom's origin even with network navigation disabled.
    (window as unknown as Window).happyDOM.setURL(originalHref);
    vi.restoreAllMocks();
  });

  async function render(props: MicroAppLinkProps) {
    await act(async () => {
      root.render(<MicroAppLink {...props} />);
    });
    return host.querySelector('a')!;
  }

  function click(anchor: HTMLAnchorElement, options: MouseEventInit = {}) {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...options });
    act(() => {
      anchor.dispatchEvent(event);
    });
    return event;
  }

  it('renders an anchor, forwards its attributes and children, and exposes its ref', async () => {
    const ref = createRef<HTMLAnchorElement>();
    await act(async () => {
      root.render(
        <MicroAppLink
          ref={ref}
          to="/app1/foo"
          replace
          activeClassName="active"
          className="navigation-link"
          title="Open app one"
          aria-label="App one"
          target="_self"
          rel="help"
        >
          <span>App one</span>
        </MicroAppLink>,
      );
    });

    const anchor = host.querySelector('a')!;
    expect(ref.current).toBe(anchor);
    expect(anchor.getAttribute('href')).toBe('/app1/foo');
    expect(anchor.className).toBe('navigation-link');
    expect(anchor.title).toBe('Open app one');
    expect(anchor.getAttribute('aria-label')).toBe('App one');
    expect(anchor.target).toBe('_self');
    expect(anchor.rel).toBe('help');
    expect(anchor.querySelector('span')?.textContent).toBe('App one');
    expect(anchor.hasAttribute('to')).toBe(false);
    expect(anchor.hasAttribute('replace')).toBe(false);
    expect(anchor.hasAttribute('activeClassName')).toBe(false);

    await act(async () => root.render(null));
    expect(ref.current).toBeNull();
  });

  it.each([undefined, '', '_self'])('intercepts plain left clicks with target %s', async (target) => {
    const onClick = vi.fn<NonNullable<MicroAppLinkProps['onClick']>>((event) => {
      expect(event.defaultPrevented).toBe(false);
      expect(navigateToUrlMock).not.toHaveBeenCalled();
    });
    const anchor = await render({ to: '/app1/foo', target, onClick, children: <span>App one</span> });
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    const preventDefault = vi.spyOn(event, 'preventDefault');

    act(() => anchor.querySelector('span')!.dispatchEvent(event));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
    expect(navigateToUrlMock).toHaveBeenCalledExactlyOnceWith(new URL('/app1/foo', originalHref).href);
  });

  it.each<MouseEventInit>([
    { metaKey: true },
    { ctrlKey: true },
    { shiftKey: true },
    { altKey: true },
    { button: 1 },
    { button: 2 },
  ])('preserves native behavior for click options %j', async (options) => {
    const anchor = await render({ to: '/app1/foo' });
    const event = click(anchor, options);

    expect(event.defaultPrevented).toBe(false);
    expect(navigateToUrlMock).not.toHaveBeenCalled();
  });

  it('lets the caller prevent navigation in onClick', async () => {
    const anchor = await render({ to: '/app1/foo', onClick: (event) => event.preventDefault() });

    expect(click(anchor).defaultPrevented).toBe(true);
    expect(navigateToUrlMock).not.toHaveBeenCalled();
  });

  it('does not navigate an event already prevented before the React handler', async () => {
    const anchor = await render({ to: '/app1/foo' });
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    event.preventDefault();

    act(() => anchor.dispatchEvent(event));

    expect(navigateToUrlMock).not.toHaveBeenCalled();
  });

  it.each<MicroAppLinkProps>([
    { to: '/app1/foo', target: '_blank' },
    { to: '/app1/foo', target: '_parent' },
    { to: '/app1/foo', target: 'another-frame' },
    { to: '/app1/foo', download: true },
    { to: '/app1/foo', download: '' },
    { to: '/app1/foo', download: 'app.html' },
    { to: 'https://external.example/app1' },
    { to: '//external.example/app1' },
    { to: 'mailto:help@example.com' },
    { to: 'tel:+1234567' },
  ])('preserves native behavior for anchor props %j', async (props) => {
    const anchor = await render(props);
    const event = click(anchor);

    expect(event.defaultPrevented).toBe(false);
    expect(navigateToUrlMock).not.toHaveBeenCalled();
  });

  it('handles same-origin absolute destinations', async () => {
    const to = new URL('/app1/foo', originalHref).href;
    const anchor = await render({ to });

    expect(click(anchor).defaultPrevented).toBe(true);
    expect(navigateToUrlMock).toHaveBeenCalledExactlyOnceWith(to);
  });

  it('replaces the history entry and emits popstate without adding an entry', async () => {
    window.history.replaceState({ host: 'state' }, '', '/app1');
    const replaceState = vi.spyOn(window.history, 'replaceState');
    const pushState = vi.spyOn(window.history, 'pushState');
    const onPopState = vi.fn();
    window.addEventListener('popstate', onPopState);
    const anchor = await render({ to: '/app2/foo', replace: true, activeClassName: 'active' });

    expect(click(anchor).defaultPrevented).toBe(true);
    expect(replaceState).toHaveBeenCalledExactlyOnceWith(
      { host: 'state' },
      '',
      new URL('/app2/foo', originalHref).href,
    );
    expect(pushState).not.toHaveBeenCalled();
    expect(onPopState).toHaveBeenCalledTimes(1);
    expect(window.location.pathname).toBe('/app2/foo');
    expect(anchor.className).toBe('active');
    expect(navigateToUrlMock).not.toHaveBeenCalled();
    window.removeEventListener('popstate', onPopState);
  });

  it('matches the current location prefix and retains the base class', async () => {
    window.history.replaceState(null, '', '/app1/foo?view=details#content');
    let anchor = await render({ to: '/app1', className: 'navigation-link', activeClassName: 'active' });
    expect(anchor.className).toBe('navigation-link active');

    anchor = await render({ to: '/app2', className: 'navigation-link', activeClassName: 'active' });
    expect(anchor.className).toBe('navigation-link');

    anchor = await render({ to: '/app1' });
    expect(anchor.hasAttribute('class')).toBe(false);
  });

  it('keeps the current link active until a routing event confirms navigation', async () => {
    window.history.replaceState(null, '', '/app1');
    await act(async () => {
      root.render(
        <>
          <MicroAppLink to="/app1" activeClassName="active">
            App one
          </MicroAppLink>
          <MicroAppLink to="/app2" activeClassName="active">
            App two
          </MicroAppLink>
        </>,
      );
    });
    const [first, second] = Array.from(host.querySelectorAll('a'));

    click(second);
    expect(window.location.pathname).toBe('/app2');
    expect(first.className).toBe('active');
    expect(second.className).toBe('');

    act(() => window.dispatchEvent(new Event('single-spa:routing-event')));
    expect(first.className).toBe('');
    expect(second.className).toBe('active');
  });

  it('retains the original active link when navigation is canceled with a silent rollback', async () => {
    window.history.replaceState(null, '', '/app1');
    await act(async () => {
      root.render(
        <>
          <MicroAppLink to="/app1" activeClassName="active">
            App one
          </MicroAppLink>
          <MicroAppLink to="/app2" activeClassName="active">
            App two
          </MicroAppLink>
        </>,
      );
    });
    const [first, second] = Array.from(host.querySelectorAll('a'));

    click(second);
    expect(window.location.pathname).toBe('/app2');
    expect(first.className).toBe('active');
    expect(second.className).toBe('');

    // single-spa restores the URL without a routing event when cancelNavigation resolves true.
    act(() => window.history.replaceState(null, '', '/app1'));
    expect(window.location.pathname).toBe('/app1');
    expect(first.className).toBe('active');
    expect(second.className).toBe('');
  });

  it.each(['popstate', 'hashchange', 'single-spa:routing-event'])(
    'updates active styling when %s is dispatched',
    async (eventType) => {
      const anchor = await render({ to: '/app1#details', activeClassName: 'active' });
      expect(anchor.className).toBe('');

      act(() => {
        window.history.replaceState(null, '', '/app1#details');
        window.dispatchEvent(new Event(eventType));
      });
      expect(anchor.className).toBe('active');

      act(() => {
        window.history.replaceState(null, '', '/app2');
        window.dispatchEvent(new Event(eventType));
      });
      expect(anchor.className).toBe('');
    },
  );

  it('removes location listeners when unmounted', async () => {
    const addEventListener = vi.spyOn(window, 'addEventListener');
    const removeEventListener = vi.spyOn(window, 'removeEventListener');
    await render({ to: '/app1', activeClassName: 'active' });
    const routingListeners = addEventListener.mock.calls.filter(([name]) =>
      ['popstate', 'hashchange', 'single-spa:routing-event'].includes(name),
    );
    expect(routingListeners).toHaveLength(3);

    await act(async () => root.render(null));

    for (const [name, listener] of routingListeners) {
      expect(removeEventListener).toHaveBeenCalledWith(name, listener);
    }
  });
});
