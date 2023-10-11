import fse from 'fs-extra';
import path, { join, posix } from 'node:path';
import os from 'node:os';
import execa from 'execa';

export * from './create-subapp'

/**
 * 判断目标路径是否为文件夹
 * @param targetPath
 * @returns
 */
export function isDir(targetPath: string) {
  try {
    return fse.lstatSync(targetPath).isDirectory();
  } catch (e: unknown) {
    return false;
  }
}

/**
 * 判断目标路径是否为文件
 * @param targetPath
 * @returns
 */
export function isFile(targetPath: string) {
  try {
    return fse.lstatSync(targetPath).isFile();
  } catch (e) {
    return false;
  }
}

export function simpleDetectMonorepoRoot(target: string) {
  const upperPath = path.join(target, '../');
  if (isFile(join(upperPath, 'pnpm-workspace.yaml'))) {
    return upperPath;
  }
  return null;
}

export async function getPnpmMajorVersion() {
  try {
    const { stdout } = await execa('pnpm', ['--version']);
    return parseInt(stdout.trim().split('.')[0], 10);
  } catch (e) {
    throw new Error('Please install pnpm first');
  }
}

export async function initGit(projectRoot: string) {
  const isGit = fse.existsSync(join(projectRoot, '.git'));
  if (isGit) return;
  try {
    await execa('git', ['init'], { cwd: projectRoot });
  } catch {
    console.log(`Initial the git repo failed`);
  }
}

export const isWindows = os.platform() === 'win32';
export function normalizePath(path: string) {
  return posix.normalize(isWindows ? path.replace(/\\/g, '/') : path);
}

export function directoryTraverse(
  dir: string,
  opts: {
    dirCallback?: (dirPath: string) => void;
    fileCallback?: (filePath: string) => void;
  },
) {
  const { dirCallback, fileCallback } = opts;
  for (const filename of fse.readdirSync(dir)) {
    if (filename === '.git' || filename === 'node_modules') {
      continue;
    }
    const fullPath = normalizePath(path.resolve(dir, filename));
    if (isDir(fullPath)) {
      dirCallback?.(fullPath);
      directoryTraverse(fullPath, opts);
      continue;
    }
    fileCallback?.(fullPath);
  }
}
