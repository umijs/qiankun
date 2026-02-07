import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

function render() {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
}

export async function bootstrap() {
  console.log('[angular] bootstrap');
}

export async function mount(props: { container?: HTMLElement }) {
  console.log('[angular] mount', props);
  render();
}

export async function unmount() {
  console.log('[angular] unmount');
}

if (!window.__POWERED_BY_QIANKUN__) {
  render();
}
