let count = 0;

const render = () => {
  const container = document.getElementById('purehtml-container');
  if (!container) return Promise.resolve();

  container.innerHTML = `
    <dl style="margin:0 0 16px;display:grid;gap:10px;">
      <div><dt style="font-size:12px;color:#64748b;">Framework</dt><dd style="margin:2px 0 0;font-weight:600;">Vanilla JS</dd></div>
      <div><dt style="font-size:12px;color:#64748b;">Bundler</dt><dd style="margin:2px 0 0;font-weight:600;">None</dd></div>
      <div><dt style="font-size:12px;color:#64748b;">Runtime</dt><dd style="margin:2px 0 0;font-weight:600;">${window.__POWERED_BY_QIANKUN__ ? 'qiankun' : 'standalone'}</dd></div>
    </dl>
    <button id="purehtml-counter">Counter · ${count}</button>
    <p style="color:#64748b;margin-bottom:0;">该应用可独立运行，也可被主应用通过 qiankun 生命周期挂载。</p>
  `;

  const button = document.getElementById('purehtml-counter');
  button?.addEventListener('click', () => {
    count += 1;
    render();
  });

  return Promise.resolve();
};

(global => {
  global['purehtml'] = {
    bootstrap: () => {
      console.log('purehtml bootstrap');
      return Promise.resolve();
    },
    mount: () => {
      console.log('purehtml mount');
      return render();
    },
    unmount: () => {
      console.log('purehtml unmount');
      const container = document.getElementById('purehtml-container');
      if (container) {
        container.innerHTML = '';
      }
      return Promise.resolve();
    },
  };
})(window);
