import fse from 'fs-extra';
import path from 'node:path';

export interface ISubConfig {
  subName: string;
  port: number;
}

export const installQiankunPkgs = {
  qiankun: '^3.0.0-rc.18',
  webpackPlugin: '^0.0.1-rc.4',
  reactComponent: '^0.0.1-rc.13',
  vueComponent: '^0.0.1-rc.0',
} as const;

export async function injectSubsConfigToMainApp(
  mainAppPath: string,
  subsConfig: ISubConfig[] | ISubConfig,
): Promise<void> {
  try {
    if (!mainAppPath || typeof mainAppPath !== 'string') {
      throw new Error('Main application path is required');
    }

    // 确保 subsConfig 是数组格式
    const configArray = Array.isArray(subsConfig) ? subsConfig : [subsConfig];

    if (configArray.length === 0) {
      console.warn('No sub applications configuration provided');
      return;
    }

    // 验证配置数据
    for (const config of configArray) {
      if (!config.subName || typeof config.subName !== 'string') {
        throw new Error('Invalid sub application name in configuration');
      }
      if (!config.port || typeof config.port !== 'number' || config.port <= 0) {
        throw new Error(`Invalid port number for sub application: ${config.subName}`);
      }
    }

    // 构建注入配置
    const injectConf = configArray.map((sub) => ({
      name: sub.subName,
      entry: `//localhost:${sub.port}`,
      container: '#subapp-container',
      activeRule: `/${sub.subName}`,
    }));

    // 确保目标目录存在
    const microAppDir = path.join(mainAppPath, 'src/microApp');
    await fse.ensureDir(microAppDir);

    const injectMainAppPath = path.join(microAppDir, 'subs.json');

    // 写入配置文件
    await fse.writeJSON(injectMainAppPath, injectConf, { spaces: 2 });

    console.log(`Successfully injected ${configArray.length} sub application(s) configuration to main app`);
  } catch (error) {
    throw new Error(
      `Failed to inject sub applications configuration: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
