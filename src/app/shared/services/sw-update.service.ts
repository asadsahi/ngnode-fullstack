import { Injectable } from '@angular/core';
import { SwUpdate, UpdateAvailableEvent } from '@angular/service-worker';
import { ModalService } from './modal.service';

@Injectable({
  providedIn: 'root',
})
export class SwUpdateService {
  constructor(public swUpdate: SwUpdate, private modalService: ModalService) {}

  checkForUpdate() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe((event: UpdateAvailableEvent) => {
        this.promptUser(event);
      });
    }
  }

  private promptUser(event: UpdateAvailableEvent) {
    this.modalService
      .warn({
        title: 'App Update',
        message: 'An updated version of app is available, window will reload',
        okLabel: 'Ok',
      })
      .then(
        () => {
          this.swUpdate.activateUpdate().then(() => {
            document.location.reload();
          });
        },
        () => {},
      );
  }
}
