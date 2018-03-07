import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

import { UtilityService } from '@app/core';
import { AppService } from './app.service';
import { routerTransition } from './router.animations';

@Component({
  selector: 'appc-root',
  animations: [routerTransition],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    private title: Title,
    private meta: Meta,
    private appService: AppService,
    private us: UtilityService) { }

  public ngOnInit() {
    this.updateTitleAndMeta();
    this.us.alternateFlows();
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
