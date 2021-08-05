<template>
  <div class="hello-content">
    <h1>{{ msg }}</h1>
    <p>Vue version: {{ version }}</p>
  </div>
</template>

<script>
import { onMounted, onBeforeUpdate, getCurrentInstance, version } from 'vue';

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },

  data() {
    return {
      nameColor: 'orange',
    };
  },

  setup() {
    const { ctx } = getCurrentInstance();

    const changeGlobalState = () => {
      if (ctx.$setGlobalState) {
        console.log('此处可设置全局state');
        // ctx.$setGlobalState({name: 'chaunjie'})
      }
    };

    onMounted(() => {
      console.log('mounted');
    });

    onBeforeUpdate(() => {
      console.log('beforeUpdate');
    });

    return {
      changeGlobalState,
      version,
    };
  },
};
</script>

<style>
.name {
  color: v-bind(nameColor);
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
h1 {
  color: #64b587;
}
</style>
