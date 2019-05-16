<template>
  <div class="app">
    hello {{ framework }}
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        framework: 'vue',
      };
    },
  };
</script>

<style scoped>
  .app {
    color: bisque;
  }
</style>
