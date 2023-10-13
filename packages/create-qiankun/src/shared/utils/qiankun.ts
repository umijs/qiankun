import fse from 'fs-extra';
import path from 'node:path';
export interface ISubConfig {
  subName: string;
  port: number;
}

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
