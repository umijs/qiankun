import { defineComponent, h } from 'vue-demi';

export default defineComponent({
  props: {
    error: {
      type: Error,
      default: undefined,
    },
  },
  render() {
    return h('div', this.error?.message);
  },
});
