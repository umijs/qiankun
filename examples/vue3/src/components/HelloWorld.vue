<template>
  <div class="hello">
    <div>
      <button @click="changeGlobalState">更改GlobalState</button>
    </div>
    <div>
      <button @click="doEmit">组件事件回调</button>
    </div>
    <div>
      <button @click="pageTo">切换页面</button>
    </div>
    <slot name="tips" />
  </div>
</template>

<script>
import { onMounted, onBeforeUpdate, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';

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

  setup(props, context) {
    const router = useRouter();
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

    const pageTo = () => {
      router.push({
        name: 'about',
        query: {
          id: 'SD20200920',
        },
      });
    };

    return {
      pageTo,
      changeGlobalState,
      doEmit: () => context.emit('close'),
    };
  },
};
</script>

<style vars="{nameColor}">
.name {
  color: var(--nameColor);
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
</style>
