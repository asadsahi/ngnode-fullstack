import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';

// import { routerTransition } from './router.animations';
import { AppService, AuthService } from '@app/services';
@Component({
  selector: 'appc-root',
  // animations: [routerTransition],
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private title: Title,
    private meta: Meta,
    private appService: AppService
  ) { }

  public ngOnInit() {
    this.updateTitleAndMeta();
    if (window.location.href.indexOf('?postLogout=true') > 0) {
      this.authService.signoutRedirectCallback().then(() => {
        const url: string = this.router.url.substring(
          0,
          this.router.url.indexOf('?')
        );
        this.router.navigateByUrl(url);
      });
    }
  }

  public getState(outlet: any) {
    return outlet.activatedRouteData.state;
  }

  private updateTitleAndMeta() {
    this.title.setTitle(this.appService.appData.content['app_title']);
    this.meta.addTags([
      { name: 'description', content: this.appService.appData.content['app_description'] },
      { property: 'og:title', content: this.appService.appData.content['app_title'] },
      { property: 'og:description', content: this.appService.appData.content['app_description'] }
    ]);
  }
}
