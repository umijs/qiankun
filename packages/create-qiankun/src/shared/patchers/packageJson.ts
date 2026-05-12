import path from 'node:path';
import fse from 'fs-extra';
import type { ViteTemplate } from '../types';
import { isReactTemplate } from '../types';
import {
  QIANKUN_VERSION,
  QIANKUN_REACT_VERSION,
  QIANKUN_VUE_VERSION,
  REACT_VERSION,
  REACT_DOM_VERSION,
  REACT_TYPES_VERSION,
  REACT_DOM_TYPES_VERSION,
  VITE_VERSION,
  VITE_PLUGIN_REACT_VERSION,
  VITE_PLUGIN_VUE_VERSION,
  TYPESCRIPT_VERSION,
  VUE_VERSION,
  VUE_TSC_VERSION,
} from '../versions';

export async function patchPackageJson(appRoot: string, appName: string, template: ViteTemplate): Promise<void> {
  const pkgPath = path.join(appRoot, 'package.json');
  const pkg = (await fse.readJson(pkgPath)) as Record<string, unknown>;

  pkg.name = appName;

  pkg.scripts = {
    ...(pkg.scripts || {}),
    'build:qiankun': 'vite build --mode qiankun',
    'preview:qiankun': 'vite preview --mode qiankun',
  };

  if (isReactTemplate(template)) {
    pkg.dependencies = {
      ...(pkg.dependencies || {}),
      react: REACT_VERSION,
      'react-dom': REACT_DOM_VERSION,
      qiankun: QIANKUN_VERSION,
      '@qiankunjs/react': QIANKUN_REACT_VERSION,
    };

    pkg.devDependencies = {
      ...(pkg.devDependencies || {}),
      '@types/react': REACT_TYPES_VERSION,
      '@types/react-dom': REACT_DOM_TYPES_VERSION,
      '@vitejs/plugin-react': VITE_PLUGIN_REACT_VERSION,
      typescript: TYPESCRIPT_VERSION,
      vite: VITE_VERSION,
    };
  } else {
    pkg.dependencies = {
      ...(pkg.dependencies || {}),
      vue: VUE_VERSION,
      qiankun: QIANKUN_VERSION,
      '@qiankunjs/vue': QIANKUN_VUE_VERSION,
    };

    pkg.devDependencies = {
      ...(pkg.devDependencies || {}),
      '@vitejs/plugin-vue': VITE_PLUGIN_VUE_VERSION,
      typescript: TYPESCRIPT_VERSION,
      'vue-tsc': VUE_TSC_VERSION,
      vite: VITE_VERSION,
    };
  }

  await fse.writeJson(pkgPath, pkg, { spaces: 2 });
}
