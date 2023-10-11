#!/usr/bin/env node

import prompts from 'prompts';
import { green, red, bold } from 'kolorist';
import path from 'node:path';
import fse from 'fs-extra';
import minimist from 'minimist';
import { IRoutePattern } from './shared/types';
import { initGit, isDir, simpleDetectMonorepoRoot, createSubApp } from './shared/utils';
import { mainFrameworkList, subFrameworkList, enumToArray } from './shared/template';
import { renderEJSforTemplate } from './shared/render';

enum CreateKind {
  CreateMainApp = '1',
  CreateSubApp = '2',
  CreateMainAndSubApp = '3'
}

interface PromptAnswer {
  projectName: string;
  createKind: CreateKind;
  mainAppName?: string;
  subAppName?: string;
  mainRoute?: IRoutePattern;
}

export interface RenderOptions {
  projectRoot: string;
  inMonorepo: boolean;
  userChoose: PromptAnswer;
}
const [projectName, createKind, mainAppName, subAppName, mainRoute] = minimist(process.argv.slice(2))._

const KindLabelMap: { [key in CreateKind]: string } = {
  [CreateKind.CreateMainApp]: 'Just create main application',
  [CreateKind.CreateSubApp]:  'Create one or more sub applications',
  [CreateKind.CreateMainAndSubApp]: 'Create main application and sub applications',
}

createQiankunDefaultProject().catch((e) => {
  console.error(e);
});

export async function createQiankunDefaultProject() {
  console.log();
  console.log(green('Welcome to use create-qiankun-starter!'));

  console.log();

  let result: PromptAnswer;

  try {
    const list: any[] = []
    !projectName && list.push({
      name: 'projectName',
      type: 'text',
      message: 'Project name:',
    })
    !createKind && list.push({
      name: 'createKind',
      type: 'select',
      message: 'Choose a way to create',
      choices: Object.keys(KindLabelMap).map((key) => ({ title: KindLabelMap[key as CreateKind], value: key })),
    })
    !mainAppName && list.push({
      name: 'mainAppName',
      type: (prev: string , values: PromptAnswer) => {
        return [CreateKind.CreateMainApp, CreateKind.CreateMainAndSubApp].includes(values.createKind) ? 'select' : null;
      },
      message: 'Choose a framework for your main application',
      choices: mainFrameworkList,
    },)
    !subAppName && list.push({
      name: 'subAppName',
      type: (prev: string , values: PromptAnswer) => {
        return [CreateKind.CreateSubApp, CreateKind.CreateMainAndSubApp].includes(values.createKind) ? 'multiselect' : null;
      },
      message: 'Choose a framework for your sub application',
      choices: subFrameworkList,
    })
    !mainRoute && list.push({
      name: 'mainRoute',
      type: (prev: string , values: PromptAnswer) => {
        return [CreateKind.CreateMainApp, CreateKind.CreateMainAndSubApp].includes(values.createKind) ? 'select' : null;
      },
      message: 'Choose a route pattern for your main application',
      choices: enumToArray(IRoutePattern),
    })

    result = (await prompts(list)) as PromptAnswer;
  } catch (e) {
    console.log(red('operation cancelled'));
    process.exit(1);
  }

  console.log();

  const root = process.cwd();

  const userChoose: PromptAnswer = {
    projectName: projectName || result.projectName,
    createKind: createKind as CreateKind || result.createKind,
    mainAppName: mainAppName || result.mainAppName,
    subAppName: subAppName || result.subAppName,
    mainRoute: mainRoute as IRoutePattern || result.mainRoute,
  }

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

  console.log(green(`${projectName} created success!`));
  console.log(bold(green(`\n Done.`)));
}

async function createMainApplication(opts: RenderOptions) {
  const { projectRoot, userChoose } = opts;

  const { mainAppName, mainRoute } = userChoose;

  const templateDir = path.join(__dirname, '../template');

  let tmpTemplateDir = path.join(projectRoot);

  if (userChoose.createKind === CreateKind.CreateMainAndSubApp) {
    // 先构建monorepo
    await fse.copy(path.join(templateDir, 'base'), tmpTemplateDir);

    await initGit(tmpTemplateDir);
    tmpTemplateDir = path.join(tmpTemplateDir, 'packages');
  }

  const mainFrameworkFinalPath = path.join(tmpTemplateDir, mainAppName!);
  await fse.copy(path.join(templateDir, mainAppName!), mainFrameworkFinalPath);

  renderEJSforTemplate(mainFrameworkFinalPath, { mainRoute: mainRoute! });
}

async function renderTemplate(opts: RenderOptions) {
  const { projectRoot } = opts
  const { createKind } = opts.userChoose
  const inMonorepo = createKind === CreateKind.CreateMainAndSubApp
  const appTargetDir = path.join(projectRoot, 'packages');

  if ([CreateKind.CreateMainApp, CreateKind.CreateMainAndSubApp].includes(createKind)) {
    await createMainApplication(opts);
  }
  if (inMonorepo) {
    await createSubApp({ ...opts, appTargetDir  })
  }
}