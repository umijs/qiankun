import { build } from 'vite';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const require = createRequire(import.meta.url);
const vitepressRequire = createRequire(require.resolve('vitepress'));
const legacyViteRequire = createRequire(vitepressRequire.resolve('vite'));
const { build: esbuild } = await import(pathToFileURL(legacyViteRequire.resolve('esbuild')).href);
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = dirname(fileURLToPath(import.meta.url));
const repo = resolve(root, '../../../..');
const installed = repo;
const alias = Object.fromEntries(
  ['qiankun', 'shared', 'loader', 'sandbox'].map((name) => [
    `@qiankunjs/${name}`,
    `${repo}/packages/${name}/src/index.ts`,
  ]),
);
alias['@qiankunjs/single-spa'] = `${repo}/packages/single-spa/src/single-spa.ts`;
alias.lodash = `${installed}/packages/shared/node_modules/lodash`;
alias['es-module-lexer/js'] = `${installed}/packages/shared/node_modules/es-module-lexer/dist/lexer.asm.js`;
alias['compare-versions'] = `${installed}/packages/shared/node_modules/compare-versions`;
await build({
  configFile: false,
  root,
  define: { __PROFILE__: 'false', __DEV__: 'false', __QIANKUN_VERSION__: JSON.stringify('3.0.0-rc.30-research') },
  resolve: { alias },
  build: { outDir: 'dist', emptyOutDir: true, minify: false, sourcemap: false },
});
await mkdir(`${root}/bundles`, { recursive: true });
const prefix = `performance.mark('business-start');window.__experimentExecutions=(window.__experimentExecutions||0)+1;window.__experimentCurrentScriptSrc=document.currentScript.src;\n`;
const metadata = [];
let mermaid = await readFile(`${installed}/node_modules/mermaid/dist/mermaid.min.js`, 'utf8');
// Adapt the browser distribution's global export to its function-local var.
mermaid = mermaid.replace(
  'globalThis.__esbuild_esm_mermaid_nm["mermaid"].default',
  '__esbuild_esm_mermaid_nm["mermaid"].default',
);
const suffix = `
window.mermaid.initialize({startOnLoad:false,securityLevel:'strict',theme:'default'});
window.__experimentChecksum=24;window.__experimentModulesExecuted=1;
performance.mark('business-end');
window['classic-experiment-app']={bootstrap:async()=>{},mount:async({container})=>{
performance.mark('render-start');
const core=document.createElement('section');core.id='experiment-core';core.dataset.mounted='true';core.dataset.checksum='24';core.style.cssText='--benchmark-style-ready:1;display:block;min-height:120px;width:900px';
core.innerHTML='<h1 data-benchmark-critical>Production Mermaid graph</h1><div id="diagram-root"></div>';container.appendChild(core);
const graph='flowchart LR\\n'+Array.from({length:24},(_,i)=>'n'+i+'[Service '+i+'] --> n'+((i+1)%24)).join('\\n');
const {svg}=await window.mermaid.render('real-diagram',graph);core.querySelector('#diagram-root').innerHTML=svg;
if(core.querySelectorAll('svg .node').length!==24)throw Error('Mermaid node count');performance.mark('render-end');
},unmount:async({container})=>{container.innerHTML='';}};
`;
await add('mermaid', prefix + mermaid + suffix, {
  mermaid: '11.16.0',
  adaptation: 'export bridge only',
  expectedChecksum: 24,
});
const cy = `${installed}/node_modules/cytoscape/dist/cytoscape.esm.min.mjs`;
const react = `${installed}/examples/webpack/node_modules/react/index.js`;
const reactDOM = `${installed}/examples/webpack/node_modules/react-dom/client.js`;
const entry = `
import React from ${JSON.stringify(react)};
import {createRoot} from ${JSON.stringify(reactDOM)};
import cytoscape from ${JSON.stringify(cy)};
let root, graph;
window.__experimentChecksum=80;window.__experimentModulesExecuted=1;
performance.mark('business-end');
window['classic-experiment-app']={bootstrap:async()=>{},mount:async({container})=>{
performance.mark('render-start');
const core=document.createElement('section');core.id='experiment-core';core.dataset.mounted='true';core.dataset.checksum='80';core.style.cssText='--benchmark-style-ready:1;display:block;min-height:120px;width:900px';container.appendChild(core);
root=createRoot(core);root.render(React.createElement('div',null,React.createElement('h1',{'data-benchmark-critical':true},'React and Cytoscape production graph'),React.createElement('div',{id:'graph-root',style:{width:850,height:400}})));
while(!core.querySelector('#graph-root'))await new Promise(requestAnimationFrame);
const nodes=Array.from({length:80},(_,i)=>({data:{id:'n'+i,label:'Service '+i}}));
const edges=Array.from({length:79},(_,i)=>({data:{id:'e'+i,source:'n'+i,target:'n'+(i+1)}}));
graph=cytoscape({container:core.querySelector('#graph-root'),elements:[...nodes,...edges],layout:{name:'grid'},style:[{selector:'node',style:{'background-color':'#3b82f6',label:'data(label)'}}]});
if(graph.nodes().length!==80)throw Error('Cytoscape node count');performance.mark('render-end');
},unmount:async({container})=>{graph?.destroy();root?.unmount();container.innerHTML='';}};`;
const result = await esbuild({
  stdin: { contents: entry, resolveDir: root, sourcefile: 'real-react-graph.js' },
  bundle: true,
  format: 'iife',
  platform: 'browser',
  minify: true,
  define: { 'process.env.NODE_ENV': '"production"' },
  write: false,
});
await add('react-cytoscape', prefix + result.outputFiles[0].text, {
  react: '19.2.7',
  cytoscape: '3.34.0',
  expectedChecksum: 80,
});
async function add(name, source, info) {
  await writeFile(`${root}/bundles/${name}.js`, source);
  metadata.push({
    name,
    bytes: Buffer.byteLength(source),
    sha256: createHash('sha256').update(source).digest('hex'),
    ...info,
  });
}
await writeFile(`${root}/bundles/metadata.json`, JSON.stringify(metadata, null, 2));
console.log(JSON.stringify(metadata, null, 2));
