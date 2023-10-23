### 本地调试脚手架

1. 打包 `cli`

```shell
pnpm run build
```

2. 在 `create-qiankun` 借助 `pnpm` 的 `link` 功能，将 `cli` 链接到全局， **`pnpm`** 而不是 `npm`

```shell
pnpm link -g
```

1. 在任意目录执行 `create-qiankun`
