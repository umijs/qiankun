import 'core-js/modules/es.symbol'
import "./public-path";
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import routes from "./router";
import store from "./store";

Vue.config.productionTip = false;

// Vue.use(ElementUI);

let router = null;
let instance = null;

function render(props = {}) {

  const { container, baseRouter = '/child-app-1/' } = props;
  router = new VueRouter({
    base: window.__POWERED_BY_QIANKUN__ ? baseRouter : "/",
    mode: "hash",
    routes
  });

  instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount(container ? container.querySelector("#app") : "#app");
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}

function storeTest(props) {
  props.onGlobalStateChange &&
    props.onGlobalStateChange(
      (value, prev) =>
        console.log(`[[获取到的数据] - ${props.name}]:`, value, prev),
      true
    );
  props.setGlobalState &&
    props.setGlobalState({
      ignore: props.name,
      user: {
        name: props.name
      }
    });
}

export async function bootstrap() {
  console.log("[vue] vue app bootstraped");
}

export async function mount(props) {
  console.log("[vue] props from main framework", props);
  storeTest(props);
  render(props);
}

export async function unmount() {
  instance.$destroy();
  instance.$el.innerHTML = "";
  instance = null;
  router = null;
  // V = null;
}

V.ajax.requestConfig = config => {
  console.log(`requestConfig baseURL:   ${V.conf.baseURL}`);
  config.baseURL = V.conf.baseURL;
  config.headers["Authorization"] = V.conf.Authorization;
  return config;
};

V.ajax.requestError = err => {
  return Promise.reject(err);
};

// response
V.ajax.responseRes = response => {
  const { state, msg } = response.data;
  alert(msg);
  if (state !== 0) {
    // notification.error({
    //   message: "请求失败",
    //   description: msg
    // });
  }
  return response.data;
};

V.ajax.responseError = err => {
  return Promise.reject(err);
};
