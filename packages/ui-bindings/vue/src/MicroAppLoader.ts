import { defineComponent, h } from 'vue-demi';

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },

  render() {
    return h('div', this.loading ? 'loading...' : '');
  },
});
