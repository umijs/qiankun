import { defineComponent, h } from 'vue';

export default defineComponent({
  props: {
    error: {
      type: Error,
      default: undefined,
    },
  },
  setup(props) {
    return () => h('div', [props.error?.message]);
  },
});
