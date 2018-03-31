import { NgModule, APP_INITIALIZER } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
// import { PrebootModule } from 'preboot';

import { CoreModule } from './core/core.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AppService, getAppData } from './app.service';
import { environment } from '@environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ngnode-fullstack-app' }),
    // PrebootModule.withConfig({ appRoot: 'appc-root' }),
    BrowserTransferStateModule,
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      // Lazy async modules
      { path: 'login', loadChildren: './+login/login.module#LoginModule' },
      { path: 'register', loadChildren: './+register/register.module#RegisterModule' },
      { path: 'profile', loadChildren: './+profile/profile.module#ProfileModule' },
    ], { initialNavigation: 'enabled' }),
    // Only module that app module loads
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  exports: [
  ],
  providers: [
    AppService,
    { provide: APP_INITIALIZER, useFactory: getAppData, deps: [AppService], multi: true },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
