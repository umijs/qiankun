import { patchMainPackageJson } from './packageJson';
import { writeMainViteConfig } from './viteConfig';
import { writeMainEntryFile } from './entryFile';
import { writeMainAppComponent } from './appComponent';
import { writeMainAppStyles } from './appStyles';

export async function patchViteMainApp(appRoot: string, appName: string): Promise<void> {
  await patchMainPackageJson(appRoot, appName);
  await writeMainViteConfig(appRoot);
  await writeMainEntryFile(appRoot, appName);
  await writeMainAppComponent(appRoot);
  await writeMainAppStyles(appRoot);
}
