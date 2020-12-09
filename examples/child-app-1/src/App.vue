<template>
  <div id="app">
    <h1>child-app-1</h1>
    <h2>window.CHILD_APP_NAME_TEST : {{ CHILD_APP_NAME_TEST }}</h2>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      CHILD_APP_NAME_TEST: window.CHILD_APP_NAME_TEST,
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
  color: red;
}

#nav {
  padding-bottom: 20px;
}

#nav a {
  font-weight: bold;
  color: red;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: red;
}
</style>
