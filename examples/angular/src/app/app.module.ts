import { NgModule, DoBootstrap, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
    ]),
    AppComponent,
    HomeComponent,
    AboutComponent,
  ],
  providers: [],
})
export class AppModule implements DoBootstrap {
  ngDoBootstrap(appRef: ApplicationRef): void {
    appRef.bootstrap(AppComponent);
  }
}
