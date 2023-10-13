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
  templateDir: string;
  tmpDir: string;
  applicationTargetPath: string;
  monorepoDirPath?: string;
}

export async function createApplication(
  templateName: MainFrameworkTemplate | SubFrameworkTemplate,
  data: Record<string, unknown>,
  opts: RenderOptions,
) {
  const { projectRoot, userChoose, gitInit = false } = opts;
  const { monorepoDirPath } = opts;
  const { packageManager } = userChoose;

  const context: IRenderContext = {
    templateDir: path.join(__dirname, '../../template'),
    tmpDir: projectRoot,
    applicationTargetPath: path.join(projectRoot, templateName),
    monorepoDirPath: opts.monorepoDirPath,
  };

  if (packageManager === PackageManager.pnpm) {
    if (monorepoDirPath) {
      context.applicationTargetPath = monorepoDirPath;
    } else {
      // 先构建monorepo
      await fse.copy(path.join(context.templateDir, 'base'), context.tmpDir);
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
    monorepoDirPath: packageManager === PackageManager.pnpm ? context.monorepoDirPath : '',
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
