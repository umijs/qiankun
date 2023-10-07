#!/usr/bin/env node

import prompts from 'prompts';
import { green, red } from 'kolorist';
import path from 'node:path';
import fse from 'fs-extra';
import { IRoutePattern } from './shared/types';
import { directoryTraverse, initGit, isDir, simpleDetectMonorepoRoot } from './shared/utils';
import { mainFrameworkList, subFrameworkList, enumToArray } from './shared/template';

interface PromptAnswer {
  projectName: string;
  mainFramework: string;
  subFramework: string;
  mainRoute: IRoutePattern;
}

interface RenderOptions {
  projectRoot: string;
  inMonorepo: boolean;
  userChoose: PromptAnswer;
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
        name: 'mainFramework',
        type: 'select',
        message: 'Choose a framework for your main application',
        choices: mainFrameworkList,
      },
      {
        name: 'subFramework',
        type: 'select',
        message: 'Choose a framework for your sub application',
        choices: subFrameworkList,
      },
      {
        name: 'mainRoute',
        type: 'select',
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
}

async function renderTemplate(opts: RenderOptions) {
  const { projectRoot, inMonorepo, userChoose } = opts;

  const { mainFramework, subFramework } = userChoose;

  const templateDir = path.join(__dirname, '../template');

  let tmpTemplateDir = path.join(projectRoot);

  if (inMonorepo) {
    // todo
  } else {
    // 先构建monorepo
    await fse.copy(path.join(templateDir, 'base'), tmpTemplateDir);
    tmpTemplateDir = path.join(tmpTemplateDir, 'packages');
    await initGit(templateDir);
  }

  const mainFrameworkFinalPath = path.join(tmpTemplateDir, mainFramework);
  await fse.copy(path.join(templateDir, mainFramework), mainFrameworkFinalPath);

  const subFrameworkFinalPath = path.join(tmpTemplateDir, subFramework);
  await fse.copy(path.join(templateDir, subFramework), subFrameworkFinalPath);

  await renderTemplateEffect(mainFrameworkFinalPath, userChoose);
}

async function renderTemplateEffect(target: string, userChoose: PromptAnswer) {
  directoryTraverse(target, {
    fileCallback(filePath) {
      console.log(filePath, 'filePath');
    },
  });
}
