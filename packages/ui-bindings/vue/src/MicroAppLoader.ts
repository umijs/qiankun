import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    return () => (props.loading ? 'loading...' : null);
  },
});
