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
import { composeGeneratePorts, generatePort, injectCheckPortScript } from './shared/utils/port';
import { injectSubsConfigToMainApp } from './shared/utils/qiankun';
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
});

export async function createQiankunDefaultProject() {
  console.log();
  console.log(green('Welcome to use create-qiankun-starter!'));

  console.log();

  const [projectName, createKind, mainAppName, subAppNameList, mainRoute, packageManager] = minimist(
    process.argv.slice(2),
  )._;

  let result: PromptAnswer;

  const inputCreateKind = createKind && (String(createKind) as CreateKind);
  try {
    result = (await prompts(
      [
        {
          name: 'projectName',
          type: projectName ? null : 'text',
          message: 'Project name:',
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
            : (prev: string, values: PromptAnswer) => {
                return [CreateKind.CreateMainApp, CreateKind.CreateMainAndSubApp].includes(
                  inputCreateKind || values.createKind,
                )
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
            : (prev: string, values: PromptAnswer) => {
                return [CreateKind.CreateMainApp, CreateKind.CreateMainAndSubApp].includes(
                  inputCreateKind || values.createKind,
                )
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
            : (prev: string, values: PromptAnswer) => {
                const createKind = inputCreateKind || values.createKind;
                if (createKind === CreateKind.CreateMainAndSubApp) {
                  return 'multiselect';
                }
                if (createKind === CreateKind.CreateSubApp) {
                  return 'multiselect';
                }
                return null;
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

  const userChoose: PromptAnswer = {
    projectName: projectName || result.projectName,
    createKind: createKind ? (String(createKind) as CreateKind) : result.createKind,
    mainAppName: (mainAppName as MainFrameworkTemplate) || result.mainAppName,
    subAppNameList: subAppNameList ? ([subAppNameList] as SubFrameworkTemplate[]) : result.subAppNameList,
    mainRoute: (mainRoute as IRoutePattern) || result.mainRoute,
    packageManager: (packageManager as PackageManager) || result.packageManager,
  };

  const targetDir = path.join(root, userChoose.projectName);

  if (isDir(targetDir)) {
    console.log(red(`${targetDir} already exists`));
    process.exit(1);
  }

  // detach Monorepo
  // const monorepoRoot = simpleDetectMonorepoRoot(targetDir);
  // const inMonorepo = !!monorepoRoot;
  // const projectRoot = inMonorepo ? monorepoRoot : targetDir;
  const projectRoot = targetDir;
  console.log(green(`\n Project will be created at: ${projectRoot}`));
  console.log();
  console.log(green(`\n Creating project...`));

  // render
  await renderTemplate({
    projectRoot,
    userChoose,
  });

  // console.log();
  // console.log(green(`\n Created ${userChoose.projectName}  success!`));
  console.log();
  console.log(bold(green(`\n Done.`)));
}

async function renderTemplate(opts: RenderOptions) {
  const { createKind, mainAppName, mainRoute, subAppNameList, packageManager } = opts.userChoose;

  let mainAppTargetPath = '',
    monorepoRootPath: string | undefined;
  const mainAppPort = generatePort();

  // create main application
  if ([CreateKind.CreateMainApp, CreateKind.CreateMainAndSubApp].includes(createKind)) {
    const mainAppInfo = await createApplication(
      mainAppName!,
      { port: mainAppPort, mainRoute },
      { ...opts, gitInit: true },
    );
    mainAppTargetPath = mainAppInfo.applicationTargetPath;
    monorepoRootPath = mainAppInfo.monorepoDirPath;
  }

  // create sub applications
  if ([CreateKind.CreateSubApp, CreateKind.CreateMainAndSubApp].includes(createKind)) {
    const subsPorts = composeGeneratePorts(
      subAppNameList!.map(() => generatePort),
      mainAppPort ? [mainAppPort] : [],
    );

    await Promise.all(
      subAppNameList!.map((sub, i) =>
        createApplication(
          sub,
          { port: subsPorts[i], appName: sub },
          {
            ...opts,
            gitInit: createKind === CreateKind.CreateSubApp || packageManager !== PackageManager.pnpmWorkspace,
            monorepoDirPath: monorepoRootPath,
            hooks: {
              async beforeRender(context, data) {
                await injectCheckPortScript(context.applicationTargetPath, data);
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
        subAppNameList!.map((sub, i) => ({ subName: sub, port: subsPorts[i] })),
      );
    }
  }
}
