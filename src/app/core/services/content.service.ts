import { Injectable } from '@angular/core';

import { DataService } from './data.service';

@Injectable()
export class ContentService {

  constructor(private dataService: DataService) { }

  // For admin editing
  public get(lang: string) {
    return this.dataService.get('api/content/' + (lang || 'en'));
  }

  public put(content: any) {
    return this.dataService.put('api/content', content);
  }

}
