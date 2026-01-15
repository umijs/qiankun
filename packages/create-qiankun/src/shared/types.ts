export enum ViteTemplate {
  ReactTs = 'react-ts',
  React = 'react',
  VueTs = 'vue-ts',
  Vue = 'vue',
}

export interface TemplateOption {
  title: string;
  value: ViteTemplate;
}

export const templateOptions: TemplateOption[] = [
  { title: 'React + TypeScript', value: ViteTemplate.ReactTs },
  { title: 'React', value: ViteTemplate.React },
  { title: 'Vue + TypeScript', value: ViteTemplate.VueTs },
  { title: 'Vue', value: ViteTemplate.Vue },
];

export interface PromptAnswers {
  appName: string;
  template: ViteTemplate;
}

export function isReactTemplate(template: ViteTemplate): boolean {
  return template === ViteTemplate.React || template === ViteTemplate.ReactTs;
}

export function isTypeScriptTemplate(template: ViteTemplate): boolean {
  return template === ViteTemplate.ReactTs || template === ViteTemplate.VueTs;
}
