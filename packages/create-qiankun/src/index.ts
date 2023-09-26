import prompts from 'prompts';

export async function init() {
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
