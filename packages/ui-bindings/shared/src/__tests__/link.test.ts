import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { navigateToUrl } from 'qiankun';
import { isMicroAppLinkActive, navigateMicroAppLink, subscribeToMicroAppLinkLocation } from '../link';

vi.mock('qiankun', () => ({ navigateToUrl: vi.fn() }));

beforeEach(() => {
  vi.clearAllMocks();
  window.history.replaceState(null, '', '/app1/page?sort=name#details');
});

afterEach(() => {
  document.head.querySelector('base')?.remove();
  vi.restoreAllMocks();
});

describe('isMicroAppLinkActive', () => {
  it.each([
    ['/app1', true],
    ['/app1/page?sort=name', true],
    ['/app1/page?sort=name#details', true],
    ['/app1/page?sort=date', false],
    ['/app1/page?sort=name#other', false],
    ['/app2', false],
    ['https://other.example/app1', false],
    ['mailto:hello@example.com', false],
    ['http://[invalid', false],
  ])('matches the location prefix for %s: %s', (to, active) => {
    expect(isMicroAppLinkActive(to)).toBe(active);
  });

  it('resolves relative links against the document base, like an anchor', () => {
    const base = document.createElement('base');
    base.href = '/app1/';
    document.head.appendChild(base);
    expect(isMicroAppLinkActive('page')).toBe(true);
  });
});

describe('navigateMicroAppLink', () => {
  it('does not duplicate popstate when history.replaceState already dispatches it', () => {
    const replaceState = window.history.replaceState.bind(window.history);
    vi.spyOn(window.history, 'replaceState').mockImplementation((state: unknown, unused, url) => {
      replaceState(state, unused, url);
      window.dispatchEvent(new PopStateEvent('popstate', { state }));
    });
    const listener = vi.fn();
    window.addEventListener('popstate', listener);
    const anchor = document.createElement('a');
    anchor.href = '/app2';
    navigateMicroAppLink(new MouseEvent('click', { cancelable: true }), anchor, true);
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener('popstate', listener);
  });

  it('does not intercept a link whose inherited base target opens another window', () => {
    const base = document.createElement('base');
    base.target = '_blank';
    document.head.appendChild(base);
    const anchor = document.createElement('a');
    anchor.href = '/app2';
    const event = new MouseEvent('click', { cancelable: true });
    navigateMicroAppLink(event, anchor);
    expect(event.defaultPrevented).toBe(false);
    expect(navigateToUrl).not.toHaveBeenCalled();
  });

  it('leaves malformed URLs to the browser', () => {
    const anchor = document.createElement('a');
    anchor.href = 'http://[invalid';
    const event = new MouseEvent('click', { cancelable: true });
    navigateMicroAppLink(event, anchor);
    expect(event.defaultPrevented).toBe(false);
    expect(navigateToUrl).not.toHaveBeenCalled();
  });

  it('waits for routing notifications before updating subscribers, and cleans up', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToMicroAppLinkLocation(listener);
    const anchor = document.createElement('a');
    anchor.href = '/app2';
    const event = new MouseEvent('click', { cancelable: true });
    navigateMicroAppLink(event, anchor);
    expect(listener).not.toHaveBeenCalled();
    for (const name of ['popstate', 'hashchange', 'single-spa:routing-event']) {
      window.dispatchEvent(new Event(name));
    }
    expect(listener).toHaveBeenCalledTimes(3);
    unsubscribe();
    navigateMicroAppLink(new MouseEvent('click', { cancelable: true }), anchor);
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(listener).toHaveBeenCalledTimes(3);
  });
});
