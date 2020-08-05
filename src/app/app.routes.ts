import { Routes } from '@angular/router';
import { HomeComponent } from '@app/home/home.component';
import { PrivacyComponent } from '@app/components';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { state: 'home' } },
  { path: 'privacy', component: PrivacyComponent },
];
