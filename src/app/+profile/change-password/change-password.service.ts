import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DataService } from '@app/core';

import { ChangePasswordModel } from './change-password.model';

@Injectable()
export class ChangePasswordService {

  constructor(public dataService: DataService) { }

  public savePassword(userPasswordModel: ChangePasswordModel): Observable<any> {
    return this.dataService.post('api/users/password', userPasswordModel);
  }

}
