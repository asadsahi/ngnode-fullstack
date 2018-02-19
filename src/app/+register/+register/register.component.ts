import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '@app/core';
import { ControlBase, ControlTextbox } from '@app/shared';

@Component({
    selector: 'appc-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
    public controls: Array<ControlBase<any>>;

    constructor(public authService: AuthService, public router: Router, public route: ActivatedRoute) { }

    public register(model: IUser): void {
        this.authService.register(model)
            .subscribe((res: Response) => {
                this.router.navigate(['../registerconfirmation'], { relativeTo: this.route });
            });
    }

    public ngOnInit() {
        const controls: Array<ControlBase<any>> = [
            new ControlTextbox({
                key: 'username',
                label: 'Username',
                placeholder: 'Username',
                value: '',
                type: 'textbox',
                required: true,
                order: 1
            }),
            new ControlTextbox({
                key: 'email',
                label: 'Email',
                placeholder: 'Email',
                value: '',
                type: 'email',
                required: true,
                order: 2
            }),
            new ControlTextbox({
                key: 'password',
                label: 'Password',
                placeholder: 'Password',
                value: '',
                type: 'password',
                required: true,
                order: 3
            }),
            new ControlTextbox({
                key: 'firstName',
                label: 'Firstname',
                placeholder: 'Firstname',
                value: '',
                type: 'textbox',
                order: 4
            }),
            new ControlTextbox({
                key: 'lastName',
                label: 'Lastname',
                placeholder: 'Lastname',
                value: '',
                type: 'textbox',
                order: 5
            })
        ];

        this.controls = controls;
    }

}
