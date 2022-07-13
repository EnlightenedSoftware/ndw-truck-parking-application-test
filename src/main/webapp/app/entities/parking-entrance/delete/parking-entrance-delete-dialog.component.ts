import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IParkingEntrance } from '../parking-entrance.model';
import { ParkingEntranceService } from '../service/parking-entrance.service';

@Component({
  templateUrl: './parking-entrance-delete-dialog.component.html',
})
export class ParkingEntranceDeleteDialogComponent {
  parkingEntrance?: IParkingEntrance;

  constructor(protected parkingEntranceService: ParkingEntranceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.parkingEntranceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
