import { Response } from '@angular/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';

import { DataService } from './data.service';

@Injectable()
export class AuthService {
    private jwtHelper: JwtHelper = new JwtHelper();

    constructor(
        @Inject(PLATFORM_ID) private platformId: string,
        private dataService: DataService,
        private router: Router,
    ) { }

    public logout() {
        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.clear();
            this.router.navigate(['/login']);
        }
    }

    public isLoggedIn(): boolean {
        return !!this.getToken() && !this.jwtHelper.isTokenExpired(this.getToken());
    }

    public user(): IUser {
        if (this.getToken()) {
            const user = this.jwtHelper.decodeToken(this.getToken()).user;
            return user;
        }
        return undefined;
    }

    public login(user: IUser) {
        return this.dataService.post('api/auth/signin', user);
    }

    public register(data: IUser): Observable<Response> {
        return this.dataService.post('api/auth/signup', data);
    }

    public getToken(): string {
        const token = isPlatformBrowser(this.platformId) && sessionStorage.getItem('token');
        if (token) {
            return JSON.parse(token);
        }
        return '';
    }

    public setToken(token: string): void {
        if (isPlatformBrowser(this.platformId)) {
            sessionStorage.setItem('token', JSON.stringify(token));
        }
    }

    public callOAuth(provider: string): void {
        // // Effectively call OAuth authentication route:
        // window.location.href = url;
        const url = window.location.protocol + '//' + window.location.host + '/api/auth/' + provider.toLowerCase();
        window.location.href = url;
    }

    public forgetPassword(username: string): Observable<Response> {
        return this.dataService.post('api/auth/forgotpassword', username);
    }

    public resetPassword(token: string, passwordModel: any): Observable<Response> {
        return this.dataService.post('/api/auth/reset/' + token, passwordModel);
    }

}
