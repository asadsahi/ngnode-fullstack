import { Component } from '@angular/core';
import { DataService } from '@app/shared';

@Component({
  selector: 'appc-home-component',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  constructor(private dataService: DataService) {
    this.dataService.get('product').subscribe();
  }
}
