import fse from 'fs-extra';
import path from 'node:path';
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
