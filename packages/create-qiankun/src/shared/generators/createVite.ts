import { mkdir } from 'node:fs/promises';
import type { ViteTemplate } from '../types';
import { runCommand } from '../utils/process';

export async function generateViteApp(targetDir: string, appName: string, template: ViteTemplate): Promise<void> {
  await mkdir(targetDir, { recursive: true });

  const createViteBin = require.resolve('create-vite');

  await runCommand(process.execPath, [createViteBin, appName, '--template', template], { cwd: targetDir });
}
