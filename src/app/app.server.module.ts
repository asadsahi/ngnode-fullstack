import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { ServerTransferStateModule } from '@angular/platform-server';
import { AppShellComponent } from './app-shell/app-shell.component';

const routes: Routes = [{ path: 'shell', component: AppShellComponent }];

@NgModule({
    imports: [
        AppModule,
        NoopAnimationsModule,
        ServerTransferStateModule,
        ServerModule,
        ModuleMapLoaderModule,
        RouterModule.forRoot(routes),
    ],
    bootstrap: [AppComponent],
    providers: [
    ],
})
export class AppServerModule { }
