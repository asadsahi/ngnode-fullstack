import { NgModule, Optional, SkipSelf, ModuleWithProviders, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SimpleNotificationsModule } from './simple-notifications';

// App level components
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
// Pipes
import { TranslatePipe } from './pipes/translate.pipe';
// App level services
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';
import { UtilityService } from './services/utility.service';
import { LogService, LogPublishersService } from './services/log';
import { ContentService } from './services/content.service';
import { AuthInterceptor, TimingInterceptor, CookieInterceptor } from './services/interceptors';
import { GlobalErrorHandler } from './services/global-error.service';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    TranslatePipe
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    // https://github.com/flauc/angular2-notifications/blob/master/docs/toastNotifications.md
    SimpleNotificationsModule.forRoot(),
    RouterModule
  ],
  exports: [
    // Components
    HeaderComponent,
    FooterComponent,
    // Pipes
    TranslatePipe
  ],
  providers: []
})
export class CoreModule {
  // forRoot allows to override providers
  // https://angular.io/docs/ts/latest/guide/ngmodule.html#!#core-for-root
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        AuthService,
        ContentService,
        DataService,
        DataService,
        LogService,
        LogPublishersService,
        UtilityService,
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: CookieInterceptor, multi: true },
        { provide: ErrorHandler, useClass: GlobalErrorHandler }
      ]
    };
  }
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import it in the AppModule only');
    }
  }
}


export * from './services/auth.service';
export * from './services/data.service';
export * from './services/utility.service';
export * from './services/log';
export * from './services/content.service';
export * from './simple-notifications';
