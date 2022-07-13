import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IParkingEntrance, ParkingEntrance } from '../parking-entrance.model';
import { ParkingEntranceService } from '../service/parking-entrance.service';

@Component({
  selector: 'jhi-parking-entrance-update',
  templateUrl: './parking-entrance-update.component.html',
})
export class ParkingEntranceUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    location: [],
    primaryRoadId: [],
    alternativeRoadId: [],
  });

  constructor(
    protected parkingEntranceService: ParkingEntranceService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ parkingEntrance }) => {
      this.updateForm(parkingEntrance);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const parkingEntrance = this.createFromForm();
    if (parkingEntrance.id !== undefined) {
      this.subscribeToSaveResponse(this.parkingEntranceService.update(parkingEntrance));
    } else {
      this.subscribeToSaveResponse(this.parkingEntranceService.create(parkingEntrance));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IParkingEntrance>>): void {
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

  protected updateForm(parkingEntrance: IParkingEntrance): void {
    this.editForm.patchValue({
      id: parkingEntrance.id,
      location: parkingEntrance.location,
      primaryRoadId: parkingEntrance.primaryRoadId,
      alternativeRoadId: parkingEntrance.alternativeRoadId,
    });
  }

  protected createFromForm(): IParkingEntrance {
    return {
      ...new ParkingEntrance(),
      id: this.editForm.get(['id'])!.value,
      location: this.editForm.get(['location'])!.value,
      primaryRoadId: this.editForm.get(['primaryRoadId'])!.value,
      alternativeRoadId: this.editForm.get(['alternativeRoadId'])!.value,
    };
  }
}
