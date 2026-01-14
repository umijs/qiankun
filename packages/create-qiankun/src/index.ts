#!/usr/bin/env node

import prompts from 'prompts';
import { green, red, bold } from 'kolorist';
import path from 'node:path';
import minimist from 'minimist';
import { isDirectory, detectWorkspaceRoot } from './shared/utils';
import { templateOptions, ViteTemplate } from './shared/types';
import type { PromptAnswers } from './shared/types';
import { generateViteApp } from './shared/generators/createVite';
import { patchViteSubApp } from './shared/patchers';

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

async function main() {
  console.log();
  console.log(green('Welcome to create-qiankun!'));
  console.log();

  const argv = minimist(process.argv.slice(2));
  const argAppName = argv._[0];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const argTemplate = argv.template || argv.t;

  let answers: PromptAnswers;

  try {
    answers = (await prompts(
      [
        {
          name: 'appName',
          type: argAppName ? null : 'text',
          message: 'Sub-app name:',
          initial: 'qiankun-sub-app',
          validate: (value: string) => {
            if (!value.trim()) return 'App name is required';
            if (!/^[a-z0-9-]+$/.test(value)) return 'App name can only contain lowercase letters, numbers, and hyphens';
            return true;
          },
        },
        {
          name: 'template',
          type: argTemplate ? null : 'select',
          message: 'Select a framework:',
          choices: templateOptions,
        },
      ],
      {
        onCancel: () => {
          throw new Error('Operation cancelled');
        },
      },
    )) as PromptAnswers;
  } catch {
    console.log(red('Operation cancelled'));
    process.exit(1);
  }

  const appName = argAppName || answers.appName;
  const template = (argTemplate || answers.template) as ViteTemplate;

  const validTemplates = Object.values(ViteTemplate);
  if (!validTemplates.includes(template)) {
    console.log(red(`Invalid template: ${String(template)}. Valid options: ${validTemplates.join(', ')}`));
    process.exit(1);
  }

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
