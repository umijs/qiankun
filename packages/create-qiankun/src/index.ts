import prompts from 'prompts';
import { lightGray, green } from 'kolorist';
export async function init() {
  console.log();
  console.log(green('Welcome to use create-qiankun-starter!'));

  console.log();
  const root = process.cwd();

  const result = await prompts([
    {
      name: 'projectName',
      type: 'text',
      message: 'Project name:',
    },
  ]);
  console.log(result);
}

init().catch((e) => {
  console.error(e);
});
