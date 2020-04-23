import Vue from 'vue/dist/vue.esm';

function vueRender({ appContent, loading }) {
  return new Vue({
    template: `
      <div id="subapp-container">
        <h4 v-if="loading" class="subapp-loading">Loading...</h4>
        <div id="subapp-viewport"></div>
        <div v-html="appContent" />
      </div>
    `,
    el: '#subapp-container',
    data() {
      return {
        appContent,
        loading,
      };
    },
  });
}

let app = null;

export default function render({ appContent, loading }) {
  if (!app) {
    app = vueRender({ appContent, loading });
  } else {
    app.appContent = appContent;
    app.loading = loading;
  }
}
