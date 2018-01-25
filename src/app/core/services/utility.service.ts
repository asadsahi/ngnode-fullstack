﻿import { Injectable, Inject, PLATFORM_ID, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

import { AuthService } from './auth.service';

@Injectable()
export class UtilityService {
    constructor(
        public router: Router,
        public inj: Injector,
        @Inject(PLATFORM_ID) private platformId: string,
    ) { }

    public convertDateTime(date: Date) {
        const _formattedDate = new Date(date.toString());
        return _formattedDate.toDateString();
    }

    public navigate(path: string, params?: any) {
        this.router.navigate([path], { queryParams: params });
    }

    public navigateToSignIn() {
        this.navigate('/login');
    }

    public readableColumnName(columnName: string): string {
        // Convert underscores to spaces
        if (typeof (columnName) === 'undefined' || columnName === undefined || columnName === null) { return columnName; }

        if (typeof (columnName) !== 'string') {
            columnName = String(columnName);
        }

        return columnName.replace(/_+/g, ' ')
            // Replace a completely all-capsed word with a first-letter-capitalized version
            .replace(/^[A-Z]+$/, (match) => {
                return ((match.charAt(0)).toUpperCase() + match.slice(1)).toLowerCase();
            })
            // Capitalize the first letter of words
            .replace(/([\w\u00C0-\u017F]+)/g, (match) => {
                return (match.charAt(0)).toUpperCase() + match.slice(1);
            })
            // Put a space in between words that have partial capilizations (i.e. 'firstName' becomes 'First Name')
            // .replace(/([A-Z]|[A-Z]\w+)([A-Z])/g, "$1 $2");
            // .replace(/(\w+?|\w)([A-Z])/g, "$1 $2");
            .replace(/(\w+?(?=[A-Z]))/g, '$1 ');
    }

    public loadStyle(link: string): Observable<any> {
        if (this.isLoadedStyle(link)) {
            return Observable.of('');
        } else {
            const head = document.getElementsByTagName('head')[0];
            // Load jquery Ui
            const styleNode = document.createElement('link');
            styleNode.rel = 'stylesheet';
            styleNode.type = 'text/css';
            styleNode.href = link;
            styleNode.media = 'all';
            head.appendChild(styleNode);
            return Observable.fromEvent(styleNode, 'load');
        }
    }

    public loadScript(script: string): Observable<any> {
        if (this.isLoadedScript(script)) {
            return Observable.of('');
        } else {
            const head = document.getElementsByTagName('head')[0];
            // Load jquery Ui
            const scriptNode = document.createElement('script');
            scriptNode.src = script;
            scriptNode.async = false;
            // scriptNode.type = 'text/javascript';
            // scriptNode.charset = 'utf-8';
            head.insertBefore(scriptNode, head.firstChild);
            return Observable.fromEvent(scriptNode, 'load');
        }
    }

    public alternateFlows() {
        if (isPlatformBrowser(this.platformId)) {
            const params = this.getParams();
            if (params) {
                if (params['resetPasswordTokenValid']) {
                    this.navigate('login/resetpassword', {
                        resetPasswordTokenValid: params['resetPasswordTokenValid'],
                        resetToken: params['resetToken']
                    });
                } else if (params['token']) {
                    const authService = this.inj.get(AuthService);
                    authService.setToken(params['token']);
                    this.navigate('/');
                }
            }
        }
    }

    public toQueryParams(obj: any): string {
        return Object.keys(obj)
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]))
            .join('&');
    }

    public fromQueryParams(queryString: string): Object {
        const query: any = {};
        const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return query;
    }

    public formatErrors(errors: any) {
        return errors ? errors.map((err: any) => err.message).join('/n') : '';
    }

    public getParams() {
        if (isPlatformBrowser(this.platformId)) {
            const searchParams = location.search.split('?')[1];
            if (searchParams) {
                const paramsObj: any = {};

                searchParams.split('&').forEach(i => {
                    paramsObj[i.split('=')[0]] = i.split('=')[1];
                });
                return paramsObj;
            }
        }
        return undefined;
    }

    // Detect if library loaded
    private isLoadedScript(lib: string) {
        return document.querySelectorAll('[src="' + lib + '"]').length > 0;
    }

    private isLoadedStyle(lib: string) {
        return document.querySelectorAll('[href="' + lib + '"]').length > 0;
    }


}
