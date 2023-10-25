import fse from 'fs-extra';
import path from 'node:path';
const commonPorts = [21, 22, 23, 25, 53, 80, 110, 443, 3306, 8080];

export function composeGeneratePorts(fns: Array<(r: number[]) => number>, excludes: number[] = []) {
  return fns.reduce((acc, fn) => acc.concat(fn(acc)), excludes).slice(excludes.length);
}

export function generatePort(created: number[] = []) {
  // 特定的常用端口和系统端口
  let port;
  do {
    // 随机生成一个端口号（1 - 65535）
    port = Math.floor(Math.random() * 65535) + 1;
  } while (commonPorts.includes(port) || port <= 1024 || created.includes(port));

  return port;
}

export async function injectCheckPortScript(projectRoot: string, data: Record<string, unknown>) {
  const scriptDir = path.resolve(__dirname, '../../../template/scripts');
  console.log('injectCheckPortScript', projectRoot, 'src', scriptDir);

  await fse.copy(scriptDir, path.join(projectRoot, 'scripts'));

  const pkg = fse.readJsonSync(path.resolve(projectRoot, 'package.json')) as Record<string, unknown>;

  pkg.scripts = {
    predev: 'node scripts/checkPort.js',
    // @ts-ignore
    ...pkg.scripts,
  };

  await fse.writeFile(path.resolve(projectRoot, 'package.json'), JSON.stringify(pkg, null, 2));
}
