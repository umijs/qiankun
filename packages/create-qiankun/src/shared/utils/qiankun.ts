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
};

export async function injectSubsConfigToMainApp(mainAppPath: string, subsConfig: ISubConfig[] | ISubConfig) {
  subsConfig = Array.isArray(subsConfig) ? subsConfig : [subsConfig];

  const injectConf = subsConfig.map((sub) => ({
    name: sub.subName,
    entry: `//localhost:${sub.port}`,
    container: '#subapp-container',
    activeRule: `/${sub.subName}`,
  }));

  const injectMainAppPath = path.join(mainAppPath, 'src/microApp/subs.json');

  await fse.writeJSON(injectMainAppPath, injectConf, { spaces: 2 });
}
