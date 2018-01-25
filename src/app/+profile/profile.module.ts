import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared';
import { ProfileComponent } from './profile.component';
import { ProfileService } from './profile.service';
import { UserInfoComponent } from './user-info/user-info.component';
import { UserPhotoComponent } from './user-photo/user-photo.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: ProfileComponent, data: { state: 'profile' }, children: [
                    { path: '', redirectTo: 'userinfo', pathMatch: 'full' },
                    { path: 'userinfo', component: UserInfoComponent },
                    { path: 'updatepassword', component: ChangePasswordComponent },
                    { path: 'userphoto', component: UserPhotoComponent }
                ]
            }
        ]),
        SharedModule
    ],
    declarations: [
        ProfileComponent,
        UserInfoComponent,
        UserPhotoComponent,
        ChangePasswordComponent
    ],
    providers: [ProfileService]
})
export class ProfileModule { }
