import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IParking } from '../parking.model';

@Component({
  selector: 'jhi-parking-detail',
  templateUrl: './parking-detail.component.html',
})
export class ParkingDetailComponent implements OnInit {
  parking: IParking | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parking }) => {
      this.parking = parking;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
