import { Component, OnInit } from '@angular/core';

import { UserInfoService } from './user-info.service';
import { UserInfoModel } from './user-info.model';
import { ControlBase, ControlTextbox } from '@app/shared';
import { NotificationsService } from '@app/core';

@Component({
  selector: 'appc-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
  providers: [UserInfoService]
})
export class UserInfoComponent implements OnInit {
  public controls: Array<ControlBase<string>> = [
    new ControlTextbox({
      key: 'firstName',
      label: 'First name',
      placeholder: 'Firstname',
      value: '',
      type: 'textbox',
      required: true,
      order: 1
    }),
    new ControlTextbox({
      key: 'lastName',
      label: 'Last name',
      placeholder: 'Lastname',
      value: '',
      type: 'textbox',
      required: true,
      order: 2
    }),
    new ControlTextbox({
      key: 'username',
      label: 'Username',
      placeholder: 'Username',
      value: '',
      type: 'textbox',
      required: true,
      order: 3
    }),
    new ControlTextbox({
      key: 'email',
      label: 'Email',
      placeholder: 'Email',
      value: '',
      type: 'email',
      required: true,
      order: 4
    })
  ];

  constructor(public userInfoService: UserInfoService, private ns: NotificationsService) { }

  public ngOnInit() { }

  public save(model: UserInfoModel): void {
    this.userInfoService.userInfo(model)
      .subscribe((res: UserInfoModel) => {
        this.ns.success('Profile name changed', `Updated to ${res.displayName}`);
      });

  }

}
