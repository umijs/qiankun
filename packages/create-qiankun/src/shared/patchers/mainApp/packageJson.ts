import path from 'node:path';
import { readJsonFile, writeJsonFile } from '../../utils/fs';
import { QIANKUN_VERSION } from '../../versions';

export async function patchMainPackageJson(appRoot: string, appName: string): Promise<void> {
  const pkgPath = path.join(appRoot, 'package.json');
  const pkg = await readJsonFile<Record<string, unknown>>(pkgPath);

  pkg.name = appName;

  pkg.dependencies = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    qiankun: QIANKUN_VERSION,
  };

  await writeJsonFile(pkgPath, pkg);
}
