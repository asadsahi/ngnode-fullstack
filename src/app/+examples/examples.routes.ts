import { Routes } from '@angular/router';

import { ExamplesComponent } from './examples.component';
import { FormsPlaygroundComponent } from './examples/forms-playground/forms-playground.component';

export const routes: Routes = [
    { path: '', component: ExamplesComponent, data: { displayText: 'Home' } },
    { path: 'forms-playground', component: FormsPlaygroundComponent, data: { displayText: 'Forms playground' } },
    { path: 'datatable', loadChildren: './examples/datatable/datatable.module#DatatableModule', data: { displayText: 'Datatable' } },
    { path: 'crud-shop', loadChildren: './examples/crud-shop/crud-shop.module#CrudShopModule', data: { displayText: 'CRUD Shop' } },
];
