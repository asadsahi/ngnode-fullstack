import { Component, OnInit } from '@angular/core';

import { UtilityService } from '@app/core';
import { routerTransition } from './router.animations';

@Component({
  selector: 'appc-root',
  animations: [routerTransition],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(private us: UtilityService) { }

  public ngOnInit() {
    this.us.alternateFlows();
  }

  public getState(outlet: any) {
    return outlet.activatedRouteData.state;
  }

}
