export async function bootstrap() {}

export async function mount(props) {
  const [a, b] = await Promise.all([import('./modules/concurrent-a.js'), import('./modules/concurrent-b.js')]);
  const [colliding, fast] = await Promise.all([
    import('./modules/independent-colliding.js'),
    import('./modules/independent-fast.js'),
  ]);

  const root = (props?.container ?? document).querySelector('#esm-concurrent-root');
  root.innerHTML = [
    `<p data-testid="esm-concurrent-shared">${a.branchA}|${b.branchB}</p>`,
    `<p data-testid="esm-concurrent-independent">${colliding.independentColliding}|${fast.independentFast}</p>`,
  ].join('');
}

export async function unmount(props) {
  const root = (props?.container ?? document).querySelector('#esm-concurrent-root');
  if (root) root.innerHTML = '';
}
