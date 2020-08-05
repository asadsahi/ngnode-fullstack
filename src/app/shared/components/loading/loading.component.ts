import { Component, ElementRef, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LoadingService } from '../../services';

@Component({
  selector: 'appc-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements AfterViewInit, OnDestroy {
  loadingSubscription: Subscription;

  constructor(private loadingScreenService: LoadingService, private elmRef: ElementRef, private changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.elmRef.nativeElement.style.display = 'none';
    this.loadingSubscription = this.loadingScreenService.loading$.pipe().subscribe((status: boolean) => {
      this.elmRef.nativeElement.style.display = status ? 'block' : 'none';
      this.changeDetectorRef.detectChanges();
    });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
