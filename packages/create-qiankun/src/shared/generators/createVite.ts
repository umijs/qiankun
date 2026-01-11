import fse from 'fs-extra';
import execa from 'execa';
import type { ViteTemplate } from '../types';

export async function generateViteApp(targetDir: string, appName: string, template: ViteTemplate): Promise<void> {
  await fse.ensureDir(targetDir);

  const createViteBin = require.resolve('create-vite');

  await execa(process.execPath, [createViteBin, appName, '--template', template], {
    cwd: targetDir,
    stdio: 'inherit',
  });
}
