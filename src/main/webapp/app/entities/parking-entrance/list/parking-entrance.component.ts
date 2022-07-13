import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IParkingEntrance } from '../parking-entrance.model';
import { ParkingEntranceService } from '../service/parking-entrance.service';
import { ParkingEntranceDeleteDialogComponent } from '../delete/parking-entrance-delete-dialog.component';

@Component({
  selector: 'jhi-parking-entrance',
  templateUrl: './parking-entrance.component.html',
})
export class ParkingEntranceComponent implements OnInit {
  parkingEntrances?: IParkingEntrance[];
  isLoading = false;

  constructor(protected parkingEntranceService: ParkingEntranceService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.parkingEntranceService.query().subscribe({
      next: (res: HttpResponse<IParkingEntrance[]>) => {
        this.isLoading = false;
        this.parkingEntrances = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IParkingEntrance): number {
    return item.id!;
  }

  delete(parkingEntrance: IParkingEntrance): void {
    const modalRef = this.modalService.open(ParkingEntranceDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.parkingEntrance = parkingEntrance;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
