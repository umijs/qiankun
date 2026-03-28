import type { ViteTemplate } from '../types';
import { patchPackageJson } from './packageJson';
import { writeViteConfig } from './viteConfig';
import { writeEntryFile } from './entryFile';
import { writeSubAppView } from './subAppView';

export async function patchViteSubApp(appRoot: string, appName: string, template: ViteTemplate): Promise<void> {
  await patchPackageJson(appRoot, appName, template);
  await writeViteConfig(appRoot, template);
  await writeEntryFile(appRoot, appName, template);
  await writeSubAppView(appRoot, template);
}
