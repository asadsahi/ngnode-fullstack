import { Component, OnInit, EventEmitter } from '@angular/core';
import { AuthService, UtilityService } from '@app/core';
import { ControlBase, ControlTextbox } from '@app/shared';
import { NotificationsService } from '@app/core';

@Component({
  selector: 'appc-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public resetToken: any = undefined;
  public controls: any;
  public reset = new EventEmitter<boolean>();

  constructor(
    private authService: AuthService,
    private us: UtilityService,
    private ns: NotificationsService) { }

  ngOnInit() {
    const controls: Array<ControlBase<any>> = [
      new ControlTextbox({
        key: 'newPassword',
        label: 'New password',
        placeholder: 'New password',
        value: '',
        type: 'password',
        required: true
      }),
      new ControlTextbox({
        key: 'verifyPassword',
        label: 'Verify password',
        placeholder: 'Verify password',
        type: 'password',
        value: '',
        required: true
      })
    ];

    this.controls = controls;
  }

  public send(passwordModel: any) {
    this.authService.resetPassword(this.us.getParams()['resetToken'], passwordModel)
      .subscribe(res => {
        this.reset.next(true);
        this.ns.info('Confirmation', 'Password changed successfully');
      },
      error => {
        console.log(error);
        this.ns.error(error.error)
      }
      );
  }
}
