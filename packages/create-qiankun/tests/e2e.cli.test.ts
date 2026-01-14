/* eslint-disable @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import execa from 'execa';
import fse from 'fs-extra';
import path from 'node:path';
import os from 'node:os';

const CLI_PATH = path.resolve(__dirname, '../dist/index.js');
const PARENT_URL_PATTERN = 'window.__POWERED_BY_QIANKUN__';
const E2E_TIMEOUT = process.env.E2E_TIMEOUT ? parseInt(process.env.E2E_TIMEOUT, 10) : 180000;

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

function assertQiankunHtml(html: string): void {
  expect(html).not.toMatch(/<script[^>]*type=["']?module["']?[^>]*>/);

  expect(html).not.toMatch(/<link[^>]*rel=["']?modulepreload["']?[^>]*>/);

  expect(html).toMatch(/id=["']?vite-legacy-entry["']?/);

  expect(html).toContain(PARENT_URL_PATTERN);
  expect(html).toContain('__INJECTED_PUBLIC_PATH_BY_QIANKUN__');

  expect(html).toMatch(/nomodule/);

  expect(html).toMatch(/<link[^>]*rel=["']?stylesheet["']?[^>]*>/);
}

function assertEntryFile(content: string, appName: string): void {
  expect(content).toContain('export async function bootstrap');
  expect(content).toContain('export async function mount');
  expect(content).toContain('export async function unmount');

  expect(content).toContain(`const appName = '${appName}'`);

  expect(content).toContain('__POWERED_BY_QIANKUN__');
  expect(content).toContain(`window[appName] = { bootstrap, mount, unmount }`);
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

    it(
      'should scaffold, patch, and build successfully',
      async () => {
        await runCli(testDir, appName, 'react-ts');

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

    it('should have correct entry file with lifecycle exports', async () => {
      const entryContent = await fse.readFile(path.join(appPath, 'src/main.tsx'), 'utf-8');
      assertEntryFile(entryContent, appName);
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

    it('should have correct vite.config.ts', async () => {
      const viteConfig = await fse.readFile(path.join(appPath, 'vite.config.ts'), 'utf-8');

      expect(viteConfig).toContain("import react from '@vitejs/plugin-react'");
      expect(viteConfig).toContain("import legacy from '@vitejs/plugin-legacy'");
      expect(viteConfig).toContain("import qiankunHtmlPlugin from './config/qiankunHtml'");
      expect(viteConfig).toContain("mode === 'qiankun'");
      expect(viteConfig).toContain("base: isQiankun ? './' : '/'");
    });
  });

  describe('Vue + TypeScript template', () => {
    const appName = 'vue-ts-sub';
    const appPath = path.join(testDir, appName);

    it(
      'should scaffold, patch, and build successfully',
      async () => {
        await runCli(testDir, appName, 'vue-ts');

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

    it('should have correct entry file with lifecycle exports', async () => {
      const entryContent = await fse.readFile(path.join(appPath, 'src/main.ts'), 'utf-8');
      assertEntryFile(entryContent, appName);
    });

    it('should have correct package.json with Vue dependencies', async () => {
      const pkg = await fse.readJson(path.join(appPath, 'package.json'));

      expect(pkg.name).toBe(appName);
      expect(pkg.dependencies['@qiankunjs/vue']).toBeDefined();
      expect(pkg.dependencies['vue']).toBeDefined();
    });

    it('should have correct vite.config.ts for Vue', async () => {
      const viteConfig = await fse.readFile(path.join(appPath, 'vite.config.ts'), 'utf-8');

      expect(viteConfig).toContain("import vue from '@vitejs/plugin-vue'");
      expect(viteConfig).toContain('vue()');
    });
  });
});
