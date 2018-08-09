import { Component } from '@angular/core';

@Component({
    selector: 'app-social-login',
    styleUrls: ['./social-login.component.scss'],
    templateUrl: './social-login.component.html'
})
export class SocialLoginComponent {
    constructor() { }

    public get socialLogins(): any[] {
        return ['google', 'facebook'].map(login => {
            return {
                loginProvider: login,
                active: this.isActive(login)
            };
        });
    }
    public loginCss(login: string): string {
        if (login.toLowerCase() === 'microsoft') {
            return 'fa-windows';
        }

        if (login.toLowerCase() === 'stackexchange') {
            return 'fa-stack-exchange';
        }

        return `fa-${login.toLowerCase()}`;
    }

    isActive(login: string): boolean {
        return true;
    }

    public redirect(provider: string): void {
        // TODO
        console.log('TODO');
        // this.oAuthService.initImplicitFlow(null, { provider: provider });
    }


}
