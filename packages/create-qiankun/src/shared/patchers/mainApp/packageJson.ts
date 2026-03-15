import path from 'node:path';
import fse from 'fs-extra';

const QIANKUN_VERSION = '^3.0.0-rc.0';

export async function patchMainPackageJson(appRoot: string, appName: string): Promise<void> {
  const pkgPath = path.join(appRoot, 'package.json');
  const pkg = (await fse.readJson(pkgPath)) as Record<string, unknown>;

  pkg.name = appName;

  pkg.dependencies = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    qiankun: QIANKUN_VERSION,
  };

  await fse.writeJson(pkgPath, pkg, { spaces: 2 });
}
