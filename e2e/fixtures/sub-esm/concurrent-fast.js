window.__CONCURRENT_FAST_RAN__ = true;

const root = document.querySelector('#esm-root');
if (root) {
  const marker = document.createElement('span');
  marker.dataset.testid = 'esm-concurrent-fast';
  marker.textContent = 'fast-done';
  root.appendChild(marker);
}
