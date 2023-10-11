---
nav:
  title: 入门教程
toc: menu
---

# 入门教程

## 微应用的路由模式如何选择

`react-router`，`angular-router`，`vue-router` 这三种路由，都支持 `hash` 和 `history` 模式，微应用使用不同的模式在 `qiankun` 中略有差别。

### `activeRule` 使用 `location.pathname` 区分微应用

主应用使用 `location.pathname` 来区分微应用时，微应用可以是 `hash` 和 `history` 模式。

注册微应用时 `activeRule` 这样写即可：

```js
registerMicroApps([
  {
    name: 'app',
    entry: 'http://localhost:8080',
    container: '#container',
    activeRule: '/app',
  },
]);
```

1. 当微应用是 `history` 模式时，设置路由 `base` 即可

2. 当微应用是 `hash` 模式时，三种路由的表现不一致

   | 路由           | 主应用跳转/app/#/about | 特殊配置             |
   | -------------- | ---------------------- | -------------------- |
   | vue-router     | 响应 about 路由        | 无                   |
   | react-router   | 不响应 about 路由      | 无                   |
   | angular-router | 响应 about 路由        | 需要设置 --base-href |

   `angular` 应用在 `package.json` 里面设置 `--base-href`：

   ```diff
   - "start": "ng serve",
   + "start": "ng serve --base-href /angular9",
   - "build": "ng build",
   + "build": "ng build --base-href /angular9",
   ```

   打包部署后，`angular` 微应用可以被主应用访问。但是独立访问时，懒加载的路由会报错，路径不正确。这里有两个解决办法：

   - 方法 1：修改 `public-path.js` 为：

     ```js
     __webpack_public_path__ = window.__POWERED_BY_QIANKUN__
       ? window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
       : `http://${ip}:${port}/`; // 填写你的实际部署地址
     ```

   - 方法 2：修改打包命令，并且将微应用部署在 `angular9` 目录：

     ```diff
     - "build": "ng build",
     + "build": "ng build --base-href /angular9 --deploy-url /angular9/",
     ```

### `activeRule` 使用 `location.hash` 区分微应用

当微应用都是 `hash` 模式时可以使用 `hash` 区分微应用，主应用的路由模式不限。

注册微应用时 `activeRule` 需要这样写：

```js
const getActiveRule = (hash) => (location) => location.hash.startsWith(hash);
registerMicroApps([
  {
    name: 'app-hash',
    entry: 'http://localhost:8080',
    container: '#container',
    activeRule: getActiveRule('#/app-hash'),
    // 这里也可以直接写 activeRule: '#/app-hash'，但是如果主应用是 history 模式或者主应用部署在非根目录，这样写不会生效。
  },
]);
```

`react-router` 和 `angular-router` 微应用需要设置 `activeRule` 的值为路由的 `base` ，写法同 `history` 模式。

`vue-router` 的 `hash` 模式下不支持设置路由的 `base`，需要额外新建一个空的路由页面，将其他所有路由都作为它的 `children`：

```js
const routes = [
  {
    path: '/app-vue-hash',
    name: 'Home',
    component: Home,
    children: [
      // 其他的路由都写到这里
    ],
  },
];
```

### 同时存在多个微应用时

如果一个页面同时展示多个微应用，需要使用 `loadMicroApp` 来加载。

如果这些微应用都有路由跳转的需求，要保证这些路由能互不干扰，需要使用 `momery` 路由。`vue-router` 使用 `abstract` 模式，`react-router` 使用 `memory history` 模式，`angular-router` 不支持。

## 如何部署

**建议**：主应用和微应用都是独立开发和部署，即它们都属于不同的仓库和服务。

### 场景 1：主应用和微应用部署到同一个服务器（同一个 IP 和端口）

如果服务器数量有限，或不能跨域等原因需要把主应用和微应用部署到一起。

通常的做法是主应用部署在一级目录，微应用部署在二/三级目录。

微应用想部署在非根目录，在微应用打包之前需要做两件事：

1. 必须配置 `webpack` 构建时的 `publicPath` 为**目录名称**，更多信息请看 [webpack 官方说明](https://www.webpackjs.com/configuration/output/#output-publicpath) 和 [vue-cli3 的官方说明](https://cli.vuejs.org/zh/config/#publicpath)

2. `history` 路由的微应用需要设置 `base` ，值为**目录名称**，用于独立访问时使用。

部署之后注意三点：

1. `activeRule` 不能和**微应用的真实访问路径一样**，否则在主应用页面刷新会直接变成微应用页面。
2. 微应用的真实访问路径就是微应用的 `entry`，`entry` 可以为相对路径。
3. 微应用的 `entry` 路径最后面的 `/` 不可省略，否则 `publicPath` 会设置错误，例如子项的访问路径是 `http://localhost:8080/app1`,那么 `entry` 就是 `http://localhost:8080/app1/`。

具体的部署有以下两种方式，选择其一即可。

#### 方案 1：微应用都放在在一个特殊名称（**不会和微应用重名**）的文件夹下（**建议使用**）

假设我们有一个主应用和 6 个微应用（分别为 `vue-hash`、`vue-history`、`react-hash`、`react-history`、`angular-hash`、`angular-history` ），打包后如下放置：

```
└── html/                     # 根文件夹
    |
    ├── child/                # 存放所有微应用的文件夹
    |   ├── vue-hash/         # 存放微应用 vue-hash 的文件夹
    |   ├── vue-history/      # 存放微应用 vue-history 的文件夹
    |   ├── react-hash/       # 存放微应用 react-hash 的文件夹
    |   ├── react-history/    # 存放微应用 react-history 的文件夹
    |   ├── angular-hash/     # 存放微应用 angular-hash 的文件夹
    |   ├── angular-history/  # 存放微应用 angular-history 的文件夹
    ├── index.html            # 主应用的index.html
    ├── css/                  # 主应用的css文件夹
    ├── js/                   # 主应用的js文件夹
```

此时需要设置微应用构建时的 `publicPath` 和 `history` 模式的路由 `base`，然后才能打包放到对应的目录里。

| 项目            | 路由 base               | publicPath              | 真实访问路径                                 |
| --------------- | ----------------------- | ----------------------- | -------------------------------------------- |
| vue-hash        | 无                      | /child/vue-hash/        | http://localhost:8080/child/vue-hash/        |
| vue-history     | /child/vue-history/     | /child/vue-history/     | http://localhost:8080/child/vue-history/     |
| react-hash      | 无                      | /child/react-hash/      | http://localhost:8080/child/react-hash/      |
| react-history   | /child/react-history/   | /child/react-history/   | http://localhost:8080/child/react-history/   |
| angular-hash    | 无                      | /child/angular-hash/    | http://localhost:8080/child/angular-hash/    |
| angular-history | /child/angular-history/ | /child/angular-history/ | http://localhost:8080/child/angular-history/ |

- vue-history 微应用

  路由设置：

  ```js
  base: window.__POWERED_BY_QIANKUN__ ? '/app-vue-history/' : '/child/vue-history/',
  ```

  webpack 打包 publicPath 配置（`vue.config.js`）：

  ```js
  module.exports = {
    publicPath: '/child/vue-history/',
  };
  ```

- react-history 微应用

  路由设置：

  ```html
  <BrowserRouter basename={window.__POWERED_BY_QIANKUN__ ? '/app-react-history' : '/child/react-history/'}>
  ```

  webpack 打包 publicPath 配置：

  ```js
  module.exports = {
    output: {
      publicPath: '/child/react-history/',
    },
  };
  ```

- angular-history 微应用

  路由设置：

  ```js
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: window.__POWERED_BY_QIANKUN__ ? '/app-angular-history/' : '/child/angular-history/',
    },
  ];
  ```

  webpack 打包的 `publicPath` 通过 `deploy-url` 来修改，修改 `package.json`：

  ```diff
  - "build": "ng build",
  + "build": "ng build --deploy-url /child/angular-history/",
  ```

那么此时的注册函数是这样的（需要保证 `activeRule` 和 `entry` 不同）：

```js
registerMicroApps([
  {
    name: 'app-vue-hash',
    entry: '/child/vue-hash/', // http://localhost:8080/child/vue-hash/
    container: '#container',
    activeRule: '/app-vue-hash',
  },
  {
    name: 'app-vue-history',
    entry: '/child/vue-history/', // http://localhost:8080/child/vue-history/
    container: '#container',
    activeRule: '/app-vue-history',
  },
  // angular 和 react 同上
],
```

至此主应用已经和微应用都能跑起来了，但是主应用和 `vue-history`、`react-history`、`angular-history` 微应用是 `history` 路由，需要解决刷新 404 的问题，`nginx` 还需要配置一下：

```conf
server {
  listen       8080;
  server_name  localhost;

  location / {
    root   html;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }

  location /child/vue-history {
    root   html;
    index  index.html index.htm;
    try_files $uri $uri/ /child/vue-history/index.html;
  }
  # angular 和 react 的history 配置同上
}
```

#### 方案 2：微应用直接放在二级目录，但是设置特殊的 `activeRule`

```
└── html/                     # 根文件夹
    |
    ├── vue-hash/             # 存放微应用 vue-hash 的文件夹
    ├── vue-history/          # 存放微应用 vue-history 的文件夹
    ├── react-hash/           # 存放微应用 react-hash 的文件夹
    ├── react-history/        # 存放微应用 react-history 的文件夹
    ├── angular-hash/         # 存放微应用 angular-hash 的文件夹
    ├── angular-history/      # 存放微应用 angular-history 的文件夹
    ├── index.html            # 主应用的index.html
    ├── css/                  # 主应用的css文件夹
    ├── js/                   # 主应用的js文件夹
```

基本操作和上面是一样的，只要保证 `activeRule` 和微应用的存放路径名不一样即可。

### 场景 2：主应用和微应用部署在不同的服务器，使用 Nginx 代理访问

一般这么做是因为**不允许主应用跨域访问微应用**，做法就是将主应用服务器上一个特殊路径的请求全部转发到微应用的服务器上，即通过代理实现“微应用部署在主应用服务器上”的效果。

例如，主应用在 A 服务器，微应用在 B 服务器，使用路径 `/app1` 来区分微应用，即 A 服务器上所有 `/app1` 开头的请求都转发到 B 服务器上。

此时主应用的 `Nginx` 代理配置为：

```
/app1/ {
  proxy_pass http://www.b.com/app1/;
  proxy_set_header Host $host:$server_port;
}
```

主应用注册微应用时，`entry` 可以为相对路径，`activeRule` 不可以和 `entry` 一样（否则主应用页面刷新就变成微应用）：

```js
registerMicroApps([
  {
    name: 'app1',
    entry: '/app1/', // http://localhost:8080/app1/
    container: '#container',
    activeRule: '/child-app1',
  },
],
```

对于 `webpack` 构建的微应用，微应用的 `webpack` 打包的 `publicPath` 需要配置成 `/app1/`，否则微应用的 `index.html` 能正确请求，但是微应用 `index.html` 里面的 `js/css` 路径不会带上 `/app1/`。

```js
module.exports = {
  output: {
    publicPath: `/app1/`,
  },
};
```

微应用打包的 `publicPath` 加上 `/app1/` 之后，必须部署在 `/app1` 目录，否则无法独立访问。

另外，如果不想微应用通过代理路径被独立访问，可以根据请求的一些信息判断下，主应用中请求微应用是用 `fetch` 请求的，可以带参数和 `cookie`。例如通过请求头参数判断：

```js
if ($http_custom_referer != "main") {
  rewrite /index /404.html;
}
```

## 从 1.x 版本升级到 2.x 版本

微应用无需改动，主应用需要做一些调整。

`registerMicroApps` 函数基本修改如下：

1. 去掉 `render` 参数，只需要提供容器 `container` 即可。
2. 增加 `loader` 参数，用于展示 `loading` 状态，原本 `loading` 状态是提供给 `render` 参数的。
3. `activeRule` 参数可以简写为 `/app`，兼容之前的函数写法。
4. `RegisterMicroAppsOpts` 参数去掉了，放在了 `start` 函数的参数里面。

`start` 函数基本修改如下：

1. `jsSandbox` 配置去掉，改为 `sandbox` ，可选值也修改了。
2. 新增了 `getPublicPath` 和 `getTemplate` ，用于替代`RegisterMicroAppsOpts`。
