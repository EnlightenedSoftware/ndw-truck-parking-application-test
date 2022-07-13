import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParkingEntrance } from '../parking-entrance.model';

@Component({
  selector: 'jhi-parking-entrance-detail',
  templateUrl: './parking-entrance-detail.component.html',
})
export class ParkingEntranceDetailComponent implements OnInit {
  parkingEntrance: IParkingEntrance | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parkingEntrance }) => {
      this.parkingEntrance = parkingEntrance;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
