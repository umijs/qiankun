import {
  Configuration,
  Compiler,
  WebpackPluginInstance,
  RuleSetRule,
  ResolveOptions,
} from '@umijs/bunder-webpack/compiled/webpack';
import * as https from 'https';

export = Config;

declare namespace __Config {
  class Chained<Parent> {
    batch(handler: (chained: this) => void): this;
    end(): Parent;
  }
  class TypedChainedMap<Parent, OptionsType> extends Chained<Parent> {
    clear(): this;
    delete(key: string): this;
    has(key: string): boolean;
    get<T extends keyof OptionsType>(key: T): OptionsType[T];
    getOrCompute<T extends keyof OptionsType>(
      key: T,
      compute: () => OptionsType[T],
    ): OptionsType[T];
    set<T extends keyof OptionsType>(key: T, value: OptionsType[T]): this;
    merge(obj: Partial<OptionsType>): this;
    entries(): OptionsType;
    values<T extends keyof OptionsType>(): [OptionsType[T]][];
    when(
      condition: boolean,
      trueBrancher: (obj: this) => void,
      falseBrancher?: (obj: this) => void,
    ): this;
  }

  class ChainedMap<Parent> extends TypedChainedMap<Parent, any> {}
  class TypedChainedSet<Parent, Value> extends Chained<Parent> {
    add(value: Value): this;
    prepend(value: Value): this;
    clear(): this;
    delete(key: string): this;
    has(key: string): boolean;
    merge(arr: Value[]): this;
    values(): Value[];
    when(
      condition: boolean,
      trueBrancher: (obj: this) => void,
      falseBrancher?: (obj: this) => void,
    ): this;
  }

  class ChainedSet<Parent> extends TypedChainedSet<Parent, any> {}
}

type WebpackConfig = Required<Configuration>;
declare class Config extends __Config.ChainedMap<void> {
  entryPoints: Config.TypedChainedMap<
    Config,
    { [key: string]: Config.EntryPoint }
  >;
  output: Config.Output;
  module: Config.Module;
  node: Config.ChainedMap<this> & ((value: boolean) => this);
  optimization: Config.Optimization;
  performance: Config.Performance & ((value: boolean) => this);
  plugins: Config.Plugins<this, WebpackPluginInstance>;
  resolve: Config.Resolve;
  resolveLoader: Config.ResolveLoader;
  devServer: Config.DevServer;

  context(value: WebpackConfig['context']): this;
  mode(value: WebpackConfig['mode']): this;
  devtool(value: Config.DevTool): this;
  target(value: WebpackConfig['target']): this;
  watch(value: WebpackConfig['watch']): this;
  watchOptions(value: WebpackConfig['watchOptions']): this;
  externals(value: WebpackConfig['externals']): this;
  externalsType(value: WebpackConfig['externalsType']): this;
  externalsPresets(value: WebpackConfig['externalsPresets']): this;
  stats(value: WebpackConfig['stats']): this;
  experiments(value: WebpackConfig['experiments']): this;
  amd(value: WebpackConfig['amd']): this;
  bail(value: WebpackConfig['bail']): this;
  cache(value: WebpackConfig['cache']): this;
  dependencies(value: WebpackConfig['dependencies']): this;
  ignoreWarnings(value: WebpackConfig['ignoreWarnings']): this;
  loader(value: WebpackConfig['loader']): this;
  parallelism(value: WebpackConfig['parallelism']): this;
  profile(value: WebpackConfig['profile']): this;
  recordsPath(value: WebpackConfig['recordsPath']): this;
  recordsInputPath(value: WebpackConfig['recordsInputPath']): this;
  recordsOutputPath(value: WebpackConfig['recordsOutputPath']): this;
  name(value: WebpackConfig['name']): this;
  infrastructureLogging(value: WebpackConfig['infrastructureLogging']): this;
  snapshot(value: WebpackConfig['snapshot']): this;

  entry(name: string): Config.EntryPoint;
  plugin(name: string): Config.Plugin<this, WebpackPluginInstance>;

  toConfig(): Configuration;
}

declare namespace Config {
  class Chained<Parent> extends __Config.Chained<Parent> {}
  class TypedChainedMap<Parent, OptionsType> extends __Config.TypedChainedMap<
    Parent,
    OptionsType
  > {}
  class ChainedMap<Parent> extends __Config.TypedChainedMap<Parent, any> {}
  class TypedChainedSet<Parent, Value> extends __Config.TypedChainedSet<
    Parent,
    Value
  > {}
  class ChainedSet<Parent> extends __Config.TypedChainedSet<Parent, any> {}

  class Plugins<
    Parent,
    PluginType extends WebpackPluginInstance,
  > extends TypedChainedMap<
    Parent,
    { [key: string]: Plugin<Parent, PluginType> }
  > {}

  class Plugin<Parent, PluginType extends WebpackPluginInstance | ResolvePlugin>
    extends ChainedMap<Parent>
    implements Orderable
  {
    init<P extends PluginType | PluginClass<PluginType>>(
      value: (
        plugin: P,
        args: P extends PluginClass<PluginType>
          ? ConstructorParameters<P>
          : any[],
      ) => PluginType,
    ): this;
    use<P extends string | PluginType | PluginClass<PluginType>>(
      plugin: P,
      args?: P extends PluginClass<PluginType>
        ? ConstructorParameters<P>
        : any[],
    ): this;
    tap<P extends PluginClass<PluginType>>(
      f: (args: ConstructorParameters<P>) => ConstructorParameters<P>,
    ): this;

    // Orderable
    before(name: string): this;
    after(name: string): this;
  }

  type WebpackEntry = NonNullable<Configuration['entry']>;

  type WepackEntryObject = Exclude<
    WebpackEntry,
    string | string[] | Function
  >[string];

  class EntryPoint extends TypedChainedSet<Config, WepackEntryObject> {}

  type WebpackModule = Required<NonNullable<Configuration['module']>>;

  class Module extends ChainedMap<Config> {
    rules: TypedChainedMap<this, { [key: string]: Rule }>;
    generator: ChainedMap<this>;
    parser: ChainedMap<this>;
    rule(name: string): Rule;
    noParse(value: WebpackModule['noParse']): this;
    unsafeCache(value: WebpackModule['unsafeCache']): this;
    wrappedContextCritical(
      value: WebpackModule['wrappedContextCritical'],
    ): this;
    exprContextRegExp(value: WebpackModule['exprContextRegExp']): this;
    wrappedContextRecursive(
      value: WebpackModule['wrappedContextRecursive'],
    ): this;
    strictExportPresence(value: WebpackModule['strictExportPresence']): this;
    wrappedContextRegExp(value: WebpackModule['wrappedContextRegExp']): this;
  }

  type WebpackOutput = Required<NonNullable<Configuration['output']>>;

  class Output extends ChainedMap<Config> {
    auxiliaryComment(value: WebpackOutput['auxiliaryComment']): this;
    charset(value: WebpackOutput['charset']): this;
    chunkFilename(value: WebpackOutput['chunkFilename']): this;
    chunkLoadTimeout(value: WebpackOutput['chunkLoadTimeout']): this;
    chunkLoadingGlobal(value: WebpackOutput['chunkLoadingGlobal']): this;
    chunkLoading(value: WebpackOutput['chunkLoading']): this;
    chunkFormat(value: WebpackOutput['chunkFormat']): this;
    enabledChunkLoadingTypes(
      value: WebpackOutput['enabledChunkLoadingTypes'],
    ): this;
    crossOriginLoading(value: WebpackOutput['crossOriginLoading']): this;
    devtoolFallbackModuleFilenameTemplate(
      value: WebpackOutput['devtoolFallbackModuleFilenameTemplate'],
    ): this;
    devtoolModuleFilenameTemplate(
      value: WebpackOutput['devtoolModuleFilenameTemplate'],
    ): this;
    devtoolNamespace(value: WebpackOutput['devtoolNamespace']): this;
    filename(value: WebpackOutput['filename']): this;
    assetModuleFilenamet(value: WebpackOutput['assetModuleFilename']): this;
    globalObject(value: WebpackOutput['globalObject']): this;
    uniqueName(value: WebpackOutput['uniqueName']): this;
    hashDigest(value: WebpackOutput['hashDigest']): this;
    hashDigestLength(value: WebpackOutput['hashDigestLength']): this;
    hashFunction(value: WebpackOutput['hashFunction']): this;
    hashSalt(value: WebpackOutput['hashSalt']): this;
    hotUpdateChunkFilename(
      value: WebpackOutput['hotUpdateChunkFilename'],
    ): this;
    hotUpdateGlobal(value: WebpackOutput['hotUpdateGlobal']): this;
    hotUpdateMainFilename(value: WebpackOutput['hotUpdateMainFilename']): this;
    library(value: WebpackOutput['library']): this;
    libraryExport(value: WebpackOutput['libraryExport']): this;
    libraryTarget(value: WebpackOutput['libraryTarget']): this;
    importFunctionName(value: WebpackOutput['importFunctionName']): this;
    path(value: WebpackOutput['path']): this;
    pathinfo(value: WebpackOutput['pathinfo']): this;
    publicPath(value: WebpackOutput['publicPath']): this;
    scriptType(value: WebpackOutput['scriptType']): this;
    sourceMapFilename(value: WebpackOutput['sourceMapFilename']): this;
    sourcePrefix(value: WebpackOutput['sourcePrefix']): this;
    strictModuleErrorHandling(
      value: WebpackOutput['strictModuleErrorHandling'],
    ): this;
    strictModuleExceptionHandling(
      value: WebpackOutput['strictModuleExceptionHandling'],
    ): this;
    umdNamedDefine(value: WebpackOutput['umdNamedDefine']): this;
    workerChunkLoading(value: WebpackOutput['workerChunkLoading']): this;
    enabledLibraryTypes(value: WebpackOutput['enabledLibraryTypes']): this;
    environment(value: WebpackOutput['environment']): this;
    compareBeforeEmit(value: WebpackOutput['compareBeforeEmit']): this;
    wasmLoading(value: WebpackOutput['wasmLoading']): this;
    enabledWasmLoadingTypes(
      value: WebpackOutput['enabledWasmLoadingTypes'],
    ): this;
    iife(value: WebpackOutput['iife']): this;
    module(value: WebpackOutput['module']): this;
    clean(value: WebpackOutput['clean']): this;
  }

  // await for @types/webpack-dev-server update do v4 to remove all any
  class DevServer extends ChainedMap<Config> {
    allowedHosts: TypedChainedSet<this, string>;
    after(value: (app: any, server: any, compiler: Compiler) => void): this;
    before(value: (app: any, server: any, compiler: Compiler) => void): this;
    bonjour(value: boolean): this;
    clientLogLevel(
      value:
        | 'silent'
        | 'trace'
        | 'debug'
        | 'info'
        | 'warn'
        | 'error'
        | 'none'
        | 'warning',
    ): this;
    compress(value: boolean): this;
    contentBase(value: boolean | string | string[]): this;
    contentBasePublicPath(value: string): this;
    disableHostCheck(value: boolean): this;
    filename(value: string): this;
    headers(value: { [header: string]: string }): this;
    historyApiFallback(value: boolean | any): this;
    host(value: string): this;
    hot(value: boolean): this;
    hotOnly(value: boolean): this;
    http2(value: boolean): this;
    https(value: boolean | https.ServerOptions): this;
    index(value: string): this;
    injectClient(value: boolean | ((compiler: Compiler) => boolean)): this;
    injectHot(value: boolean | ((compiler: Compiler) => boolean)): this;
    inline(value: boolean): this;
    lazy(value: boolean): this;
    liveReload(value: boolean): this;
    mimeTypes(value: Object): this;
    noInfo(value: boolean): this;
    onListening(value: (server: any) => void): this;
    open(value: boolean): this;
    openPage(value: string | string[]): this;
    overlay(value: boolean | { warnings?: boolean; errors?: boolean }): this;
    pfx(value: string): this;
    pfxPassphrase(value: string): this;
    port(value: number): this;
    progress(value: boolean): this;
    proxy(value: any): this;
    public(value: string): this;
    publicPath(publicPath: string): this;
    quiet(value: boolean): this;
    serveIndex(value: boolean): this;
    setup(value: (expressApp: any) => void): this;
    socket(value: string): this;
    sockHost(value: string): this;
    sockPath(value: string): this;
    sockPort(value: number): this;
    staticOptions(value: any): this;
    stats(value: Configuration['stats']): this;
    stdin(value: boolean): this;
    transportMode(
      value:
        | 'sockjs'
        | 'ws'
        | {
            server: 'ws';
            client: object;
          }
        | {
            client: 'sockjs';
            server: object;
          }
        | {
            client: object;
            server: object;
          },
    ): this;
    useLocalIp(value: boolean): this;
    watchContentBase(value: boolean): this;
    watchOptions(value: Configuration['watchOptions']): this;
    writeToDisk(value: boolean): this;
  }

  type WebpackPerformance = Exclude<
    Required<NonNullable<Configuration['performance']>>,
    false
  >;
  class Performance extends ChainedMap<Config> {
    hints(value: WebpackPerformance['hints']): this;
    maxEntrypointSize(value: WebpackPerformance['maxEntrypointSize']): this;
    maxAssetSize(value: WebpackPerformance['maxAssetSize']): this;
    assetFilter(value: WebpackPerformance['assetFilter']): this;
  }

  type WebpackResolve = Required<NonNullable<Configuration['resolve']>>;
  type ResolvePlugin = Exclude<
    NonNullable<ResolveOptions['plugins']>[number],
    '...'
  >;

  class Resolve<T = Config> extends ChainedMap<T> {
    alias: TypedChainedMap<this, { [key: string]: string | false | string[] }>;
    aliasFields: TypedChainedSet<this, WebpackResolve['aliasFields'][number]>;
    descriptionFiles: TypedChainedSet<
      this,
      WebpackResolve['descriptionFiles'][number]
    >;
    extensions: TypedChainedSet<this, WebpackResolve['extensions'][number]>;
    mainFields: TypedChainedSet<this, WebpackResolve['mainFields'][number]>;
    mainFiles: TypedChainedSet<this, WebpackResolve['mainFiles'][number]>;
    exportsFields: TypedChainedSet<
      this,
      WebpackResolve['exportsFields'][number]
    >;
    importsFields: TypedChainedSet<
      this,
      WebpackResolve['importsFields'][number]
    >;
    restrictions: TypedChainedSet<this, WebpackResolve['restrictions'][number]>;
    roots: TypedChainedSet<this, WebpackResolve['roots'][number]>;
    modules: TypedChainedSet<this, WebpackResolve['modules'][number]>;
    plugins: TypedChainedMap<
      this,
      { [key: string]: Plugin<Resolve, ResolvePlugin> }
    >;
    fallback: TypedChainedMap<
      this,
      { [key: string]: string | false | string[] }
    >;
    byDependency: TypedChainedMap<this, WebpackResolve['byDependency']>;

    cachePredicate(value: WebpackResolve['cachePredicate']): this;
    cacheWithContext(value: WebpackResolve['cacheWithContext']): this;
    enforceExtension(value: WebpackResolve['enforceExtension']): this;
    symlinks(value: WebpackResolve['symlinks']): this;
    unsafeCache(value: WebpackResolve['unsafeCache']): this;
    preferRelative(value: WebpackResolve['preferRelative']): this;
    preferAbsolute(value: WebpackResolve['preferAbsolute']): this;

    plugin(name: string): Plugin<this, ResolvePlugin>;
  }

  class RuleResolve<T = Config> extends Resolve<T> {
    fullySpecified(value: boolean): this;
  }

  class ResolveLoader extends Resolve {
    modules: ChainedSet<this>;
    moduleExtensions: ChainedSet<this>;
    packageMains: ChainedSet<this>;
  }

  type WebpackRuleSet = Required<RuleSetRule>;

  class Rule<T = Module> extends ChainedMap<T> implements Orderable {
    uses: TypedChainedMap<this, { [key: string]: Use }>;
    include: TypedChainedSet<this, WebpackRuleSet['include']>;
    exclude: TypedChainedSet<this, WebpackRuleSet['exclude']>;
    rules: TypedChainedMap<this, { [key: string]: Rule<Rule> }>;
    oneOfs: TypedChainedMap<this, { [key: string]: Rule<Rule> }>;
    resolve: RuleResolve<Rule<T>>;

    enforce(value: WebpackRuleSet['enforce']): this;
    issuer(value: WebpackRuleSet['issuer']): this;
    issuerLayer(value: WebpackRuleSet['issuerLayer']): this;
    layer(value: WebpackRuleSet['layer']): this;
    mimetype(value: WebpackRuleSet['mimetype']): this;
    parser(value: WebpackRuleSet['parser']): this;
    generator(value: WebpackRuleSet['generator']): this;
    resource(value: WebpackRuleSet['resource']): this;
    resourceQuery(value: WebpackRuleSet['resourceQuery']): this;
    sideEffects(value: WebpackRuleSet['sideEffects']): this;
    test(value: WebpackRuleSet['test']): this;
    type(value: WebpackRuleSet['type']): this;

    use(name: string): Use<this>;
    rule(name: string): Rule<Rule>;
    oneOf(name: string): Rule<Rule>;
    pre(): this;
    post(): this;
    before(name: string): this;
    after(name: string): this;
  }

  type WebpackOptimization = Required<
    NonNullable<Configuration['optimization']>
  >;
  type SplitChunksObject = Exclude<WebpackOptimization['splitChunks'], false>;
  class Optimization extends ChainedMap<Config> {
    minimizer(name: string): Config.Plugin<this, WebpackPluginInstance>;
    splitChunks: TypedChainedMap<this, SplitChunksObject> &
      ((value: SplitChunksObject | false) => this);

    minimize(value: WebpackOptimization['minimize']): this;
    runtimeChunk(value: WebpackOptimization['runtimeChunk']): this;
    emitOnErrors(value: WebpackOptimization['emitOnErrors']): this;
    moduleIds(value: WebpackOptimization['moduleIds']): this;
    chunkIds(value: WebpackOptimization['chunkIds']): this;
    nodeEnv(value: WebpackOptimization['nodeEnv']): this;
    mangleWasmImports(value: WebpackOptimization['mangleWasmImports']): this;
    removeAvailableModules(
      value: WebpackOptimization['removeAvailableModules'],
    ): this;
    removeEmptyChunks(value: WebpackOptimization['removeEmptyChunks']): this;
    mergeDuplicateChunks(
      value: WebpackOptimization['mergeDuplicateChunks'],
    ): this;
    flagIncludedChunks(value: WebpackOptimization['flagIncludedChunks']): this;
    providedExports(value: WebpackOptimization['providedExports']): this;
    usedExports(value: WebpackOptimization['usedExports']): this;
    concatenateModules(value: WebpackOptimization['concatenateModules']): this;
    sideEffects(value: WebpackOptimization['sideEffects']): this;
    portableRecords(value: WebpackOptimization['portableRecords']): this;
    mangleExports(value: WebpackOptimization['mangleExports']): this;
    innerGraph(value: WebpackOptimization['innerGraph']): this;
    realContentHash(value: WebpackOptimization['realContentHash']): this;
  }

  interface RuntimeChunk {
    name: string | RuntimeChunkFunction;
  }

  type RuntimeChunkFunction = (entryPoint: EntryPoint) => string;

  interface SplitChunksOptions {
    [name: string]: any;
  }

  interface LoaderOptions {
    [name: string]: any;
  }

  class Use<Parent = Rule> extends ChainedMap<Parent> implements Orderable {
    loader(value: string): this;
    options(value: LoaderOptions): this;

    tap(f: (options: LoaderOptions) => LoaderOptions): this;

    // Orderable
    before(name: string): this;
    after(name: string): this;
  }

  type DevTool =
    | 'eval'
    | 'eval-cheap-source-map'
    | 'eval-cheap-module-source-map'
    | 'eval-source-map'
    | 'cheap-source-map'
    | 'cheap-module-source-map'
    | 'source-map'
    | 'inline-cheap-source-map'
    | 'inline-cheap-module-source-map'
    | 'inline-source-map'
    | 'eval-nosources-cheap-source-map'
    | 'eval-nosources-cheap-module-source-map'
    | 'eval-nosources-source-map'
    | 'inline-nosources-cheap-source-map'
    | 'inline-nosources-cheap-module-source-map'
    | 'inline-nosources-source-map'
    | 'nosources-cheap-source-map'
    | 'nosources-cheap-module-source-map'
    | 'nosources-source-map'
    | 'hidden-nosources-cheap-source-map'
    | 'hidden-nosources-cheap-module-source-map'
    | 'hidden-nosources-source-map'
    | 'hidden-cheap-source-map'
    | 'hidden-cheap-module-source-map'
    | 'hidden-source-map'
    | '@eval'
    | '@eval-cheap-source-map'
    | '@eval-cheap-module-source-map'
    | '@eval-source-map'
    | '@cheap-source-map'
    | '@cheap-module-source-map'
    | '@source-map'
    | '@inline-cheap-source-map'
    | '@inline-cheap-module-source-map'
    | '@inline-source-map'
    | '@eval-nosources-cheap-source-map'
    | '@eval-nosources-cheap-module-source-map'
    | '@eval-nosources-source-map'
    | '@inline-nosources-cheap-source-map'
    | '@inline-nosources-cheap-module-source-map'
    | '@inline-nosources-source-map'
    | '@nosources-cheap-source-map'
    | '@nosources-cheap-module-source-map'
    | '@nosources-source-map'
    | '@hidden-nosources-cheap-source-map'
    | '@hidden-nosources-cheap-module-source-map'
    | '@hidden-nosources-source-map'
    | '@hidden-cheap-source-map'
    | '@hidden-cheap-module-source-map'
    | '@hidden-source-map'
    | '#eval'
    | '#eval-cheap-source-map'
    | '#eval-cheap-module-source-map'
    | '#eval-source-map'
    | '#cheap-source-map'
    | '#cheap-module-source-map'
    | '#source-map'
    | '#inline-cheap-source-map'
    | '#inline-cheap-module-source-map'
    | '#inline-source-map'
    | '#eval-nosources-cheap-source-map'
    | '#eval-nosources-cheap-module-source-map'
    | '#eval-nosources-source-map'
    | '#inline-nosources-cheap-source-map'
    | '#inline-nosources-cheap-module-source-map'
    | '#inline-nosources-source-map'
    | '#nosources-cheap-source-map'
    | '#nosources-cheap-module-source-map'
    | '#nosources-source-map'
    | '#hidden-nosources-cheap-source-map'
    | '#hidden-nosources-cheap-module-source-map'
    | '#hidden-nosources-source-map'
    | '#hidden-cheap-source-map'
    | '#hidden-cheap-module-source-map'
    | '#hidden-source-map'
    | '#@eval'
    | '#@eval-cheap-source-map'
    | '#@eval-cheap-module-source-map'
    | '#@eval-source-map'
    | '#@cheap-source-map'
    | '#@cheap-module-source-map'
    | '#@source-map'
    | '#@inline-cheap-source-map'
    | '#@inline-cheap-module-source-map'
    | '#@inline-source-map'
    | '#@eval-nosources-cheap-source-map'
    | '#@eval-nosources-cheap-module-source-map'
    | '#@eval-nosources-source-map'
    | '#@inline-nosources-cheap-source-map'
    | '#@inline-nosources-cheap-module-source-map'
    | '#@inline-nosources-source-map'
    | '#@nosources-cheap-source-map'
    | '#@nosources-cheap-module-source-map'
    | '#@nosources-source-map'
    | '#@hidden-nosources-cheap-source-map'
    | '#@hidden-nosources-cheap-module-source-map'
    | '#@hidden-nosources-source-map'
    | '#@hidden-cheap-source-map'
    | '#@hidden-cheap-module-source-map'
    | '#@hidden-source-map'
    | boolean;

  interface PluginClass<
    PluginType extends WebpackPluginInstance | ResolvePlugin,
  > {
    new (...opts: any[]): PluginType;
  }

  interface Orderable {
    before(name: string): this;
    after(name: string): this;
  }
}
