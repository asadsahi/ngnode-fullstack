// tslint:disable
import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { AppService } from '../../../app.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    public notificationOptions = {
        position: ['top', 'right'],
        timeOut: 5000,
        lastOnBottom: true
    };

    public isCollapsed: boolean = true;

    constructor(
        public authService: AuthService,
        private appService: AppService
    ) { }

    public get cultures(): ICulture[] {
        return this.appService.appData.cultures;
    }
    public get currentCulture(): ICulture {
        return this.cultures.filter(x => x.current)[0];
    }

    public ngOnInit(): void { }

    public toggleNav() {
        this.isCollapsed = !this.isCollapsed;
    }

}
