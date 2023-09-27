const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: false,
  lintOnSave: "warning",
  devServer: {
    port: "7890",
    open: true,
  },
});
