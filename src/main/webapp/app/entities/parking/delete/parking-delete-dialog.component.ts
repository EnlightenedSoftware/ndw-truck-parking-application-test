import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IParking } from '../parking.model';
import { ParkingService } from '../service/parking.service';

@Component({
  templateUrl: './parking-delete-dialog.component.html',
})
export class ParkingDeleteDialogComponent {
  parking?: IParking;

  constructor(protected parkingService: ParkingService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.parkingService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
