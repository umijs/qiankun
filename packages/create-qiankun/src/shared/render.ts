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
  hooks?: {
    beforeRender?: (context: IRenderContext, data: Record<string, unknown>) => Promise<void>;
    afterRender?: (context: IRenderContext, data: Record<string, unknown>) => Promise<void>;
  };
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
): Promise<{ applicationTargetPath: string; monorepoDirPath: string }> {
  try {
    const { projectRoot, userChoose, gitInit = false } = opts;
    const { monorepoDirPath } = opts;
    const { packageManager, projectName } = userChoose;

    if (!templateName || typeof templateName !== 'string') {
      throw new Error('Template name is required');
    }

    if (!projectName || typeof projectName !== 'string') {
      throw new Error('Project name is required');
    }

    const context: IRenderContext = {
      templateDir: path.join(__dirname, '../../template'),
      tmpDir: projectRoot,
      applicationTargetPath: path.join(projectRoot, templateName),
      monorepoDirPath: opts.monorepoDirPath,
    };

    // 验证模板目录是否存在
    const templateSourceDir = path.join(context.templateDir, templateName);
    if (!(await fse.pathExists(templateSourceDir))) {
      throw new Error(`Template directory not found: ${templateSourceDir}`);
    }

    if (packageManager === PackageManager.pnpmWorkspace) {
      if (monorepoDirPath) {
        context.applicationTargetPath = monorepoDirPath;
      } else {
        // 先构建monorepo
        const baseTemplatePath = path.join(context.templateDir, 'base');
        if (!(await fse.pathExists(baseTemplatePath))) {
          throw new Error(`Base template directory not found: ${baseTemplatePath}`);
        }

        await fse.copy(baseTemplatePath, context.tmpDir);

        const packageJsonPath = path.join(context.tmpDir, 'package.json');
        const pkg = (await fse.readJson(packageJsonPath)) as Record<string, unknown>;
        pkg.name = projectName;
        await fse.writeJson(packageJsonPath, pkg, { spaces: 2 });

        if (gitInit) {
          await initGit(context.tmpDir);
        }

        context.monorepoDirPath = path.join(context.tmpDir, 'packages');
        await fse.ensureDir(context.monorepoDirPath);
      }
      context.applicationTargetPath = path.join(context.tmpDir, 'packages', templateName);
    }

    // 确保目标目录存在
    await fse.ensureDir(path.dirname(context.applicationTargetPath));

    // 复制模板文件
    await fse.copy(templateSourceDir, context.applicationTargetPath);

    if (gitInit && packageManager !== PackageManager.pnpmWorkspace) {
      await initGit(context.applicationTargetPath);
    }

    // 执行渲染前的钩子
    if (opts.hooks?.beforeRender) {
      await opts.hooks.beforeRender(context, data);
    }

    // 渲染EJS模板
    await renderEJSforTemplate(context.applicationTargetPath, data);

    // 执行渲染后的钩子
    if (opts.hooks?.afterRender) {
      await opts.hooks.afterRender(context, data);
    }

    return {
      applicationTargetPath: context.applicationTargetPath,
      monorepoDirPath: packageManager === PackageManager.pnpmWorkspace ? context.monorepoDirPath || '' : '',
    };
  } catch (error) {
    throw new Error(
      `Failed to create application from template ${templateName}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function renderEJSforTemplate(targetDirPath: string, data: Record<string, unknown>): Promise<void> {
  try {
    if (!targetDirPath || typeof targetDirPath !== 'string') {
      throw new Error('Target directory path is required');
    }

    if (!(await fse.pathExists(targetDirPath))) {
      throw new Error(`Target directory does not exist: ${targetDirPath}`);
    }

    const normalizedTargetPath = normalizePath(targetDirPath);
    const ejsFiles: string[] = [];

    // 收集所有EJS文件
    directoryTraverse(normalizedTargetPath, {
      fileCallback(filePath) {
        if (filePath.endsWith('.ejs')) {
          ejsFiles.push(filePath);
        }
      },
    });

    // 处理每个EJS文件
    for (const ejsFilePath of ejsFiles) {
      try {
        const content = await fse.readFile(ejsFilePath, 'utf-8');
        const result = ejs.render(content, data);

        // 生成目标文件路径（移除.ejs扩展名）
        const targetFilePath = ejsFilePath.replace(/\.ejs$/, '');

        // 写入渲染后的内容
        await fse.writeFile(targetFilePath, result, 'utf-8');

        // 删除原EJS文件
        await fse.remove(ejsFilePath);

        console.log(`Rendered template: ${path.relative(normalizedTargetPath, targetFilePath)}`);
      } catch (error) {
        throw new Error(
          `Failed to render EJS template ${ejsFilePath}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    if (ejsFiles.length > 0) {
      console.log(`Successfully rendered ${ejsFiles.length} template file(s)`);
    }
  } catch (error) {
    throw new Error(`Failed to render EJS templates: ${error instanceof Error ? error.message : String(error)}`);
  }
}
