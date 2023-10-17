import { directoryTraverse, initGit, normalizePath } from './utils';
import fse from 'fs-extra';
import ejs from 'ejs';
import path from 'node:path';
import type { MainFrameworkTemplate, SubFrameworkTemplate } from './template';
import { PackageManager } from './types';
import type { PromptAnswer } from './types';

export interface RenderOptions {
  projectRoot: string;
  userChoose: PromptAnswer;
  gitInit?: boolean;
  monorepoDirPath?: string;
  // hooks?: {
  //   beforeCopy: () => Promise<void>;
  // };
}

export interface IRenderContext {
  /** 模板根目录 */
  templateDir: string;
  /** 临时目录, 一般创建 monorepo的根路径 packages 那一层，不是 monorepo 则跟 projectRoot 一样 */
  tmpDir: string;
  /** 应用最终生成的文件夹路径 */
  applicationTargetPath: string;
  /** monorepo的根路径 */
  monorepoDirPath?: string;
}

export async function createApplication(
  templateName: MainFrameworkTemplate | SubFrameworkTemplate,
  data: Record<string, unknown>,
  opts: RenderOptions,
) {
  const { projectRoot, userChoose, gitInit = false } = opts;
  const { monorepoDirPath } = opts;
  const { packageManager, projectName } = userChoose;

  const context: IRenderContext = {
    templateDir: path.join(__dirname, '../../template'),
    tmpDir: projectRoot,
    applicationTargetPath: path.join(projectRoot, templateName),
    monorepoDirPath: opts.monorepoDirPath,
  };

  if (packageManager === PackageManager.pnpmWorkspace) {
    if (monorepoDirPath) {
      context.applicationTargetPath = monorepoDirPath;
    } else {
      // 先构建monorepo
      await fse.copy(path.join(context.templateDir, 'base'), context.tmpDir);
      const pkg = (await fse.readJson(path.join(context.tmpDir, 'package.json'), { encoding: 'utf-8' })) as Record<
        string,
        unknown
      >;
      pkg.name = projectName;
      await fse.writeJson(path.join(context.tmpDir, 'package.json'), pkg, { encoding: 'utf-8', spaces: 2 });

      if (gitInit) {
        await initGit(context.tmpDir);
      }
      context.monorepoDirPath = path.join(context.tmpDir, 'packages');
    }
    context.applicationTargetPath = path.join(context.tmpDir, 'packages', templateName);
  }

  await fse.copy(path.join(context.templateDir, templateName), context.applicationTargetPath);

  if (gitInit) {
    await initGit(context.applicationTargetPath);
  }

  renderEJSforTemplate(context.applicationTargetPath, data);

  return {
    applicationTargetPath: context.applicationTargetPath,
    monorepoDirPath: packageManager === PackageManager.pnpmWorkspace ? context.monorepoDirPath : '',
  };
}

export function renderEJSforTemplate(targetDirPath: string, data: Record<string, unknown>) {
  targetDirPath = normalizePath(targetDirPath);

  directoryTraverse(targetDirPath, {
    fileCallback(filePath) {
      const [, resolvePath] = filePath.split(targetDirPath);
      if (resolvePath.endsWith('.ejs')) {
        const content = fse.readFileSync(filePath, 'utf-8');
        const result = ejs.render(content, data);
        // main.js.ejs   app.vue.ejs
        const rawPath = filePath.replace(/\.ejs$/, '');
        fse.writeFileSync(rawPath, result);
        fse.removeSync(filePath);
      }
    },
  });
}
