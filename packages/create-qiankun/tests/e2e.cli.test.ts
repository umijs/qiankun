/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import execa from 'execa';
import fse from 'fs-extra';
import path from 'node:path';
import os from 'node:os';

const CLI_PATH = path.resolve(__dirname, '../dist/index.js');
const FIXTURES_PATH = path.resolve(__dirname, 'fixtures');
const E2E_TIMEOUT = process.env.E2E_TIMEOUT ? parseInt(process.env.E2E_TIMEOUT, 10) : 180000;

const APP_NAME_PLACEHOLDER = '{{APP_NAME}}';

async function runCli(cwd: string, appName: string, template: string): Promise<void> {
  await execa('node', [CLI_PATH, appName, '--template', template], {
    cwd,
    stdio: 'inherit',
  });
}

async function installAndBuild(appPath: string): Promise<void> {
  await execa('pnpm', ['install'], { cwd: appPath, stdio: 'inherit' });
  await execa('pnpm', ['build:qiankun'], { cwd: appPath, stdio: 'inherit' });
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
  expect(html).not.toMatch(/<link[^>]*rel=["']?modulepreload["']?[^>]*>/);
  expect(html).toMatch(/id=["']?vite-legacy-entry["']?/);
  expect(html).toContain('window.__POWERED_BY_QIANKUN__');
  expect(html).toContain('__INJECTED_PUBLIC_PATH_BY_QIANKUN__');
  expect(html).toMatch(/nomodule/);
  expect(html).toMatch(/<link[^>]*rel=["']?stylesheet["']?[^>]*>/);
}

describe('create-qiankun CLI e2e', () => {
  const testDir = path.join(os.tmpdir(), `create-qiankun-e2e-${Date.now()}`);

  beforeAll(async () => {
    await fse.ensureDir(testDir);
  });

  afterAll(async () => {
    await fse.remove(testDir);
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
        expect(await fse.pathExists(path.join(appPath, 'config/qiankunHtml.ts'))).toBe(true);
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

    it('should generate correct vite.config.ts', async () => {
      await assertFileMatchesFixture(path.join(appPath, 'vite.config.ts'), template, 'vite.config.ts.txt', appName);
    });

    it('should generate correct qiankunHtml plugin', async () => {
      await assertFileMatchesFixture(
        path.join(appPath, 'config/qiankunHtml.ts'),
        template,
        'qiankunHtml.ts.txt',
        appName,
      );
    });

    it('should have correct package.json scripts and dependencies', async () => {
      const pkg = await fse.readJson(path.join(appPath, 'package.json'));

      expect(pkg.name).toBe(appName);
      expect(pkg.scripts['build:qiankun']).toBe('vite build --mode qiankun');
      expect(pkg.devDependencies['@vitejs/plugin-legacy']).toBeDefined();
      expect(pkg.devDependencies['cheerio']).toBeDefined();
      expect(pkg.dependencies['qiankun']).toBeDefined();
      expect(pkg.dependencies['@qiankunjs/react']).toBeDefined();
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
        expect(await fse.pathExists(path.join(appPath, 'config/qiankunHtml.ts'))).toBe(true);
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

    it('should generate correct vite.config.ts', async () => {
      await assertFileMatchesFixture(path.join(appPath, 'vite.config.ts'), template, 'vite.config.ts.txt', appName);
    });

    it('should generate correct qiankunHtml plugin', async () => {
      await assertFileMatchesFixture(
        path.join(appPath, 'config/qiankunHtml.ts'),
        template,
        'qiankunHtml.ts.txt',
        appName,
      );
    });

    it('should have correct package.json with Vue dependencies', async () => {
      const pkg = await fse.readJson(path.join(appPath, 'package.json'));

      expect(pkg.name).toBe(appName);
      expect(pkg.dependencies['@qiankunjs/vue']).toBeDefined();
      expect(pkg.dependencies['vue']).toBeDefined();
    });
  });
});
