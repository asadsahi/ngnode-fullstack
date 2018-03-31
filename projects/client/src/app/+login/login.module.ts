import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared';
import { LoginComponent } from './login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: LoginComponent, pathMatch: 'full', data: { state: 'login' } },
            { path: 'forgetpassword', component: ForgetPasswordComponent },
            { path: 'resetpassword', component: ResetPasswordComponent }
        ]),
        SharedModule
    ],
    declarations: [
        LoginComponent,
        ForgetPasswordComponent,
        ResetPasswordComponent
    ]
})
export class LoginModule { }
