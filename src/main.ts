import './polyfills.ts';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const providers = [
    { provide: 'ORIGIN_URL', useValue: location.origin }
];

if (environment.production) {
    enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
    platformBrowserDynamic(providers).bootstrapModule(AppModule)
        .catch(err => console.log(err));
});
