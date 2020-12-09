<template>
  <div id="app">
    <div id="nav">
      <h1>MAIN-VUE</h1>
      <h2>qiankun global variables test</h2>
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> | -->
      <router-link to="/child-app-1">child-app-1</router-link> |
      <router-link to="/child-app-2">child-app-2</router-link>
    </div>
    <div class="main-conf">
      <h2>window.CHILD_APP_NAME_TEST : {{CHILD_APP_NAME_TEST}}</h2>
      <!-- <h2>main-vue</h2>
      <button primary @click="modifyConf">修改配置数据</button>
      <input v-model="address" />
      <p>conf.baseURL -> {{ conf.baseURL }}</p>
      <p>conf.appId -> {{ conf.appId }}</p> -->
    </div>
    <router-view />
  </div>
</template>


<script>
export default {
  name: "MainApp",
  data() {
    return {
      CHILD_APP_NAME_TEST,
      // address: "",
      // conf: V.conf,
      // visible: false
    };
  },
  methods: {
    modifyConf() {
      const { address } = this;
      V.conf.setState({
        baseURL: address
      });
      if (!Object.prototype.hasOwnProperty.call(V.conf, "Authorization")) {
        V.conf.add("Authorization", `Bearer ${address}`);
      }
      localStorage.setItem('NAME','main-vue');
      V.ajax({
        method: "POST",
        url: "/api/example/route/" + address,
        data: {
          data: { module: "common", action: "get_UTC_time" },
          game_id: 104
        },
        headers: {
          Token: V.conf.Authorization
        }
      });
    }
  }
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.main-conf{
  border: 10px groove lightblue;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
