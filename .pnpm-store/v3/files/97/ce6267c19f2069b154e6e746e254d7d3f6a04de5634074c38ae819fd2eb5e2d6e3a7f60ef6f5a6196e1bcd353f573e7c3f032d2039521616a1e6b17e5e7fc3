import { cleanup, render } from '@testing-library/react';
import { Plugin } from '@umijs/runtime';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { renderClient } from './renderClient';

let container: HTMLDivElement;
beforeEach(() => {
  container = document.createElement('div');
  container.id = 'app';
  document.body.appendChild(container);
});

afterEach(async () => {
  document.body.removeChild(container);
  // @ts-ignore
  container = null;
  await cleanup();
});

test('normal', () => {
  const plugin = new Plugin({
    validKeys: ['rootContainer'],
  });
  plugin.register({
    apply: {
      rootContainer(container: any, args: any) {
        if (!(args.plugin && args.routes)) {
          throw new Error(
            'history, plugin or routes not exists in the args of rootContainer',
          );
        }
        return (
          <div>
            <h1>root container</h1>
            {container}
          </div>
        );
      },
    },
    path: '/foo',
  });
  const routes = [
    { path: '/foo', component: () => <h1>foo</h1> },
    { path: '/bar', component: () => <h1>bar</h1> },
  ];

  const { container: container1 } = render(
    renderClient({
      plugin,
      routes,
      path: '/foo',
    }),
  );
  expect(container1.innerHTML).toEqual(
    '<div><h1>root container</h1><h1>foo</h1></div>',
  );

  // @ts-ignore
  window.g_path = '/bar';
  const { container: container2 } = render(
    renderClient({
      plugin,
      routes,
    }),
  );
  expect(container2.innerHTML).toEqual(
    '<div><h1>root container</h1><h1>bar</h1></div>',
  );

  expect(() => {
    renderClient({
      plugin,
      routes,
      path: '/haha',
    });
  }).toThrow(/Render failed, route of path \/haha not found\./);

  let loading = true;
  act(() => {
    renderClient({
      plugin,
      routes,
      rootElement: 'app',
      callback: () => {
        loading = false;
      },
    });
  });
  expect(loading).toBeFalsy();
});

test('do not support child routes', () => {
  const plugin = new Plugin({
    validKeys: [],
  });
  expect(() => {
    renderClient({
      routes: [{ path: '/', routes: [] }],
      plugin,
    });
  }).toThrow(/Render failed, child routes is not supported in mpa renderer\./);
});
