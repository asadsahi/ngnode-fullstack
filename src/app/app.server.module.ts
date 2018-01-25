import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { ServerTransferStateModule } from '@angular/platform-server';

@NgModule({
    imports: [
        AppModule,
        NoopAnimationsModule,
        ServerTransferStateModule,
        ServerModule,
        ModuleMapLoaderModule
    ],
    bootstrap: [AppComponent],
    providers: [
    ],
})
export class AppServerModule { }
