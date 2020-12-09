<template>
  <div id="app">
    <h1>CHILD-APP 2</h1>
    <em> 当前应用无 CHILD_APP_NAME_TEST 变量，向上级主应用查找 </em>
    <h2>window.CHILD_APP_NAME_TEST : {{CHILD_APP_NAME_TEST}}</h2>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      CHILD_APP_NAME_TEST: window.CHILD_APP_NAME_TEST
    };
  },
  computed: {},
  methods: {
    clickPush(path) {
      this.$router.push({
        path,
      });
    },
  },
};
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: green;
}

#nav {
  padding-bottom: 20px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
