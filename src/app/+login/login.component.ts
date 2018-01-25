import { Component, OnInit } from '@angular/core';

import { UtilityService, AuthService } from '@app/core';
import { ControlBase, ControlTextbox } from '@app/shared';

@Component({
    selector: 'appc-login',
    styleUrls: ['./login.component.scss'],
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    public controls: any;

    constructor(
        private authService: AuthService,
        public utilityService: UtilityService
    ) { }

    public login(model: IUser): void {
        this.authService.login(model)
            .subscribe((token: any) => {
                this.authService.setToken(token);
                this.utilityService.navigate('');
            });
    };

    public ngOnInit() {
        const controls: Array<ControlBase<any>> = [
            new ControlTextbox({
                key: 'usernameOrEmail',
                label: 'Username Or Email',
                placeholder: 'Username or email',
                value: '',
                required: true,
                order: 1
            }),
            new ControlTextbox({
                key: 'password',
                label: 'Password',
                placeholder: 'Password',
                value: '',
                type: 'password',
                required: true,
                order: 2
            })
        ];

        this.controls = controls;
    }
}
