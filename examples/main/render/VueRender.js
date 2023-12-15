import Vue from 'vue/dist/vue.esm.js';
import compositionApi  from '@vue/composition-api';
import { MicroApp } from '../../../packages/ui-bindings/vue/dist/esm/';

Vue.use(compositionApi);
// Vue.component('MicroApp', MicroApp)
function vueRender() {
  return new Vue({
    components: {
      MicroApp,
    },
    data: {
      message: 'abc',
    },
    name: 'vueRender',
    template: `
      <div>
        <MicroApp name="react15" entry="//localhost:7102" />
      </div>
    `,
    // render(h) {
    //   return h('div', [
    //     h(MicroApp, {
    //       props: {
    //         name: 'react15',
    //         entry: '//localhost:7102',
    //       }
    //     }),
    //   ]);
    // },
    el: '#subapp-container',
  });
}

let app = null;

function render() {
  if (!app) {
    app = vueRender();
    console.log(app)
  }
}

render();
