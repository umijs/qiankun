#!/usr/bin/env node

import prompts from 'prompts';
import { green, red, yellow, bold } from 'kolorist';
import path from 'node:path';
import fse from 'fs-extra';
import minimist from 'minimist';
import { IRoutePattern } from './shared/types';
import { initGit, isDir, simpleDetectMonorepoRoot, createSubAppInMono, createSubApp } from './shared/utils';

import { mainFrameworkList, subFrameworkList, enumToArray } from './shared/template';
import { renderEJSforTemplate } from './shared/render';
import { generatePort } from './shared/utils/port';
import { injectSubsConfigToMainApp } from './shared/utils/qiankun';

enum CreateKind {
  CreateMainApp = '1',
  CreateSubApp = '2',
  CreateMainAndSubApp = '3',
}

interface PromptAnswer {
  projectName: string;
  createKind: CreateKind;
  mainAppName?: string;
  subAppName?: string | string[];
  mainRoute?: IRoutePattern;
}

export interface RenderOptions {
  projectRoot: string;
  inMonorepo: boolean;
  userChoose: PromptAnswer;
}
const [projectName, createKind, mainAppName, subAppName, mainRoute] = minimist(process.argv.slice(2))._;

const KindLabelMap: { [key in CreateKind]: string } = {
  [CreateKind.CreateMainApp]: 'Just create main application',
  [CreateKind.CreateSubApp]: 'Just create sub applications',
  [CreateKind.CreateMainAndSubApp]: 'Create main application and sub applications',
};

createQiankunDefaultProject().catch((e) => {
  console.error(e);
});

export async function createQiankunDefaultProject() {
  console.log();
  console.log(green('Welcome to use create-qiankun-starter!'));

  console.log();

  let result: PromptAnswer;

  const inputCreateKind = createKind && (String(createKind) as CreateKind);
  try {
    const list: unknown[] = [];
    !projectName &&
      list.push({
        name: 'projectName',
        type: 'text',
        message: 'Project name:',
      });
    !createKind &&
      list.push({
        name: 'createKind',
        type: 'select',
        message: 'Choose a way to create',
        choices: Object.keys(KindLabelMap).map((key) => ({ title: KindLabelMap[key as CreateKind], value: key })),
      });
    !mainAppName &&
      list.push({
        name: 'mainAppName',
        type: (prev: string, values: PromptAnswer) => {
          return [CreateKind.CreateMainApp, CreateKind.CreateMainAndSubApp].includes(
            inputCreateKind || values.createKind,
          )
            ? 'select'
            : null;
        },
        message: 'Choose a framework for your main application',
        choices: mainFrameworkList,
      });
    !subAppName &&
      list.push({
        name: 'subAppName',
        type: (prev: string, values: PromptAnswer) => {
          const createKind = inputCreateKind || values.createKind;
          let type = null;
          if (createKind === CreateKind.CreateMainAndSubApp) {
            type = 'multiselect';
          } else if (createKind === CreateKind.CreateSubApp) {
            type = 'select';
          }
          return type;
        },
        message: 'Choose a framework for your sub application',
        choices: subFrameworkList,
      });
    !mainRoute &&
      list.push({
        name: 'mainRoute',
        type: (prev: string, values: PromptAnswer) => {
          return [CreateKind.CreateMainApp, CreateKind.CreateMainAndSubApp].includes(
            inputCreateKind || values.createKind,
          )
            ? 'select'
            : null;
        },
        message: 'Choose a route pattern for your main application',
        choices: enumToArray(IRoutePattern),
      });

    result = (await prompts(list)) as PromptAnswer;
  } catch (e) {
    console.log(red('operation cancelled'));
    process.exit(1);
  }

  console.log();

  const root = process.cwd();

  const userChoose: PromptAnswer = {
    projectName: projectName || result.projectName,
    createKind: createKind ? (String(createKind) as CreateKind) : result.createKind,
    mainAppName: mainAppName || result.mainAppName,
    subAppName: subAppName ? [subAppName] : result.subAppName,
    mainRoute: (mainRoute as IRoutePattern) || result.mainRoute,
  };

  const targetDir = path.join(root, userChoose.projectName);

  if (isDir(targetDir)) {
    console.log(red(`${targetDir} already exists`));
    process.exit(1);
  }

  // detach Monorepo
  const monorepoRoot = simpleDetectMonorepoRoot(targetDir);
  const inMonorepo = !!monorepoRoot;
  const projectRoot = inMonorepo ? monorepoRoot : targetDir;

  // detach Pnpm todo

  // render
  await renderTemplate({
    projectRoot,
    inMonorepo,
    userChoose,
  });

  console.log(green(`${userChoose.projectName} created success!`));
  console.log(bold(green(`\n Done.`)));
}

async function createMainApplication(opts: RenderOptions) {
  const { projectRoot, userChoose } = opts;
  const { mainAppName, mainRoute } = userChoose;

  const templateDir = path.join(__dirname, '../template');

  const tmpTemplateDir = path.join(projectRoot);
  let mainAppTargetPath = tmpTemplateDir;

  if (userChoose.createKind === CreateKind.CreateMainAndSubApp) {
    // 先构建monorepo
    await fse.copy(path.join(templateDir, 'base'), tmpTemplateDir);
    await initGit(tmpTemplateDir);

    mainAppTargetPath = path.join(tmpTemplateDir, 'packages', mainAppName!);
  }

  await fse.copy(path.join(templateDir, mainAppName!), mainAppTargetPath);
  await initGit(tmpTemplateDir);

  const port = generatePort();

  renderEJSforTemplate(mainAppTargetPath, { mainRoute: mainRoute!, port });

  return mainAppTargetPath;
}

async function renderTemplate(opts: RenderOptions) {
  const { createKind } = opts.userChoose;

  let mainAppTargetPath = '';
  if ([CreateKind.CreateMainApp, CreateKind.CreateMainAndSubApp].includes(createKind)) {
    mainAppTargetPath = await createMainApplication(opts);
  }

  if ([CreateKind.CreateSubApp, CreateKind.CreateMainAndSubApp].includes(createKind)) {
    console.log();
    console.log(yellow('create sub app start'));
    console.log();
    if (createKind === CreateKind.CreateSubApp) {
      await createSubApp(opts);
    } else if (createKind === CreateKind.CreateMainAndSubApp) {
      const subsInfo = await createSubAppInMono(opts);
      await injectSubsConfigToMainApp(mainAppTargetPath, subsInfo);
    }
    console.log();
    console.log(yellow('create sub app end'));
    console.log();
  }
}
