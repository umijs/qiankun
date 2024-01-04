import fse from 'fs-extra';
import path from 'node:path';
import type { RenderOptions } from '../render';
import { PackageManager } from '../types';
export async function injectWorkspaceScripts(monorepoDirPath: string) {
  const apps = await fse.readdir(monorepoDirPath);

  const pkgPath = path.resolve(monorepoDirPath, '../package.json');
  const pkg = (await fse.readJsonSync(pkgPath)) as Record<string, unknown>;

  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    pkg.scripts = {
      ...(pkg.scripts as Record<string, unknown>),
      [`dev:app${i + 1}`]: `pnpm --filter=./packages/${app} run dev`,
    };
  }

  await fse.writeJson(pkgPath, pkg, { spaces: 2 });
}

export async function injectNormalScripts(opts: RenderOptions) {
  const {
    projectRoot,
    userChoose: { mainAppName, packageManager },
  } = opts;

  const apps = await fse.readdir(projectRoot);

  const pkgPath = path.join(projectRoot, mainAppName!, 'package.json');
  const mainPkg = (await fse.readJsonSync(pkgPath)) as Record<string, unknown>;

  for (let i = 0; i < apps.length; i++) {
    const app = apps[i];
    if (app === (mainAppName as string)) continue;
    mainPkg.scripts = {
      ...(mainPkg.scripts as Record<string, unknown>),
      ...(packageManager !== PackageManager.pnpm
        ? { [`install:app${i + 1}`]: `cd ../${app} && ${packageManager} install` }
        : {}),

      ...(packageManager !== PackageManager.pnpm
        ? { [`dev:app${i + 1}`]: `cd ../${app} && ${packageManager} run dev` }
        : { [`dev:app${i + 1}`]: `pnpm --filter=../${app} run dev` }),
    };
  }

  await fse.writeJson(pkgPath, mainPkg, { spaces: 2 });
}
