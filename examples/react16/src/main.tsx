import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

let root: ReactDOM.Root | null = null;

function render(props: { container?: HTMLElement; baseRoute?: string } = {}) {
  const { container, baseRoute } = props;
  const dom = container ? container.querySelector('#root') : document.getElementById('root');

  if (!dom) {
    console.error('Root element not found');
    return;
  }

  root = ReactDOM.createRoot(dom);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter basename={baseRoute}>
          <App />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </React.StrictMode>
  );
}

export async function bootstrap() {
  console.log('[react18] bootstrap');
}

export async function mount(props: { container?: HTMLElement; baseRoute?: string }) {
  console.log('[react18] mount', props);
  render(props);
}

export async function unmount() {
  console.log('[react18] unmount');
  if (root) {
    root.unmount();
    root = null;
  }
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
