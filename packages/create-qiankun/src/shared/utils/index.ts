import fse from 'fs-extra';
import path from 'node:path';

export function isDirectory(targetPath: string): boolean {
  try {
    return fse.lstatSync(targetPath).isDirectory();
  } catch {
    return false;
  }
}

export function isFile(targetPath: string): boolean {
  try {
    return fse.lstatSync(targetPath).isFile();
  } catch {
    return false;
  }
}

export function detectWorkspaceRoot(targetDir: string): string | null {
  const parentDir = path.dirname(targetDir);
  if (isFile(path.join(parentDir, 'pnpm-workspace.yaml'))) {
    return parentDir;
  }
  return null;
}
