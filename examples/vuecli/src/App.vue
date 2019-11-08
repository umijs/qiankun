<template>
  <div id="app">
    <div id="nav">
      <h1>我是子应用一，sub-app1</h1>
        <router-link to="/sub-app1">子应用一:首页dsds</router-link> |||
        <router-link to="/sub-app1/about">子应用一:about页面</router-link>
    </div>
    <router-view/>
  </div>
</template>

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
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
