let count = 0;
let qiankunVersion = 'N/A';

const render = () => {
  const container = document.getElementById('purehtml-container');
  const qiankunVersionTag = document.getElementById('purehtml-qiankun-version');
  const runtimeTag = document.getElementById('purehtml-runtime');

  if (qiankunVersionTag) {
    qiankunVersionTag.textContent = `qiankun ${qiankunVersion}`;
  }

  if (runtimeTag) {
    runtimeTag.textContent = window.__POWERED_BY_QIANKUN__ ? 'qiankun' : 'standalone';
  }

  if (!container) return Promise.resolve();

  container.innerHTML = `
    <h2 class="app-section-title">应用状态</h2>
    <dl class="stats-grid">
      <div class="stat-item"><dt>Framework</dt><dd>Vanilla JS</dd></div>
      <div class="stat-item"><dt>Bundler</dt><dd>None</dd></div>
      <div class="stat-item"><dt>Runtime</dt><dd>${window.__POWERED_BY_QIANKUN__ ? 'qiankun' : 'standalone'}</dd></div>
      <div class="stat-item"><dt>qiankun</dt><dd>${qiankunVersion}</dd></div>
    </dl>
    <button id="purehtml-counter" class="btn">Counter · ${count}</button>
    <p class="hint">该应用可独立运行，也可被主应用通过 qiankun 生命周期挂载。</p>
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
    mount: (props = {}) => {
      console.log('purehtml mount', props);
      qiankunVersion = props?.qiankunVersion ?? qiankunVersion;
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
