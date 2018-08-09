import { Component, OnInit } from '@angular/core';

import { ControlBase, ControlTextbox } from '@app/shared';
import { AuthService } from '@app/core';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  public controls: any;
  public successMessage = '';

  constructor(public authService: AuthService) { }

  public ngOnInit() {
    const controls: Array<ControlBase<any>> = [
      new ControlTextbox({
        key: 'username',
        label: 'Username',
        placeholder: 'Username',
        value: '',
        required: true
      })
    ];

    this.controls = controls;
  }

  public send(username: string) {
    this.successMessage = '';
    this.authService.forgetPassword(username).subscribe((res: any) => {
      this.successMessage = res.message;
    });
  }
}
