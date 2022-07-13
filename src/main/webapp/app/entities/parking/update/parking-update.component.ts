import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IParking, Parking } from '../parking.model';
import { ParkingService } from '../service/parking.service';
import { IParkingEntrance } from 'app/entities/parking-entrance/parking-entrance.model';
import { ParkingEntranceService } from 'app/entities/parking-entrance/service/parking-entrance.service';

@Component({
  selector: 'jhi-parking-update',
  templateUrl: './parking-update.component.html',
})
export class ParkingUpdateComponent implements OnInit {
  isSaving = false;

  parkingEntrancesSharedCollection: IParkingEntrance[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    location: [],
    places: [],
    refrigeratedPlaces: [],
    lzvPlaces: [],
    hourlyRate: [],
    pricingUrl: [],
    otherServicesDescription: [],
    organization: [],
    createdOn: [],
    createdBy: [],
    updatedOn: [],
    updatedBy: [],
    isActive: [],
    parking: [],
  });

  constructor(
    protected parkingService: ParkingService,
    protected parkingEntranceService: ParkingEntranceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parking }) => {
      if (parking.id === undefined) {
        const today = dayjs().startOf('day');
        parking.createdOn = today;
        parking.updatedOn = today;
      }

      this.updateForm(parking);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parking = this.createFromForm();
    if (parking.id !== undefined) {
      this.subscribeToSaveResponse(this.parkingService.update(parking));
    } else {
      this.subscribeToSaveResponse(this.parkingService.create(parking));
    }
  }

  trackParkingEntranceById(_index: number, item: IParkingEntrance): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParking>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(parking: IParking): void {
    this.editForm.patchValue({
      id: parking.id,
      name: parking.name,
      location: parking.location,
      places: parking.places,
      refrigeratedPlaces: parking.refrigeratedPlaces,
      lzvPlaces: parking.lzvPlaces,
      hourlyRate: parking.hourlyRate,
      pricingUrl: parking.pricingUrl,
      otherServicesDescription: parking.otherServicesDescription,
      organization: parking.organization,
      createdOn: parking.createdOn ? parking.createdOn.format(DATE_TIME_FORMAT) : null,
      createdBy: parking.createdBy,
      updatedOn: parking.updatedOn ? parking.updatedOn.format(DATE_TIME_FORMAT) : null,
      updatedBy: parking.updatedBy,
      isActive: parking.isActive,
      parking: parking.parking,
    });

    this.parkingEntrancesSharedCollection = this.parkingEntranceService.addParkingEntranceToCollectionIfMissing(
      this.parkingEntrancesSharedCollection,
      parking.parking
    );
  }

  protected loadRelationshipsOptions(): void {
    this.parkingEntranceService
      .query()
      .pipe(map((res: HttpResponse<IParkingEntrance[]>) => res.body ?? []))
      .pipe(
        map((parkingEntrances: IParkingEntrance[]) =>
          this.parkingEntranceService.addParkingEntranceToCollectionIfMissing(parkingEntrances, this.editForm.get('parking')!.value)
        )
      )
      .subscribe((parkingEntrances: IParkingEntrance[]) => (this.parkingEntrancesSharedCollection = parkingEntrances));
  }

  protected createFromForm(): IParking {
    return {
      ...new Parking(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      location: this.editForm.get(['location'])!.value,
      places: this.editForm.get(['places'])!.value,
      refrigeratedPlaces: this.editForm.get(['refrigeratedPlaces'])!.value,
      lzvPlaces: this.editForm.get(['lzvPlaces'])!.value,
      hourlyRate: this.editForm.get(['hourlyRate'])!.value,
      pricingUrl: this.editForm.get(['pricingUrl'])!.value,
      otherServicesDescription: this.editForm.get(['otherServicesDescription'])!.value,
      organization: this.editForm.get(['organization'])!.value,
      createdOn: this.editForm.get(['createdOn'])!.value ? dayjs(this.editForm.get(['createdOn'])!.value, DATE_TIME_FORMAT) : undefined,
      createdBy: this.editForm.get(['createdBy'])!.value,
      updatedOn: this.editForm.get(['updatedOn'])!.value ? dayjs(this.editForm.get(['updatedOn'])!.value, DATE_TIME_FORMAT) : undefined,
      updatedBy: this.editForm.get(['updatedBy'])!.value,
      isActive: this.editForm.get(['isActive'])!.value,
      parking: this.editForm.get(['parking'])!.value,
    };
  }
}
