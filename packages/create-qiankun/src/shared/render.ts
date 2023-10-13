import { directoryTraverse, normalizePath } from './utils';
import fse from 'fs-extra';
import ejs from 'ejs';

export function renderEJSforTemplate(targetDirPath: string, data: Record<string, string | number>) {
  targetDirPath = normalizePath(targetDirPath);

  directoryTraverse(targetDirPath, {
    fileCallback(filePath) {
      const [, resolvePath] = filePath.split(targetDirPath);
      if (resolvePath.endsWith('.ejs')) {
        const content = fse.readFileSync(filePath, 'utf-8');
        const result = ejs.render(content, data);
        // main.js.ejs   app.vue.ejs
        const rawPath = filePath.replace(/\.ejs$/, '');
        fse.writeFileSync(rawPath, result);
        fse.removeSync(filePath);
      }
    },
  });
}
