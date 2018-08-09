import { Component, OnInit, EventEmitter } from '@angular/core';

import { ChangePasswordService } from './change-password.service';
import { ChangePasswordModel } from './change-password.model';
import { ControlBase, ControlTextbox } from '@app/shared';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  providers: [ChangePasswordService]
})
export class ChangePasswordComponent implements OnInit {
  public success: string[];
  public controls: Array<ControlBase<string>> = [
    new ControlTextbox({
      key: 'currentPassword',
      label: 'Current password',
      placeholder: 'Current password',
      value: '',
      type: 'password',
      required: true,
      order: 1
    }),
    new ControlTextbox({
      key: 'newPassword',
      label: 'New password',
      placeholder: 'New password',
      value: '',
      type: 'password',
      required: true,
      order: 2
    }),
    new ControlTextbox({
      key: 'verifyPassword',
      label: 'Verify password',
      placeholder: 'Verify password',
      value: '',
      type: 'password',
      required: true,
      order: 3
    })
  ];

  public reset = new EventEmitter<boolean>();
  constructor(public userPasswordService: ChangePasswordService) { }

  public ngOnInit() { }

  public save(model: ChangePasswordModel): void {
    this.userPasswordService.savePassword(model)
      .subscribe(res => {
        this.success = res;
        this.reset.emit(true);
      });
  }
}
