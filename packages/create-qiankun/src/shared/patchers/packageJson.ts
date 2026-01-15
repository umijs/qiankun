import path from 'node:path';
import fse from 'fs-extra';
import type { ViteTemplate } from '../types';
import { isReactTemplate } from '../types';

const LEGACY_PLUGIN_VERSION = '^5.4.2';
const CHEERIO_VERSION = '^1.0.0';
const QIANKUN_VERSION = '^3.0.0-rc.0';
const QIANKUN_REACT_VERSION = '^0.0.1-rc.0';
const QIANKUN_VUE_VERSION = '^0.0.1-rc.0';

export async function patchPackageJson(appRoot: string, appName: string, template: ViteTemplate): Promise<void> {
  const pkgPath = path.join(appRoot, 'package.json');
  const pkg = (await fse.readJson(pkgPath)) as Record<string, unknown>;

  pkg.name = appName;

  pkg.scripts = {
    ...(pkg.scripts || {}),
    'build:qiankun': 'vite build --mode qiankun',
    'preview:qiankun': 'vite preview --mode qiankun',
  };

  pkg.devDependencies = {
    ...(pkg.devDependencies || {}),
    '@vitejs/plugin-legacy': LEGACY_PLUGIN_VERSION,
    cheerio: CHEERIO_VERSION,
  };

  const qiankunBinding = isReactTemplate(template)
    ? { '@qiankunjs/react': QIANKUN_REACT_VERSION }
    : { '@qiankunjs/vue': QIANKUN_VUE_VERSION };

  pkg.dependencies = {
    ...(pkg.dependencies || {}),
    qiankun: QIANKUN_VERSION,
    ...qiankunBinding,
  };

  await fse.writeJson(pkgPath, pkg, { spaces: 2 });
}
