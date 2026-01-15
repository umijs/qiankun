import type { ViteTemplate } from '../types';
import { patchPackageJson } from './packageJson';
import { writeQiankunHtmlPlugin } from './qiankunHtmlPlugin';
import { writeViteConfig } from './viteConfig';
import { writeEntryFile } from './entryFile';

export async function patchViteSubApp(appRoot: string, appName: string, template: ViteTemplate): Promise<void> {
  await patchPackageJson(appRoot, appName, template);
  await writeQiankunHtmlPlugin(appRoot, template);
  await writeViteConfig(appRoot, template);
  await writeEntryFile(appRoot, appName, template);
}
