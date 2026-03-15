#!/usr/bin/env node

import prompts from 'prompts';
import { green, red, bold } from 'kolorist';
import path from 'node:path';
import minimist from 'minimist';
import { isDirectory, detectWorkspaceRoot } from './shared/utils';
import { templateOptions, ViteTemplate, AppType, appTypeOptions } from './shared/types';
import type { PromptAnswers } from './shared/types';
import { generateViteApp } from './shared/generators/createVite';
import { patchViteSubApp } from './shared/patchers';

interface CliArgs {
  _: string[];
  template?: string;
  t?: string;
  type?: string;
  T?: string;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

async function main() {
  console.log();
  console.log(green('Welcome to create-qiankun!'));
  console.log();

  const argv = minimist(process.argv.slice(2)) as CliArgs;
  const argAppName = argv._[0];
  const argTemplate = argv.template || argv.t;
  const argType = argv.type || argv.T;
  const parsedArgType = argType === AppType.Main || argType === AppType.Sub ? argType : undefined;
  const resolvedArgAppType = parsedArgType === AppType.Main ? AppType.Main : AppType.Sub;

  let answers: Partial<PromptAnswers>;

  try {
    answers = (await prompts(
      [
        {
          name: 'appType',
          type: argType ? null : 'select',
          message: 'Select app type:',
          choices: appTypeOptions,
        },
        {
          name: 'appName',
          type: argAppName ? null : 'text',
          message: (_prev: unknown, values: Partial<PromptAnswers>) =>
            (values.appType || resolvedArgAppType) === AppType.Main ? 'Main app name:' : 'Sub-app name:',
          initial: (_prev: unknown, values: Partial<PromptAnswers>) =>
            (values.appType || resolvedArgAppType) === AppType.Main ? 'qiankun-main-app' : 'qiankun-sub-app',
          validate: (value: string) => {
            if (!value.trim()) return 'App name is required';
            if (!/^[a-z0-9-]+$/.test(value)) return 'App name can only contain lowercase letters, numbers, and hyphens';
            return true;
          },
        },
        {
          name: 'template',
          type: (_prev: unknown, values: Partial<PromptAnswers>) =>
            argTemplate || (values.appType || resolvedArgAppType) === AppType.Main ? null : 'select',
          message: 'Select a framework:',
          choices: templateOptions,
        },
      ],
      {
        onCancel: () => {
          throw new Error('Operation cancelled');
        },
      },
    )) as Partial<PromptAnswers>;
  } catch {
    console.log(red('Operation cancelled'));
    process.exit(1);
  }

  const appType = parsedArgType || answers.appType || AppType.Sub;
  const appName = argAppName || answers.appName || (appType === AppType.Main ? 'qiankun-main-app' : 'qiankun-sub-app');
  const template = (argTemplate || answers.template) as ViteTemplate;

  const cwd = process.cwd();
  const workspaceRoot = detectWorkspaceRoot(cwd);
  const isInWorkspace = !!workspaceRoot;

  let targetDir: string;
  if (isInWorkspace) {
    const packagesDir = path.join(workspaceRoot, 'packages');
    targetDir = packagesDir;
  } else {
    targetDir = cwd;
  }

  const appPath = path.join(targetDir, appName);

  if (isDirectory(appPath)) {
    console.log(red(`Directory ${appPath} already exists`));
    process.exit(1);
  }

  console.log();
  console.log(green(`Creating ${appName} at ${appPath}...`));
  console.log();

  if (appType === AppType.Main) {
    const mainTemplate = ViteTemplate.ReactTs;

    await generateViteApp(targetDir, appName, mainTemplate);

    console.log();
    console.log(green('Patching for qiankun main app...'));

    console.log();
    console.log(bold(green('Done!')));
    console.log();
    console.log('Next steps:');
    console.log(`  cd ${isInWorkspace ? `packages/${appName}` : appName}`);
    console.log('  pnpm install');
    console.log('  pnpm dev');
    console.log();
  } else {
    const validTemplates = Object.values(ViteTemplate);
    if (!validTemplates.includes(template)) {
      console.log(red(`Invalid template: ${String(template)}. Valid options: ${validTemplates.join(', ')}`));
      process.exit(1);
    }

    await generateViteApp(targetDir, appName, template);

    console.log();
    console.log(green('Patching for qiankun...'));

    await patchViteSubApp(appPath, appName, template);

    console.log();
    console.log(bold(green('Done!')));
    console.log();
    console.log('Next steps:');
    console.log(`  cd ${isInWorkspace ? `packages/${appName}` : appName}`);
    console.log('  pnpm install');
    console.log('  pnpm dev              # Run standalone');
    console.log('  pnpm build:qiankun    # Build for qiankun');
    console.log();
  }
}
