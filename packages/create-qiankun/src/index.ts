#!/usr/bin/env node

import prompts from 'prompts';
import { green, red, bold } from 'kolorist';
import path from 'node:path';
import minimist from 'minimist';
import type { PromptAnswer } from './shared/types';
import { CreateKind, IRoutePattern, PackageManager } from './shared/types';
import { isDir } from './shared/utils';

import type { MainFrameworkTemplate, SubFrameworkTemplate } from './shared/template';
import { mainFrameworkList, subFrameworkList, enumToArray } from './shared/template';
import { type RenderOptions, createApplication } from './shared/render';
import { composeGeneratePorts, generatePort, injectCheckPortScript, injectPreNpmScript } from './shared/utils/port';
import { injectSubsConfigToMainApp, installQiankunPkgs } from './shared/utils/qiankun';
import { injectNormalScripts, injectWorkspaceScripts } from './shared/utils/scripts';

const KindLabelMap: { [key in CreateKind]: string } = {
  [CreateKind.CreateMainApp]: 'Just create main application',
  [CreateKind.CreateSubApp]: 'Just create sub applications',
  [CreateKind.CreateMainAndSubApp]: 'Create main application and sub applications',
};

const packageManagerMap: { [key in PackageManager]: string } = {
  [PackageManager.npm]: 'npm',
  [PackageManager.yarn]: 'yarn',
  [PackageManager.pnpm]: 'pnpm',
  [PackageManager.pnpmWorkspace]: 'pnpm with workspace',
};

createQiankunDefaultProject().catch((e) => {
  console.error(e);
  process.exit(1);
});

export async function createQiankunDefaultProject() {
  console.log();
  console.log(green('Welcome to use create-qiankun-starter!'));
  console.log();

  const argv = minimist(process.argv.slice(2));
  const [projectName, createKind, mainAppName, subAppNameList, mainRoute, packageManager] = argv._;

  let result: PromptAnswer;

  const inputCreateKind = createKind ? (String(createKind) as CreateKind) : undefined;

  try {
    result = (await prompts(
      [
        {
          name: 'projectName',
          type: projectName ? null : 'text',
          message: 'Project name:',
          validate: (value: string) => {
            if (!value || value.trim().length === 0) {
              return 'Project name is required';
            }
            if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
              return 'Project name should only contain letters, numbers, underscores and hyphens';
            }
            return true;
          },
        },
        {
          name: 'createKind',
          type: createKind ? null : 'select',
          message: 'Choose a way to create',
          choices: Object.keys(KindLabelMap).map((key) => ({ title: KindLabelMap[key as CreateKind], value: key })),
        },
        {
          name: 'mainAppName',
          type: mainAppName
            ? null
            : (_prev: string, values: PromptAnswer) => {
                const currentCreateKind = inputCreateKind || values.createKind;
                return [CreateKind.CreateMainApp, CreateKind.CreateMainAndSubApp].includes(currentCreateKind)
                  ? 'select'
                  : null;
              },
          message: 'Choose a framework for your main application',
          choices: mainFrameworkList,
        },
        {
          name: 'mainRoute',
          type: mainRoute
            ? null
            : (_prev: string, values: PromptAnswer) => {
                const currentCreateKind = inputCreateKind || values.createKind;
                return [CreateKind.CreateMainApp, CreateKind.CreateMainAndSubApp].includes(currentCreateKind)
                  ? 'select'
                  : null;
              },
          message: 'Choose a route pattern for your main application',
          choices: enumToArray(IRoutePattern),
        },
        {
          name: 'subAppNameList',
          min: 1,
          type: subAppNameList
            ? null
            : (_prev: string, values: PromptAnswer) => {
                const currentCreateKind = inputCreateKind || values.createKind;
                return [CreateKind.CreateSubApp, CreateKind.CreateMainAndSubApp].includes(currentCreateKind)
                  ? 'multiselect'
                  : null;
              },
          message: 'Choose a framework for your sub application',
          choices: subFrameworkList,
        },
        {
          name: 'packageManager',
          message: 'Which package manager do you want to use?',
          type: packageManager ? null : 'select',
          choices: Object.keys(packageManagerMap).map((key) => ({
            title: packageManagerMap[key as PackageManager],
            value: key,
          })),
        },
      ],
      {
        onCancel: () => {
          throw new Error('Operation cancelled');
        },
      },
    )) as PromptAnswer;
  } catch (e) {
    console.log(red(`Operation cancelled`));
    process.exit(1);
  }

  console.log();

  const root = process.cwd();

  // 构建用户选择，优先使用命令行参数，其次使用交互式输入的结果
  const userChoose: PromptAnswer = {
    projectName: projectName || result.projectName,
    createKind: inputCreateKind || result.createKind,
    mainAppName: (mainAppName as MainFrameworkTemplate) || result.mainAppName,
    subAppNameList: subAppNameList ? [subAppNameList as SubFrameworkTemplate] : result.subAppNameList,
    mainRoute: (mainRoute as IRoutePattern) || result.mainRoute,
    packageManager: (packageManager as PackageManager) || result.packageManager,
  };

  const targetDir = path.join(root, userChoose.projectName);

  if (isDir(targetDir)) {
    console.log(red(`${targetDir} already exists`));
    process.exit(1);
  }

  const projectRoot = targetDir;
  console.log(green(`\n Project will be created at: ${projectRoot}`));
  console.log();
  console.log(green(`\n Creating project...`));

  try {
    // render
    await renderTemplate({
      projectRoot,
      userChoose,
    });

    console.log();
    console.log(bold(green(`\n Done.`)));
  } catch (error) {
    console.error(red('Error creating project:'), error);
    process.exit(1);
  }
}

async function renderTemplate(opts: RenderOptions) {
  const { createKind, mainAppName, mainRoute, subAppNameList, packageManager } = opts.userChoose;

  let mainAppTargetPath = '';
  let monorepoRootPath: string | undefined;
  const mainAppPort = generatePort();

  const _packageManager = packageManager?.includes('pnpm') ? 'pnpm' : packageManager;

  // create main application
  if ([CreateKind.CreateMainApp, CreateKind.CreateMainAndSubApp].includes(createKind) && mainAppName) {
    try {
      const mainAppInfo = await createApplication(
        mainAppName,
        { port: mainAppPort, mainRoute, ...installQiankunPkgs, packageManager: _packageManager },
        {
          ...opts,
          gitInit: true,
          hooks: {
            async beforeRender(context) {
              await injectCheckPortScript(context.applicationTargetPath);
            },
            async afterRender(context) {
              await injectPreNpmScript(context.applicationTargetPath);
            },
          },
        },
      );
      mainAppTargetPath = mainAppInfo.applicationTargetPath;
      monorepoRootPath = mainAppInfo.monorepoDirPath;
    } catch (error) {
      throw new Error(`Failed to create main application: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // create sub applications
  if ([CreateKind.CreateSubApp, CreateKind.CreateMainAndSubApp].includes(createKind) && subAppNameList?.length) {
    const subsPorts = composeGeneratePorts(
      subAppNameList.map(() => generatePort),
      mainAppPort ? [mainAppPort] : [],
    );

    try {
      await Promise.all(
        subAppNameList.map((sub, i) =>
          createApplication(
            sub,
            { port: subsPorts[i], appName: sub, ...installQiankunPkgs, packageManager: _packageManager },
            {
              ...opts,
              gitInit: createKind === CreateKind.CreateSubApp || packageManager !== PackageManager.pnpmWorkspace,
              monorepoDirPath: monorepoRootPath,
              hooks: {
                async beforeRender(context) {
                  await injectCheckPortScript(context.applicationTargetPath);
                },
                async afterRender(context) {
                  await injectPreNpmScript(context.applicationTargetPath);
                },
              },
            },
          ),
        ),
      );

      if (packageManager === PackageManager.pnpmWorkspace && monorepoRootPath) {
        await injectWorkspaceScripts(monorepoRootPath);
      }

      if (createKind === CreateKind.CreateMainAndSubApp) {
        if (packageManager !== PackageManager.pnpmWorkspace) {
          await injectNormalScripts(opts);
        }

        await injectSubsConfigToMainApp(
          mainAppTargetPath,
          subAppNameList.map((sub, i) => ({ subName: sub, port: subsPorts[i] })),
        );
      }
    } catch (error) {
      throw new Error(`Failed to create sub applications: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
