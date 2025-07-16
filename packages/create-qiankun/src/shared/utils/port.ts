import fse from 'fs-extra';
import path from 'node:path';

const commonPorts = [21, 22, 23, 25, 53, 80, 110, 443, 993, 995, 3000, 3306, 5432, 8080, 8443, 9000];
const SYSTEM_PORT_RANGE = 1024;
const MAX_PORT = 65535;
const MAX_ATTEMPTS = 100;

export function composeGeneratePorts(fns: Array<(r: number[]) => number>, excludes: number[] = []): number[] {
  const usedPorts = new Set(excludes);
  const result: number[] = [];

  for (const fn of fns) {
    const port = fn(Array.from(usedPorts));
    usedPorts.add(port);
    result.push(port);
  }

  return result;
}

export function generatePort(created: number[] = []): number {
  const usedPorts = new Set([...commonPorts, ...created]);
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    // 生成一个在安全范围内的端口号 (3001-65535)
    const port = Math.floor(Math.random() * (MAX_PORT - 3001)) + 3001;

    if (!usedPorts.has(port) && port > SYSTEM_PORT_RANGE) {
      return port;
    }

    attempts++;
  }

  // 如果随机生成失败，使用顺序查找
  for (let port = 3001; port <= MAX_PORT; port++) {
    if (!usedPorts.has(port)) {
      return port;
    }
  }

  throw new Error('Unable to find an available port');
}

export async function injectCheckPortScript(projectRoot: string): Promise<void> {
  try {
    const scriptDir = path.resolve(__dirname, '../../../template/scripts');
    const targetScriptDir = path.join(projectRoot, 'scripts');

    // 确保目标目录存在
    await fse.ensureDir(targetScriptDir);

    // 复制脚本文件
    await fse.copy(scriptDir, targetScriptDir);
  } catch (error) {
    throw new Error(`Failed to inject check port script: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function injectPreNpmScript(projectRoot: string): Promise<void> {
  try {
    const packageJsonPath = path.resolve(projectRoot, 'package.json');

    if (!(await fse.pathExists(packageJsonPath))) {
      throw new Error(`package.json not found at ${packageJsonPath}`);
    }

    const pkg = (await fse.readJson(packageJsonPath)) as Record<string, unknown>;

    // 确保scripts对象存在
    if (!pkg.scripts || typeof pkg.scripts !== 'object') {
      pkg.scripts = {};
    }

    const scripts = pkg.scripts as Record<string, unknown>;

    // 添加predev脚本，如果不存在的话
    if (!scripts.predev) {
      scripts.predev = 'node scripts/checkPort.js';
    }

    await fse.writeJson(packageJsonPath, pkg, { spaces: 2 });
  } catch (error) {
    throw new Error(`Failed to inject pre npm script: ${error instanceof Error ? error.message : String(error)}`);
  }
}
