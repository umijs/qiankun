# 应用间通信

在开始介绍 `qiankun` 的应用通信之前，我们需要先了解微前端架构如何划分微应用。

在微前端架构中，我们应该按业务划分出对应的微应用，而不是通过功能模块划分微应用。这么做的原因有两个：

1. 在微前端架构中，微应用并不是一个模块，而是一个独立的应用，我们将微应用按业务划分可以拥有更好的可维护性和解耦性。
2. 微应用应该具备独立运行的能力，应用间频繁的通信会增加应用的复杂度和耦合度。

综上所述，我们应该从业务的角度出发划分各个微应用，尽可能减少应用间的通信，从而简化整个应用，使得我们的微前端架构可以更加灵活可控。

## 通信原理

`qiankun` 内部提供了 `initGlobalState` 方法用于注册 `MicroAppStateActions` 实例用于通信，该实例有三个方法，分别是：

- `setGlobalState`：设置 `globalState` - 设置新的值时，内部将执行 `浅检查`，如果检查到 `globalState` 发生改变则触发通知，通知到所有的 `观察者` 函数。
- `onGlobalStateChange`：注册 `观察者` 函数 - 响应 `globalState` 变化，在 `globalState` 发生改变时触发该 `观察者` 函数。
- `offGlobalStateChange`：取消 `观察者` 函数 - 该实例不再响应 `globalState` 变化。

我们来画一张图来帮助大家理解（见下图）

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/qiankun_practice/3.png)

我们从上图可以看出，我们可以先注册 `观察者` 到观察者池中，然后通过修改 `globalState` 可以触发所有的 `观察者` 函数，从而达到组件间通信的效果。

## 主应用的工作

我们以 [实战案例 - feature-communication 分支](https://github.com/a1029563229/micro-front-template/tree/feature-communication) （案例是以 `Vue` 为基座的主应用，接入 `React` 和 `Vue` 两个微应用） 为例，来介绍一下如何使用 `qiankun` 完成应用间的通信功能。

> 建议 `clone` [实战案例 - feature-communication 分支](https://github.com/a1029563229/micro-front-template/tree/feature-communication) 分支代码到本地，运行项目查看实际效果。

首先，我们在主应用中注册一个 `MicroAppStateActions` 实例并导出，代码实现如下：

```ts
// micro-app-main/src/shared/actions.ts
import { initGlobalState, MicroAppStateActions } from "qiankun";

const initialState = {};
const actions: MicroAppStateActions = initGlobalState(initialState);

export default actions;
```

在注册 `MicroAppStateActions` 实例后，我们在需要通信的组件中使用该实例，并注册 `观察者` 函数，我们这里以登录功能为例，实现如下：

```ts
// micro-app-main/src/pages/login/index.vue
import actions from "@/shared/actions";
import { ApiLoginQuickly } from "@/apis";

@Component
export default class Login extends Vue {
  $router!: VueRouter;

  // `mounted` 是 Vue 的生命周期钩子函数，在组件挂载时执行
  mounted() {
    // 注册一个观察者函数
    actions.onGlobalStateChange((state, prevState) => {
      // state: 变更后的状态; prevState: 变更前的状态
      console.log("主应用观察者：token 改变前的值为 ", prevState.token);
      console.log("主应用观察者：登录状态发生改变，改变后的 token 的值为 ", state.token);
    });
  }
  
  async login() {
    // ApiLoginQuickly 是一个远程登录函数，用于获取 token，详见 Demo
    const result = await ApiLoginQuickly();
    const { token } = result.data.loginQuickly;

    // 登录成功后，设置 token
    actions.setGlobalState({ token });
  }
}
```

在上面的代码中，我们在 `Vue 组件` 的 `mounted` 生命周期钩子函数中注册了一个 `观察者` 函数，然后定义了一个 `login` 方法，最后将 `login` 方法绑定在下图的按钮中（见下图）。

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/caddy/7.png)

此时我们点击 `2` 次按钮，将触发我们在主应用设置的 `观察者` 函数（如下图）

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/caddy/8.png)

从上图中我们可以看出：
  - 第一次点击：原 `token` 值为 `undefined`，新 `token` 值为我们最新设置的值；
  - 第二次点击时：原 `token` 的值是我们上一次设置的值，新 `token` 值为我们最新设置的值；
 
从上面可以看出，我们的 `globalState` 更新成功啦！

最后，我们在 `login` 方法最后加上一行代码，让我们在登录后跳转到主页，代码实现如下：

```ts
async login() {
  //...

  this.$router.push("/");
}
```

## 微应用的工作

我们已经完成了主应用的登录功能，将 `token` 信息记录在了 `globalState` 中。现在，我们进入微应用，使用 `token` 获取用户信息并展示在页面中。

我们首先来改造我们的 `Vue` 微应用，首先我们设置一个 `Actions` 实例，代码实现如下：

```js
// micro-app-vue/src/shared/actions.js
function emptyAction() {
  // 警告：提示当前使用的是空 Action
  console.warn("Current execute action is empty!");
}

class Actions {
  // 默认值为空 Action
  actions = {
    onGlobalStateChange: emptyAction,
    setGlobalState: emptyAction
  };
  
  /**
   * 设置 actions
   */
  setActions(actions) {
    this.actions = actions;
  }

  /**
   * 映射
   */
  onGlobalStateChange(...args) {
    return this.actions.onGlobalStateChange(...args);
  }

  /**
   * 映射
   */
  setGlobalState(...args) {
    return this.actions.setGlobalState(...args);
  }
}

const actions = new Actions();
export default actions;
```

我们创建 `actions` 实例后，我们需要为其注入真实 `Actions`。我们在入口文件 `main.js` 的 `render` 函数中注入，代码实现如下：

```js
// micro-app-vue/src/main.js
//...

/**
 * 渲染函数
 * 主应用生命周期钩子中运行/微应用单独启动时运行
 */
function render(props) {
  if (props) {
    // 注入 actions 实例
    actions.setActions(props);
  }

  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? "/vue" : "/",
    mode: "history",
    routes,
  });

  // 挂载应用
  instance = new Vue({
    router,
    render: (h) => h(App),
  }).$mount("#app");
}
```

从上面的代码可以看出，挂载微应用时将会调用 `render` 方法，我们在 `render` 方法中将主应用的 `actions` 实例注入即可。

最后我们在微应用的 `通讯页` 获取 `globalState` 中的 `token`，使用 `token` 来获取用户信息，最后在页面中显示用户信息。代码实现如下：

```js
// micro-app-vue/src/pages/communication/index.vue
// 引入 actions 实例
import actions from "@/shared/actions";
import { ApiGetUserInfo } from "@/apis";

export default {
  name: "Communication",

  data() {
    return {
      userInfo: {}
    };
  },

  mounted() {
    // 注册观察者函数
    // onGlobalStateChange 第二个参数为 true，表示立即执行一次观察者函数
    actions.onGlobalStateChange(state => {
      const { token } = state;
      // 未登录 - 返回主页
      if (!token) {
        this.$message.error("未检测到登录信息！");
        return this.$router.push("/");
      }

      // 获取用户信息
      this.getUserInfo(token);
    }, true);
  },

  methods: {
    async getUserInfo(token) {
      // ApiGetUserInfo 是用于获取用户信息的函数
      const result = await ApiGetUserInfo(token);
      this.userInfo = result.data.getUserInfo;
    }
  }
};
```

从上面的代码可以看到，我们在组件挂载时注册了一个 `观察者` 函数并立即执行，从 `globalState/state` 中获取 `token`，然后使用 `token` 获取用户信息，最终渲染在页面中。

最后，我们来看看实际效果。我们从登录页面点击 `Login` 按钮后，通过菜单进入 `Vue 通讯页`，就可以看到效果啦！（见下图）

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/caddy/9.png)

`React` 微应用的实现也是类似的，实现代码可以参照 [完整 Demo - feature-communication 分支](https://github.com/a1029563229/micro-front-template/tree/feature-communication)，实现效果如下（见下图）

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/caddy/10.png)

## 小结

到这里，`qiankun` 应用间通信就完成了！

我们在主应用中实现了登录功能，登录拿到 `token` 后存入 `globalState` 状态池中。在进入微应用时，我们使用 `actions` 获取 `token`，再使用 `token` 获取到用户信息，完成页面数据渲染！

最后我们画一张图帮助大家理解这个流程（见下图）。

![micro-app](http://shadows-mall.oss-cn-shenzhen.aliyuncs.com/images/blogs/caddy/11.png)