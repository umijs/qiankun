import path from 'node:path';
import fse from 'fs-extra';
import type { ViteTemplate } from '../types';
import { isReactTemplate } from '../types';
import { BUNDLER_PLUGIN_VERSION, QIANKUN_VERSION, QIANKUN_REACT_VERSION, QIANKUN_VUE_VERSION } from '../versions';

export async function patchPackageJson(appRoot: string, appName: string, template: ViteTemplate): Promise<void> {
  const pkgPath = path.join(appRoot, 'package.json');
  const pkg = (await fse.readJson(pkgPath)) as Record<string, unknown>;

  pkg.name = appName;

  // qiankun loads Vite apps natively through its ESM sandbox: the regular
  // dev/build/preview outputs are already qiankun-compatible, no dedicated
  // qiankun build mode is required
  pkg.devDependencies = {
    ...(pkg.devDependencies || {}),
    '@qiankunjs/bundler-plugin': BUNDLER_PLUGIN_VERSION,
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
