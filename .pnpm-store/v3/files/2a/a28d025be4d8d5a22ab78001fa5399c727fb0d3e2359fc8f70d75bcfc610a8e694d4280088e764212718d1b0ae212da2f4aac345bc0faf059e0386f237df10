export interface IModule {
  content: string; // If isBinary is true this will be a URL
  isBinary: boolean;
  type?: "file";
  uploadId?: string;
  sha?: string;
}

export interface IBinaryModule extends IModule {
  binaryContent: string;
}

export interface IDirectory {
  type: "directory";
}

export interface INormalizedModules {
  [path: string]: IModule | IBinaryModule | IDirectory;
}

export interface ISandboxFile {
  title: string;
  code: string;
  shortid: string;
  isBinary: boolean;
  binaryContent?: string;
  uploadId?: string;
  directoryShortid: string | undefined | null;
  sha?: string;
}

export interface ISandboxDirectory {
  shortid: string;
  title: string;
  directoryShortid: string | undefined | null;
}

export type ITemplate =
  | "adonis"
  | "vue-cli"
  | "preact-cli"
  | "svelte"
  | "create-react-app-typescript"
  | "create-react-app"
  | "angular-cli"
  | "parcel"
  | "@dojo/cli-create-app"
  | "cxjs"
  | "gatsby"
  | "nuxt"
  | "next"
  | "reason"
  | "apollo"
  | "sapper"
  | "ember"
  | "nest"
  | "static"
  | "styleguidist"
  | "gridsome"
  | "vuepress"
  | "mdx-deck"
  | "quasar"
  | "docusaurus"
  | "node";

export interface ISandbox {
  title: string;
  description: string;
  tags: string;
  modules: ISandboxFile[];
  directories: ISandboxDirectory[];
  externalResources: string[];
  template: ITemplate;
  entry: string;
}
