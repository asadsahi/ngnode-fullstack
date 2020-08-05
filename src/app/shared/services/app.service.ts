import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Injectable } from '@angular/core';

import { DataService } from './data.service';

const APP_DATA_KEY = makeStateKey<string>('appData');

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private transferState: TransferState, private dataService: DataService) {}

  public get appData(): IApplicationConfig {
    return this.transferState.get(APP_DATA_KEY, null as IApplicationConfig);
  }
  getAppData(): Promise<IApplicationConfig> {
    const transferredAppData = this.transferState.get(APP_DATA_KEY, null as IApplicationConfig);
    if (!transferredAppData) {
      return this.dataService
        .get('app/getapplicationdata')
        .toPromise()
        .then((data: IApplicationConfig) => {
          this.transferState.set(APP_DATA_KEY, data);
          window['appData'] = data;
          return data;
        });
    }
    return new Promise((resolve, reject) => {
      resolve(transferredAppData);
    });
  }
}
