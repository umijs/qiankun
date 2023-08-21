var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/service/generatePlugin.ts
var generatePlugin_exports = {};
__export(generatePlugin_exports, {
  default: () => generatePlugin_default
});
module.exports = __toCommonJS(generatePlugin_exports);
var import_utils = require("@umijs/utils");
var import_generator = require("./generator");
var generatePlugin_default = (api) => {
  api.registerCommand({
    name: "generate",
    alias: "g",
    details: `
umi generate
`,
    description: "generate code snippets quickly",
    configResolveMode: "loose",
    async fn({ args }) {
      var _a;
      const [type] = args._;
      const runGenerator = async (generator) => {
        await (generator == null ? void 0 : generator.fn({
          args,
          generateFile: import_utils.generateFile,
          installDeps: import_utils.installDeps,
          updatePackageJSON: import_utils.updatePackageJSON
        }));
      };
      if (type) {
        const generator = api.service.generators[type];
        if (!generator) {
          throw new Error(`Generator ${type} not found.`);
        }
        if (generator.type === import_generator.GeneratorType.enable) {
          const enable = await ((_a = generator.checkEnable) == null ? void 0 : _a.call(generator, {
            args
          }));
          if (!enable) {
            if (typeof generator.disabledDescription === "function") {
              import_utils.logger.warn(generator.disabledDescription());
            } else {
              import_utils.logger.warn(generator.disabledDescription);
            }
            return;
          }
        }
        await runGenerator(generator);
      } else {
        const getEnableGenerators = async (generators) => {
          var _a2;
          const questions2 = [];
          for (const key of Object.keys(generators)) {
            const g = generators[key];
            if (g.type === import_generator.GeneratorType.generate) {
              questions2.push({
                title: `${g.name} -- ${g.description}` || "",
                value: g.key
              });
            } else {
              const enable = await ((_a2 = g == null ? void 0 : g.checkEnable) == null ? void 0 : _a2.call(g, {
                args
              }));
              if (enable) {
                questions2.push({
                  title: `${g.name} -- ${g.description}` || "",
                  value: g.key
                });
              }
            }
          }
          return questions2;
        };
        const questions = await getEnableGenerators(api.service.generators);
        const { gType } = await (0, import_utils.prompts)({
          type: "select",
          name: "gType",
          message: "Pick generator type",
          choices: questions
        });
        await runGenerator(api.service.generators[gType]);
      }
    }
  });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
