<template>
  <div id="root">
    <div id="nav">
      <nav>
        <ol>
          <li><a @click="goto('vue sub-app1', '/sub-app1')">子应用一</a></li>
          <li><a @click="goto('vue sub-app2', '/sub-app2')">子应用二</a></li>
        </ol>
      </nav>
    </div>
    <!--<div v-if="loading">loading</div>-->
    <div id="router-view" v-html="content"></div>
  </div>
</template>

<script>
export default {
  name: 'framework',
  props: {
    // loading: Boolean,
    content: String,
  },
  methods: {
    // goto(title, href) {
    //   this.$router.push(href)
    // },
    goto(title, href) {
      console.log('title', title, 'href', href);
      window.history.pushState({}, title, href);
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  a {
    cursor: pointer;
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
