import { Injectable } from '@angular/core';

import { DataService } from '@app/core';
import { ChangePasswordModel } from './change-password/change-password.model';

@Injectable()
export class ProfileService {

    public changePasswordApi = 'api/account/changepassword/';

    constructor(public dataService: DataService) { }

    public changePassword(changePasswordModel: ChangePasswordModel) {
        return this.dataService.post(this.changePasswordApi, changePasswordModel);
    }
}
