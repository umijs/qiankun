---
nav:
  title: Tutorial
toc: menu
---

# Tutorial

## How to choose the routing mode of micro app

The three routes `react-router`, `angular-router`, and `vue-router` all support the `hash` and `history` modes. The different modes used by micro apps are slightly different in `qiankun`.

### `activeRule` uses `location.pathname` to distinguish micro apps

When the main app uses `location.pathname` to distinguish micro apps, micro apps can be in `hash` and `history` modes.

When registering micro apps, `activeRule` needs to be written like this:

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

1. When the micro app is in `history` mode, just set the route `base`.

2. When the micro app is in the `hash` mode, the performance of the three routes is inconsistent

   | routing        | main app jump `/app/#/about`   | special configuration     |
   | -------------- | ------------------------------ | ------------------------- |
   | vue-router     | Response `about` routing       | none                      |
   | react-router   | not responding `about` routing | none                      |
   | angular-router | Response `about` routing       | need to set `--base-href` |

   `Angular` app set `--base-href` in `package.json`:

   ```diff
   - "start": "ng serve",
   + "start": "ng serve --base-href /angular9",
   - "build": "ng build",
   + "build": "ng build --base-href /angular9",
   ```

   After bundled and deployed, the `angular` micro app can be accessed by the main app, but the lazy-loaded route during independent access will report an error and the path is incorrect. There are two solutions:

   - Solution 1: Modify `public-path.js` to:

     ```js
     __webpack_public_path__ = window.__POWERED_BY_QIANKUN__
       ? window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__
       : `http://${ip}:${port}/`; // Fill in your actual deployment address
     ```

   - Solution 2: Modify the bundling command and deploy the micro app in the `angular9` directory:

     ```diff
     - "build": "ng build",
     + "build": "ng build --base-href /angular9 --deploy-url /angular9/",
     ```

### activeRule uses hash to distinguish micro apps

When the micro apps are all in the `hash` mode, `hash` can be used to distinguish the micro apps, and the routing mode of the main app is not limited.

When registering micro apps, `activeRule` needs to be written like this:

```js
const getActiveRule = (hash) => (location) => location.hash.startsWith(hash);
registerMicroApps([
  {
    name: 'app-hash',
    entry: 'http://localhost:8080',
    container: '#container',
    activeRule: getActiveRule('#/app-hash'),
    // Here you can also write `activeRule:'#/app-hash'` directly,
    // but if the main app is in history mode or the main app is deployed in a non-root directory, this writing will not take effect.
  },
]);
```

The `react-router` and `angular-router` micro-apps need to set the value of `activeRule` to the route's `base`, written in the same way as `history`.

In the `hash` mode of the `vue-router` app, the `base` for routing is not supported. You need to create an additional empty routing page and use all other routes as its children:

```js
const routes = [
  {
    path: '/app-vue-hash',
    name: 'Home',
    component: Home,
    children: [
      // All other routes are written here
    ],
  },
];
```

### When there are multiple micro apps at the same time

If a page displays multiple micro apps at the same time, you need to use `loadMicroApp` to load them.

If these micro apps have routing jump requirements, to ensure that these routes do not interfere with each other, you need to use the `momery` routing. `vue-router` uses the `abstract` mode, `react-router` uses the `memory history` mode, and `angular-router` does not support it.

## How to deploy

**Recommendation**: The main app and micro apps are developed and deployed independently, that is, they belong to different git repositories and services.

### Scenario 1: The main app and micro apps are deployed to the same server (the same IP and port)

If the number of servers is limited, or cannot be cross-domain and other reasons, the main app and micro apps need to be deployed together.

The usual practice is to deploy the main app in the first-level directory and the micro apps in the second/third-level directory.

If you want to deploy a micro app in a non-root directory, you need to do two things before bundling the micro app:

1. You must configure the `publicPath` when building `webpack` as the **directory name**. For more information, please see [webpack official instructions](https://webpack.js.org/configuration/output/#outputpublicpath) 和 [vue-cli3 official instructions](https://cli.vuejs.org/config/#publicpath).

2. The micro app of the `history` route needs to set the `base`, the value is **directory name**, which is used when the micro app is accessed independently.

Pay attention to three points after deployment:

1. `activeRule` cannot be the same as **the real access path of the micro app**, otherwise it will directly become the micro app page when refreshed on the main app page.
2. The real access path of the micro app is the `entry` of the micro app, and the `entry` can be a relative path.
3. The `/` at the end of the `entry` path of the micro app cannot be omitted, otherwise the `publicPath` will be set incorrectly. For example, if the access path of the child item is `http://localhost:8080/app1`, then `entry` It is `http://localhost:8080/app1/`.

There are two specific deployment methods, choose one of them.

#### Solution 1: All micro apps are placed in a folder with a special name that do not have the same name as micro apps (**recommended**)

Suppose we have a main app and 6 micro apps ( respectively `vue-hash`, `vue-history`, `react-hash`, `react-history`, `angular-hash`, `angular-history`) And place it as follows after bundling:

```
└── html/                     # root folder
    |
    ├── child/                # the folder of all micro apps
    |   ├── vue-hash/         # the folder of the micro app `vue-hash`
    |   ├── vue-history/      # the folder of the micro app `vue-history`
    |   ├── react-hash/       # the folder of the micro app `react-hash`
    |   ├── react-history/    # the folder of the micro app `react-history`
    |   ├── angular-hash/     # the folder of the micro app `angular-hash`
    |   ├── angular-history/  # the folder of the micro app `angular-history`
    ├── index.html            # index.html of the main app
    ├── css/                  # the css folder of the main app
    ├── js/                   # the js folder of the main app
```

At this time, you need to set the `publicPath` and the route `base` of the `history` mode when the micro app is built, and then bundle them into the corresponding directory.

| app             | routing base            | publicPath              | real access path                             |
| --------------- | ----------------------- | ----------------------- | -------------------------------------------- |
| vue-hash        | none                    | /child/vue-hash/        | http://localhost:8080/child/vue-hash/        |
| vue-history     | /child/vue-history/     | /child/vue-history/     | http://localhost:8080/child/vue-history/     |
| react-hash      | none                    | /child/react-hash/      | http://localhost:8080/child/react-hash/      |
| react-history   | /child/react-history/   | /child/react-history/   | http://localhost:8080/child/react-history/   |
| angular-hash    | none                    | /child/angular-hash/    | http://localhost:8080/child/angular-hash/    |
| angular-history | /child/angular-history/ | /child/angular-history/ | http://localhost:8080/child/angular-history/ |

- `vue-history` micro app

  Routing's base configuration:

  ```js
  base: window.__POWERED_BY_QIANKUN__ ? '/app-vue/' : '/child/vue-history/',
  ```

  Webpack's publicPath configuration（`vue.config.js`）:

  ```js
  module.exports = {
    publicPath: '/child/vue-history/',
  };
  ```

- `react-history` micro app

  Routing's base configuration:

  ```html
  <BrowserRouter basename={window.__POWERED_BY_QIANKUN__ ? '/app-react' : '/child/react-history/'}>
  ```

  Webpack's publicPath configuration:

  ```js
  module.exports = {
    output: {
      publicPath: '/child/react-history/',
    },
  };
  ```

- `angular-history` micro app

  Routing's base configuration:

  ```js
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: window.__POWERED_BY_QIANKUN__ ? '/app-angular/' : '/child/angular-history/',
    },
  ];
  ```

  The `publicPath` of webpack is set by `deploy-url`, modify `package.json`:

  ```diff
  - "build": "ng build",
  + "build": "ng build --deploy-url /child/angular-history/",
  ```

Then the `registerMicroApps` function at this time is like this (you need to ensure that `activeRule` and `entry` are different):

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
  // angular and react same as above
],
```

So far, the main app and the micro apps can run normally, but the main app and the `vue-history`, `react-history`, and `angular-history` micro apps are `history` routes. The problem of refreshing 404 needs to be solved. nginx` also needs to be configured:

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
  # The configuration of angular-history and react-history is the same as above
}
```

#### Solution 2: Place the micro apps directly in the secondary directory, but set a special `activeRule`

```
└── html/                 # root folder
    |
    ├── vue-hash/         # the folder of the micro app `vue-hash`
    ├── vue-history/      # the folder of the micro app `vue-history`
    ├── react-hash/       # the folder of the micro app `react-hash`
    ├── react-history/    # the folder of the micro app `react-history`
    ├── angular-hash/     # the folder of the micro app `angular-hash`
    ├── angular-history/  # the folder of the micro app `angular-history`
    ├── index.html        # index.html of the main app
    ├── css/              # the css folder of the main app
    ├── js/               # the js folder of the main app
```

The basic operation is the same as above, just make sure that `activeRule` is different from the storage path name of the micro app.

### Scenario 2: The main app and micro apps are deployed on different servers and accessed through Nginx proxy

This is generally done because **the main app is not allowed to access micro apps across domains**. The practice is to forward all requests for a special path on the main app server to the micro app server, that is, a "micro app deployed on the main app server" effect is achieved through the proxy.

For example, the main app is on the A server, and the micro app is on the B server. The path `/app1` is used to distinguish the micro app, that is, all requests starting with `/app1` on the A server are forwarded to the B server.

the `Nginx` proxy configuration of the main app is：

```
/app1/ {
  proxy_pass http://www.b.com/app1/;
  proxy_set_header Host $host:$server_port;
}
```

When the main app registers micro apps, `entry` can be a relative path, and `activeRule` cannot be the same as `entry` (otherwise the main app page refreshes and becomes a micro app):

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

For micro apps bundled by `webpack`, the `publicPath` bundled by the micro app's `webpack` needs to be configured as `/app1/`, otherwise the micro app's `index.html` can be requested correctly, But the path of `js/css` in the micro app's `index.html` will not carry `/app1/`.

```js
module.exports = {
  output: {
    publicPath: `/app1/`,
  },
};
```

After adding `/app1/` to the `publicPath` of the micro app, it must be deployed in the `/app1` directory, otherwise it cannot be accessed independently.

In addition, if you don't want the micro app to be accessed independently through the proxy path, you can judge based on some information requested. The requesting micro app in the main app is requested with `fetch`, which can include parameters and `cookie`. For example, judge by request header parameters:

```js
if ($http_custom_referer != "main") {
  rewrite /index /404.html;
}
```

## Upgrade from 1.x version to 2.x version

The micro apps does not need to be changed, and the main app needs to be adjusted.

The basic modification of `registerMicroApps` function is as follows:

1. Remove the `render` parameter and only need to provide the container.
2. Add the `loader` parameter to display the `loading` status. Originally, the `loading` status was provided to the `render` parameter.
3. The `activeRule` parameter can be abbreviated as `/app`, which is compatible with the previous function writing.
4. The `RegisterMicroAppsOpts` parameter is removed and placed in the parameter of the `start` function.

The basic modification of the `start` function is as follows:

1. The `jsSandbox` configuration has been removed and changed to `sandbox`, and the optional values have also been modified.
2. Added `getPublicPath` and `getTemplate` to replace `RegisterMicroAppsOpts`.
