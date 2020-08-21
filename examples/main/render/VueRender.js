import Vue from 'vue/dist/vue.esm';

function vueRender({ loading }) {
  return new Vue({
    template: `
      <div id="subapp-container">
        <h4 v-if="loading" class="subapp-loading">Loading...</h4>
        <div id="subapp-viewport"></div>
      </div>
    `,
    el: '#subapp-container',
    data() {
      return {
        loading,
      };
    },
  });
}

let app = null;

export default function render({ loading }) {
  if (!app) {
    app = vueRender({ loading });
  } else {
    app.loading = loading;
  }
}
