# 贡献指南

我们真的很高兴你有兴趣为 qiankun 贡献。在提交您的代码之前，请务必花点时间阅读以下指南:

### 1. 安装 Node.js 和 pnpm

前往 <https://nodejs.org/> 下载并安装适合你的操作系统的最新稳定版本。安装 pnpm: <https://pnpm.io/installation>

### 2. 分叉并签出你自己的仓库

进入 <https://github.com/umjs/qiankun>，点击“Fork”按钮。然后按照 [GitHub 文档](https://help.github.com/articles/fork-a-repo)进行分叉和克隆。

克隆自己的分叉：

```shell
git clone https://github.com/<你的 Github 用户名>/qiankun
```

在克隆仓库后，需要运行 `pnpm install` 以获得所有必要的依赖。

```shell
cd qiankun
pnpm install
```

此步骤必须连接网络。它需要下载很多依赖。

**注意**：每次从主仓库拉取代码后都重新运行 `pnpm install` 有助于确保使用最新的开发依赖。

### 3. 更改代码 & 补充/更新测试用例

测试代码位于 `__tests__/`，测试框架采用 [vitest](https://vitest.dev/)。

### 4. 执行测试

提交代码前请确保测试任务通过✅。

```shell
pnpm run ci
```

### 5. 提交变更

qiankun 使用 [conventional commits](https://www.conventionalcommits.org/)。

### 6. 执行 changeset （可选）

如果你的更改包含功能性变更，请执行：

```shell
pnpm changeset
```

qiankun 遵循[语义化版本](https://semver.org/)，根据你的变更类型选择相对应的类型：

- major: 不兼容的API更改
- minor: 向后兼容的方式添加功能
- patch: 向后兼容的错误修复

### 7. 提交 pull request
