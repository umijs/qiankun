#!/usr/bin/env node

import prompts from 'prompts';
import { green, red, bold } from 'kolorist';
import path from 'node:path';
import fse from 'fs-extra';
import { IRoutePattern } from './shared/types';
import { initGit, isDir, simpleDetectMonorepoRoot } from './shared/utils';
import { mainFrameworkList, subFrameworkList, enumToArray } from './shared/template';
import { renderEJSforTemplate } from './shared/render';
interface PromptAnswer {
  projectName: string;
  createKind: '1' | '2' | '3';
  mainFramework?: string;
  subFramework?: string;
  mainRoute?: IRoutePattern;
}

interface RenderOptions {
  projectRoot: string;
  inMonorepo: boolean;
  userChoose: PromptAnswer;
}

enum CreateProjectKind {
  'Just create main application' = '1',
  'Create one or more sub applications' = '2',
  'Create main application and sub applications' = '3',
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
    result = (await prompts([
      {
        name: 'projectName',
        type: 'text',
        message: 'Project name:',
      },
      {
        name: 'createKind',
        type: 'select',
        message: 'Choose a way to create',
        choices: enumToArray(CreateProjectKind),
      },
      {
        name: 'mainFramework',
        type: (prev, values) => {
          return ['1', '3'].includes(values.createKind as string) ? 'select' : null;
        },
        message: 'Choose a framework for your main application',
        choices: mainFrameworkList,
      },
      {
        name: 'subFramework',
        type: (prev, values) => {
          return ['2', '3'].includes(values.createKind as string) ? 'multiselect' : null;
        },
        message: 'Choose a framework for your sub application',
        choices: subFrameworkList,
      },
      {
        name: 'mainRoute',
        type: (prev, values) => {
          return ['1', '3'].includes(values.createKind as string) ? 'select' : null;
        },
        message: 'Choose a route pattern for your main application',
        choices: enumToArray(IRoutePattern),
      },
    ])) as PromptAnswer;
  } catch (e) {
    console.log(red('operation cancelled'));
    process.exit(1);
  }

  console.log();

  const root = process.cwd();

  const { projectName } = result;

  const targetDir = path.join(root, projectName);

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
    userChoose: result,
  });

  console.log(green(`${projectName} created success!`));
  console.log(bold(green(`\n Done.`)));
}

async function createMainApplication(opts: RenderOptions) {
  const { projectRoot, userChoose } = opts;

  const { mainFramework } = userChoose;

  const templateDir = path.join(__dirname, '../template');

  let tmpTemplateDir = path.join(projectRoot);

  if (userChoose.createKind === '3') {
    // 先构建monorepo
    await fse.copy(path.join(templateDir, 'base'), tmpTemplateDir);

    await initGit(tmpTemplateDir);
    tmpTemplateDir = path.join(tmpTemplateDir, 'packages');
  }

  const mainFrameworkFinalPath = path.join(tmpTemplateDir, mainFramework!);
  await fse.copy(path.join(templateDir, mainFramework!), mainFrameworkFinalPath);

  renderEJSforTemplate(mainFrameworkFinalPath, { mainRoute: userChoose.mainRoute! });
}

async function renderTemplate(opts: RenderOptions) {
  if (['1', '3'].includes(opts.userChoose.createKind)) {
    await createMainApplication(opts);
  }

  //  create sub
  // const subFrameworkFinalPath = path.join(tmpTemplateDir, subFramework);
  // await fse.copy(path.join(templateDir, subFramework), subFrameworkFinalPath);
}
