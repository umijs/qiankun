/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import execa from 'execa';
import fse from 'fs-extra';
import path from 'node:path';
import os from 'node:os';

const CLI_PATH = path.resolve(__dirname, '../dist/index.js');
const FIXTURES_PATH = path.resolve(__dirname, 'fixtures');
const E2E_TIMEOUT = process.env.E2E_TIMEOUT ? parseInt(process.env.E2E_TIMEOUT, 10) : 180000;
const EXPECTED_QIANKUN_VERSION = 'rc';

const APP_NAME_PLACEHOLDER = '{{APP_NAME}}';

async function runCli(cwd: string, appName: string, template: string): Promise<void> {
  await execa('node', [CLI_PATH, appName, '--template', template], {
    cwd,
    stdio: 'inherit',
  });
}

async function runCliMain(cwd: string, appName: string): Promise<void> {
  await execa('node', [CLI_PATH, appName, '--type', 'main'], {
    cwd,
    stdio: 'inherit',
  });
}

async function runCliRaw(cwd: string, args: string[]): Promise<{ exitCode: number; output: string }> {
  const result = await execa('node', [CLI_PATH, ...args], {
    cwd,
    stdio: 'pipe',
    reject: false,
  });

  return {
    exitCode: result.exitCode,
    output: `${result.stdout}\n${result.stderr}`,
  };
}

async function installAndBuild(appPath: string): Promise<void> {
  await execa('pnpm', ['install'], { cwd: appPath, stdio: 'inherit' });
  await execa('pnpm', ['build:qiankun'], { cwd: appPath, stdio: 'inherit' });
}

async function installAndBuildMain(appPath: string): Promise<void> {
  await execa('pnpm', ['install'], { cwd: appPath, stdio: 'inherit' });
  await execa('pnpm', ['build'], { cwd: appPath, stdio: 'inherit' });
}

function normalizeContent(content: string, appName: string): string {
  return content.replace(new RegExp(appName, 'g'), APP_NAME_PLACEHOLDER);
}

async function loadFixture(template: string, fileName: string): Promise<string> {
  const fixturePath = path.join(FIXTURES_PATH, template, fileName);
  return fse.readFile(fixturePath, 'utf-8');
}

async function assertFileMatchesFixture(
  actualPath: string,
  template: string,
  fixtureFileName: string,
  appName: string,
): Promise<void> {
  const actualContent = await fse.readFile(actualPath, 'utf-8');
  const expectedContent = await loadFixture(template, fixtureFileName);
  const normalizedActual = normalizeContent(actualContent, appName);

  expect(normalizedActual).toBe(expectedContent);
}

function assertQiankunHtml(html: string): void {
  expect(html).not.toMatch(/<script[^>]*type=["']?module["']?[^>]*>/);
  expect(html).not.toMatch(/System\.import/);
  expect(html).toMatch(/<script[^>]*src=["'][^"']+["'][^>]*><\/script>/);
  expect(html).toMatch(/<script[^>]*\sentry(?:\s|>)/);
  expect(html).toMatch(/<link[^>]*rel=["']?stylesheet["']?[^>]*>/);
}

async function assertGeneratedViteConfig(appPath: string, appName: string): Promise<void> {
  const viteConfig = await fse.readFile(path.join(appPath, 'vite.config.ts'), 'utf-8');

  expect(viteConfig).toContain("const qiankunDevHtmlPath = '/__qiankun_dev__.html';");
  expect(viteConfig).toContain("const qiankunDevModulePath = '/__qiankun_dev_module__';");
  expect(viteConfig).toContain('function transformViteDevModule(code, moduleId)');
  expect(viteConfig).toContain(`globalThis[${JSON.stringify(appName)}] = {`);
  expect(viteConfig).toContain('plugins: [');
  expect(viteConfig).toContain('qiankunDevEntryPlugin()');
  expect(viteConfig).toContain('isQiankun && qiankunEntryHtmlPlugin()');
  expect(viteConfig).toContain('cssCodeSplit: false');
}

describe('create-qiankun CLI e2e', () => {
  const testDir = path.join(os.tmpdir(), `create-qiankun-e2e-${Date.now()}`);

  beforeAll(async () => {
    await fse.ensureDir(testDir);
  });

  afterAll(async () => {
    await fse.remove(testDir);
  });

  describe('CLI argument validation', () => {
    it('should reject invalid --type values', async () => {
      const appName = 'invalid-type-sub-app';
      const result = await runCliRaw(testDir, [appName, '--type', 'mian']);

      expect(result.exitCode).toBe(1);
      expect(result.output).toContain('Invalid type: mian');
      expect(await fse.pathExists(path.join(testDir, appName))).toBe(false);
    });

    it('should reject --template when --type main is provided', async () => {
      const appName = 'main-app-with-template';
      const result = await runCliRaw(testDir, [appName, '--type', 'main', '--template', 'vue-ts']);

      expect(result.exitCode).toBe(1);
      expect(result.output).toContain('The --template option is only supported for sub apps');
      expect(await fse.pathExists(path.join(testDir, appName))).toBe(false);
    });
  });

  describe('React + TypeScript template', () => {
    const appName = 'react-ts-sub';
    const appPath = path.join(testDir, appName);
    const template = 'react-ts';

    it(
      'should scaffold, patch, and build successfully',
      async () => {
        await runCli(testDir, appName, template);

        expect(await fse.pathExists(appPath)).toBe(true);
        expect(await fse.pathExists(path.join(appPath, 'package.json'))).toBe(true);
        expect(await fse.pathExists(path.join(appPath, 'vite.config.ts'))).toBe(true);
        expect(await fse.pathExists(path.join(appPath, 'src/main.tsx'))).toBe(true);

        await installAndBuild(appPath);

        expect(await fse.pathExists(path.join(appPath, 'dist/index.html'))).toBe(true);
      },
      E2E_TIMEOUT,
    );

    it('should produce valid qiankun HTML output', async () => {
      const html = await fse.readFile(path.join(appPath, 'dist/index.html'), 'utf-8');
      assertQiankunHtml(html);
    });

    it('should generate correct entry file', async () => {
      await assertFileMatchesFixture(path.join(appPath, 'src/main.tsx'), template, 'main.tsx.txt', appName);
    });

    it('should generate sandbox-first qiankun vite config', async () => {
      await assertGeneratedViteConfig(appPath, appName);
    });

    it('should have correct package.json scripts and dependencies', async () => {
      const pkg = await fse.readJson(path.join(appPath, 'package.json'));

      expect(pkg.name).toBe(appName);
      expect(pkg.scripts['build:qiankun']).toBe('vite build --mode qiankun');
      expect(pkg.devDependencies['@vitejs/plugin-legacy']).toBeUndefined();
      expect(pkg.devDependencies['cheerio']).toBeUndefined();
      expect(pkg.dependencies['qiankun']).toBe(EXPECTED_QIANKUN_VERSION);
      expect(pkg.dependencies['@qiankunjs/react']).toBeDefined();
    });
  });

  describe('Main app - React + TypeScript template', () => {
    const appName = 'react-ts-main';
    const appPath = path.join(testDir, appName);
    const template = 'main-react-ts';

    it(
      'should scaffold, patch, and build successfully',
      async () => {
        await runCliMain(testDir, appName);

        expect(await fse.pathExists(appPath)).toBe(true);
        expect(await fse.pathExists(path.join(appPath, 'package.json'))).toBe(true);
        expect(await fse.pathExists(path.join(appPath, 'vite.config.ts'))).toBe(true);
        expect(await fse.pathExists(path.join(appPath, 'src/main.tsx'))).toBe(true);
        expect(await fse.pathExists(path.join(appPath, 'src/App.tsx'))).toBe(true);
        expect(await fse.pathExists(path.join(appPath, 'src/App.css'))).toBe(true);

        await installAndBuildMain(appPath);

        expect(await fse.pathExists(path.join(appPath, 'dist/index.html'))).toBe(true);
      },
      E2E_TIMEOUT,
    );

    it('should generate correct entry file', async () => {
      await assertFileMatchesFixture(path.join(appPath, 'src/main.tsx'), template, 'main.tsx.txt', appName);
    });

    it('should generate correct app component', async () => {
      await assertFileMatchesFixture(path.join(appPath, 'src/App.tsx'), template, 'App.tsx.txt', appName);
    });

    it('should generate correct app styles', async () => {
      await assertFileMatchesFixture(path.join(appPath, 'src/App.css'), template, 'App.css.txt', appName);
    });

    it('should have correct package.json for main app', async () => {
      const pkg = await fse.readJson(path.join(appPath, 'package.json'));

      expect(pkg.name).toBe(appName);
      expect(pkg.dependencies['qiankun']).toBe(EXPECTED_QIANKUN_VERSION);
      expect(pkg.dependencies['@qiankunjs/react']).toBeUndefined();
      expect(pkg.devDependencies?.['@vitejs/plugin-legacy']).toBeUndefined();
      expect(pkg.scripts?.['build:qiankun']).toBeUndefined();
    });
  });

  describe('Vue + TypeScript template', () => {
    const appName = 'vue-ts-sub';
    const appPath = path.join(testDir, appName);
    const template = 'vue-ts';

    it(
      'should scaffold, patch, and build successfully',
      async () => {
        await runCli(testDir, appName, template);

        expect(await fse.pathExists(appPath)).toBe(true);
        expect(await fse.pathExists(path.join(appPath, 'package.json'))).toBe(true);
        expect(await fse.pathExists(path.join(appPath, 'vite.config.ts'))).toBe(true);
        expect(await fse.pathExists(path.join(appPath, 'src/main.ts'))).toBe(true);

        await installAndBuild(appPath);

        expect(await fse.pathExists(path.join(appPath, 'dist/index.html'))).toBe(true);
      },
      E2E_TIMEOUT,
    );

    it('should produce valid qiankun HTML output', async () => {
      const html = await fse.readFile(path.join(appPath, 'dist/index.html'), 'utf-8');
      assertQiankunHtml(html);
    });

    it('should generate correct entry file', async () => {
      await assertFileMatchesFixture(path.join(appPath, 'src/main.ts'), template, 'main.ts.txt', appName);
    });

    it('should generate sandbox-first qiankun vite config', async () => {
      await assertGeneratedViteConfig(appPath, appName);
    });

    it('should have correct package.json with Vue dependencies', async () => {
      const pkg = await fse.readJson(path.join(appPath, 'package.json'));

      expect(pkg.name).toBe(appName);
      expect(pkg.dependencies['@qiankunjs/vue']).toBeDefined();
      expect(pkg.dependencies['vue']).toBeDefined();
    });
  });
});
