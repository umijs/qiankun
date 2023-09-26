import * as fs from 'fs';
import * as path from 'path';
import { Compiler, Configuration } from 'webpack';

// 获取当前工作目录
const projectRoot: string = process.cwd();
// 构建项目的package.json文件的路径
const packageJsonPath: string = path.join(projectRoot, 'package.json');
// 读取并解析package.json文件内容
const packageJson: { name?: string } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

interface QiankunPluginOptions {
  packageName?: string;
}

class QiankunPlugin {
  private packageName: string;

  constructor(options: QiankunPluginOptions = {}) {
    // 设置包名，如果未提供，则使用package.json中的名称
    this.packageName = options.packageName || packageJson.name || '';
  }

  apply(compiler: Compiler): void {

    const webpackCompilerOptions = compiler.options as Configuration & { output: { jsonpFunction?: string } };
    // 设置输出库的名称
    webpackCompilerOptions.output.library = `${this.packageName}`;
    // 设置输出格式为UMD
    webpackCompilerOptions.output.libraryTarget = 'umd';
    // 设置jsonp函数的名称，以确保它是唯一的
    webpackCompilerOptions.output.jsonpFunction = `webpackJsonp_${this.packageName}`;
  
    webpackCompilerOptions.output.globalObject = 'window';
    // 设置全局的chunk加载函数名称
    webpackCompilerOptions.output.chunkLoadingGlobal = `webpackJsonp_${this.packageName}`;
  }
}

module.exports = QiankunPlugin;
