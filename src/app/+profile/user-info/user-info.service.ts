import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { UserInfoModel } from './user-info.model';
import { DataService } from '@app/core';

@Injectable()
export class UserInfoService {

  constructor(public dataService: DataService) { }

  public userInfo(userNameModel?: UserInfoModel): Observable<any> {
    if (userNameModel) {
      return this.dataService.put('api/users', userNameModel);
    } else {
      return this.dataService.get('api/users/me/');
    }
  }

}
