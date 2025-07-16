import fse from 'fs-extra';
import path, { join, posix } from 'node:path';
import os from 'node:os';
import execa from 'execa';

/**
 * 判断目标路径是否为文件夹
 * @param targetPath 目标路径
 * @returns 如果是目录返回true，否则返回false
 */
export function isDir(targetPath: string): boolean {
  try {
    return fse.lstatSync(targetPath).isDirectory();
  } catch (e: unknown) {
    return false;
  }
}

/**
 * 判断目标路径是否为文件
 * @param targetPath 目标路径
 * @returns 如果是文件返回true，否则返回false
 */
export function isFile(targetPath: string): boolean {
  try {
    return fse.lstatSync(targetPath).isFile();
  } catch (e) {
    return false;
  }
}

/**
 * 简单检测monorepo根目录
 * @param target 目标路径
 * @returns monorepo根目录路径，如果不是monorepo则返回null
 */
export function simpleDetectMonorepoRoot(target: string): string | null {
  try {
    const upperPath = path.resolve(target, '../');
    if (isFile(join(upperPath, 'pnpm-workspace.yaml'))) {
      return upperPath;
    }
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * 获取pnpm主版本号
 * @returns pnpm主版本号
 */
export async function getPnpmMajorVersion(): Promise<number> {
  try {
    const { stdout } = await execa('pnpm', ['--version']);
    const version = stdout.trim();
    const majorVersion = parseInt(version.split('.')[0], 10);

    if (isNaN(majorVersion)) {
      throw new Error(`Invalid pnpm version format: ${version}`);
    }

    return majorVersion;
  } catch (e) {
    if (e instanceof Error && e.message.includes('ENOENT')) {
      throw new Error('pnpm is not installed. Please install pnpm first');
    }
    throw new Error(`Failed to get pnpm version: ${e instanceof Error ? e.message : String(e)}`);
  }
}

/**
 * 初始化Git仓库
 * @param projectRoot 项目根目录
 */
export async function initGit(projectRoot: string): Promise<void> {
  try {
    if (!projectRoot || typeof projectRoot !== 'string') {
      throw new Error('Project root path is required');
    }

    const gitDir = join(projectRoot, '.git');

    // 检查是否已经是Git仓库
    if (await fse.pathExists(gitDir)) {
      console.log('Git repository already exists, skipping initialization');
      return;
    }

    // 确保项目目录存在
    await fse.ensureDir(projectRoot);

    // 初始化Git仓库
    await execa('git', ['init'], { cwd: projectRoot });
    console.log('Git repository initialized successfully');
  } catch (e) {
    // Git初始化失败不应该阻止项目创建
    console.warn(`Failed to initialize git repository: ${e instanceof Error ? e.message : String(e)}`);
  }
}

export const isWindows = os.platform() === 'win32';

/**
 * 规范化路径，确保跨平台兼容性
 * @param p 路径字符串
 * @returns 规范化后的路径
 */
export function normalizePath(p: string): string {
  if (!p || typeof p !== 'string') {
    return '';
  }
  return posix.normalize(isWindows ? p.replace(/\\/g, '/') : p);
}

/**
 * 递归遍历目录
 * @param dir 目录路径
 * @param opts 选项对象，包含目录和文件的回调函数
 */
export function directoryTraverse(
  dir: string,
  opts: {
    dirCallback?: (dirPath: string) => void;
    fileCallback?: (filePath: string) => void;
  },
): void {
  try {
    const { dirCallback, fileCallback } = opts;

    if (!dir || typeof dir !== 'string') {
      throw new Error('Directory path is required');
    }

    if (!isDir(dir)) {
      throw new Error(`Directory does not exist: ${dir}`);
    }

    const items = fse.readdirSync(dir);

    for (const filename of items) {
      // 跳过特殊目录
      if (filename === '.git' || filename === 'node_modules' || filename.startsWith('.')) {
        continue;
      }

      const fullPath = normalizePath(path.resolve(dir, filename));

      if (isDir(fullPath)) {
        dirCallback?.(fullPath);
        directoryTraverse(fullPath, opts);
      } else if (isFile(fullPath)) {
        fileCallback?.(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error traversing directory ${dir}:`, error);
    throw error;
  }
}
