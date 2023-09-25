const fs = require('fs');
const path = require('path');

// 获取当前工作目录
const projectRoot = process.cwd();
// 构建项目的package.json文件的路径
const packageJsonPath = path.join(projectRoot, 'package.json');
// 读取并解析package.json文件内容
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

class QiankunPlugin {
  constructor(options = {}) {
    // 设置包名，如果未提供，则使用package.json中的名称
    this.packageName = options.packageName || packageJson.name;
  }

  // apply方法是Webpack插件的核心，它接受一个compiler对象
  apply(compiler) {
    // 设置输出库的名称
    compiler.options.output.library = `${this.packageName}`;
    // 设置输出格式为UMD
    compiler.options.output.libraryTarget = 'umd';
    // 设置jsonp函数的名称，以确保它是唯一的
    compiler.options.output.jsonpFunction = `webpackJsonp_${this.packageName}`;

    compiler.options.output.globalObject = 'window';
    // 设置全局的chunk加载函数名称
    compiler.options.output.chunkLoadingGlobal = `webpackJsonp_${this.packageName}`;
  }
}

module.exports = QiankunPlugin;
