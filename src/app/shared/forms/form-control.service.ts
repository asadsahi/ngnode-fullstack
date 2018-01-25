import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';

import { ControlBase } from './controls';
import { ValidationService } from './validation.service';

@Injectable()
export class FormControlService {

    public toControlGroup(controls: Array<ControlBase<any>>) {
        const group: any = {};

        controls.forEach(control => {
            const validators: ValidatorFn[] = [];
            // Required
            if (control.required) {
                validators.push(Validators.required);
            }
            // Minlength
            if (control.minlength) {
                validators.push(Validators.minLength(control.minlength));
            }
            // Maxlength
            if (control.maxlength) {
                validators.push(Validators.maxLength(control.maxlength));
            }
            // Email
            if (control.type === 'email') {
                validators.push(ValidationService.emailValidator);
            }
            // Password
            if (control.type === 'password') {
                validators.push(ValidationService.passwordValidator);
            }
            group[control.key] = new FormControl(control.value || '', validators);
        });

        return new FormGroup(group);
    }
}
