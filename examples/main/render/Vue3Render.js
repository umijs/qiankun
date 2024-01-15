import { createApp, h, onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { MicroApp } from '../../../packages/ui-bindings/vue/dist/esm';

const sidemenu = document.querySelector('.mainapp-sidemenu');

const microApps = [
  { name: 'react15', entry: '//localhost:7102' },
  { name: 'react16', entry: '//localhost:7100' },
];

function vueRender() {
  const application = createApp({
    components: {
    },
    render() {
      return h('div', [
        h(MicroApp, { name: this.name, entry: this.entry, autoCaptureError: true }),
      ]);
    },
    setup() {
      const name = ref('');
      const entry = ref('');

      const handleMenuClick = (e) => {
        const app = microApps.find((app) => app.name === e.target.dataset.value);
        if (app && app.name !== name.value) {
          name.value = app.name;
          entry.value = app.entry;
        } else {
          console.log('not found any app');
        }
      }

      onBeforeMount(() => {
        sidemenu.addEventListener('click', handleMenuClick);
      });


      onBeforeUnmount(() => {
        sidemenu.removeEventListener('click', handleMenuClick);
      });

      return {
        name,
        entry,
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
