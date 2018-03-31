import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { ImageUploaderComponent, SecureImageComponent, LoadingSpinnerComponent, SocialLoginComponent } from './components';
import { DynamicFormComponent, DynamicFormControlComponent, ErrorSummaryComponent } from './forms';
// Directives
import { PageHeadingComponent } from './directives';
// Pipes
import { KeysPipe, UppercasePipe } from './pipes';
// Services
import { FormControlService } from './forms';

@NgModule({
  entryComponents: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // No need to export as these modules don't expose any components/directive etc'
  ],
  declarations: [
    DynamicFormComponent,
    DynamicFormControlComponent,
    ErrorSummaryComponent,
    PageHeadingComponent,
    UppercasePipe,
    KeysPipe,
    ImageUploaderComponent,
    SecureImageComponent,
    LoadingSpinnerComponent,
    SocialLoginComponent
  ],
  exports: [
    // Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // Providers, Components, directive, pipes
    DynamicFormComponent,
    DynamicFormControlComponent,
    ErrorSummaryComponent,
    PageHeadingComponent,
    ImageUploaderComponent,
    LoadingSpinnerComponent,
    SocialLoginComponent,
    UppercasePipe,
    KeysPipe,
  ],
  providers: [
    FormControlService
  ]

})
export class SharedModule {
  // public static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: SharedModule,

  //   };
  // }
}
