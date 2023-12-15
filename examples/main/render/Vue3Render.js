import { createApp, h } from 'vue';
import { MicroApp } from '../../../packages/ui-bindings/vue/dist/esm';


function vueRender() {
  const application = createApp({
    components: {
    },
    render() {
      return h('div', [
        this.message,
        h(MicroApp, { name: 'react15', entry: '//localhost:7102' }),
        this.message,
      ]);
    },
    setup() {
      const message = 'abc';

      return {
        message,
      };
      // return () => h('div', [
      //   message.value,
      //   h(MicroApp, { name: 'react15', entry: '//localhost:7102' }),
      //   message.value,
      // ]);
    }
  });

  application.mount('#subapp-container');

  return application;
}

let app = null;

function render() {
  if (!app) {
    app = vueRender();
    console.log(app)
  }
}

render();
