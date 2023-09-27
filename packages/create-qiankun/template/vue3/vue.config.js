const { defineConfig } = require("@vue/cli-service");

const packageName = require("./package.json").name;

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: "warning",
  devServer: {
    port: "7891",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  configureWebpack: {
    output: {
      library: `${packageName}-[name]`,
      libraryTarget: "umd",
      chunkLoadingGlobal: `webpackJsonp_${packageName}`,
    },
  },
});
