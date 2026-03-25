import path from 'node:path';
import fse from 'fs-extra';
import {
  QIANKUN_VERSION,
  REACT_VERSION,
  REACT_DOM_VERSION,
  REACT_TYPES_VERSION,
  REACT_DOM_TYPES_VERSION,
  VITE_VERSION,
  VITE_PLUGIN_REACT_VERSION,
  TYPESCRIPT_VERSION,
} from '../../versions';

export async function patchMainPackageJson(appRoot: string, appName: string): Promise<void> {
  const pkgPath = path.join(appRoot, 'package.json');
  const pkg = (await fse.readJson(pkgPath)) as Record<string, unknown>;

  pkg.name = appName;

  pkg.dependencies = {
    ...(pkg.dependencies as Record<string, string> | undefined),
    react: REACT_VERSION,
    'react-dom': REACT_DOM_VERSION,
    qiankun: QIANKUN_VERSION,
  };

  pkg.devDependencies = {
    ...(pkg.devDependencies as Record<string, string> | undefined),
    '@types/react': REACT_TYPES_VERSION,
    '@types/react-dom': REACT_DOM_TYPES_VERSION,
    '@vitejs/plugin-react': VITE_PLUGIN_REACT_VERSION,
    typescript: TYPESCRIPT_VERSION,
    vite: VITE_VERSION,
  };

  await fse.writeJson(pkgPath, pkg, { spaces: 2 });
}
