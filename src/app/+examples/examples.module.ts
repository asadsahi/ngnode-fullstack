import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { ExamplesComponent } from './examples/examples.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [ExamplesComponent]
})
export class ExamplesModule { }
