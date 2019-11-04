import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

export async function bootstrap() {
  console.log('angular8 app bootstraped');
}

export async function mount() {
  console.log('angular8 app mount');
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch(err => console.error(err));
}

export async function unmount() {
  console.log('angular8 app unmount');
}

if (environment.production) {
  enableProdMode();
}
// mount();
