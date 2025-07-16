import fse from 'fs-extra';
import path from 'node:path';
import type { RenderOptions } from '../render';
import { PackageManager } from '../types';

export async function injectWorkspaceScripts(monorepoDirPath: string): Promise<void> {
  try {
    const packagesDir = path.resolve(monorepoDirPath, '../packages');
    const rootPkgPath = path.resolve(monorepoDirPath, '../package.json');

    if (!(await fse.pathExists(packagesDir))) {
      throw new Error(`Packages directory not found: ${packagesDir}`);
    }

    if (!(await fse.pathExists(rootPkgPath))) {
      throw new Error(`Root package.json not found: ${rootPkgPath}`);
    }

    const apps = await fse.readdir(packagesDir);
    const validApps = [];

    // 验证每个应用目录都包含package.json
    for (const app of apps) {
      const appPkgPath = path.join(packagesDir, app, 'package.json');
      if (await fse.pathExists(appPkgPath)) {
        validApps.push(app);
      }
    }

    if (validApps.length === 0) {
      console.warn('No valid applications found in packages directory');
      return;
    }

    const pkg = (await fse.readJson(rootPkgPath)) as Record<string, unknown>;

    // 确保scripts对象存在
    if (!pkg.scripts || typeof pkg.scripts !== 'object') {
      pkg.scripts = {};
    }

    const scripts = pkg.scripts as Record<string, unknown>;

    // 为每个应用添加开发脚本
    validApps.forEach((app, index) => {
      const scriptName = `dev:app${index + 1}`;
      if (!scripts[scriptName]) {
        scripts[scriptName] = `pnpm --filter=./packages/${app} run dev`;
      }
    });

    await fse.writeJson(rootPkgPath, pkg, { spaces: 2 });
  } catch (error) {
    throw new Error(`Failed to inject workspace scripts: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function injectNormalScripts(opts: RenderOptions): Promise<void> {
  try {
    const {
      projectRoot,
      userChoose: { mainAppName, packageManager },
    } = opts;

    if (!mainAppName) {
      throw new Error('Main application name is required');
    }

    const mainAppDir = path.join(projectRoot, mainAppName);
    if (!(await fse.pathExists(mainAppDir))) {
      throw new Error(`Main application directory not found: ${mainAppDir}`);
    }

    // 获取项目根目录下的所有应用
    const allItems = await fse.readdir(projectRoot);
    const apps: string[] = [];

    // 筛选出有效的应用目录（包含package.json的目录）
    for (const item of allItems) {
      const itemPath = path.join(projectRoot, item);
      const itemStat = await fse.stat(itemPath);

      if (itemStat.isDirectory() && item !== mainAppName) {
        const packageJsonPath = path.join(itemPath, 'package.json');
        if (await fse.pathExists(packageJsonPath)) {
          apps.push(item);
        }
      }
    }

    if (apps.length === 0) {
      console.warn('No sub applications found');
      return;
    }

    const mainPkgPath = path.join(mainAppDir, 'package.json');
    const mainPkg = (await fse.readJson(mainPkgPath)) as Record<string, unknown>;

    // 确保scripts对象存在
    if (!mainPkg.scripts || typeof mainPkg.scripts !== 'object') {
      mainPkg.scripts = {};
    }

    const scripts = mainPkg.scripts as Record<string, unknown>;

    // 为每个子应用添加脚本
    apps.forEach((app, index) => {
      const scriptIndex = index + 1;

      // 添加安装脚本（非pnpm时）
      if (packageManager !== PackageManager.pnpm) {
        const installScriptName = `install:app${scriptIndex}`;
        if (!scripts[installScriptName]) {
          scripts[installScriptName] = `cd ../${app} && ${packageManager} install`;
        }
      }

      // 添加开发脚本
      const devScriptName = `dev:app${scriptIndex}`;
      if (!scripts[devScriptName]) {
        if (packageManager !== PackageManager.pnpm) {
          scripts[devScriptName] = `cd ../${app} && ${packageManager} run dev`;
        } else {
          scripts[devScriptName] = `pnpm --filter=../${app} run dev`;
        }
      }
    });

    await fse.writeJson(mainPkgPath, mainPkg, { spaces: 2 });
  } catch (error) {
    throw new Error(`Failed to inject normal scripts: ${error instanceof Error ? error.message : String(error)}`);
  }
}
