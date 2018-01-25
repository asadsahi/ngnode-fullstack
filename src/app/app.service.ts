import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const APP_DATA_KEY = makeStateKey<string>('appData');

@Injectable()
export class AppService {
    constructor(
        @Inject('ORIGIN_URL') private baseUrl: string,
        private transferState: TransferState,
        private http: HttpClient
    ) { }


    public get appData(): IApplicationConfig {
        return this.transferState.get(APP_DATA_KEY, null as IApplicationConfig);
    }
    getAppData(): Promise<IApplicationConfig> {
        const transferredAppData = this.transferState.get(APP_DATA_KEY, null as IApplicationConfig);
        if (!transferredAppData) {
            return this.http.get(`${this.baseUrl}/api/applicationdata`).toPromise()
                .then((data: IApplicationConfig) => {
                    this.transferState.set(APP_DATA_KEY, data);
                    return data;
                });
        }
        return new Promise((resolve, reject) => {
            resolve(transferredAppData);
        });
    }
}

export function getAppData(appService: AppService) {
    return () => appService.getAppData();
}
