<template>
  <div class="hello">
    <p>About page query id is: {{ query.id }}</p>
    Clicked: {{ count }} times, count is {{ evenOrOdd }}.
    <button @click="increment">+</button>
    <button @click="decrement">-</button>
    <button @click="incrementIfOdd">Increment if odd</button>
    <button @click="incrementAsync">Increment async</button>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'About',
  setup() {
    const store = useStore();
    const route = useRoute();

    return {
      count: computed(() => store.state.count.count),
      evenOrOdd: computed(() => store.getters['count/evenOrOdd']),
      increment: () => store.dispatch('count/increment'),
      decrement: () => store.dispatch('count/decrement'),
      incrementIfOdd: () => store.dispatch('count/incrementIfOdd'),
      incrementAsync: () => store.dispatch('count/incrementAsync'),
      query: route.query,
    };
  },
};
</script>

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
