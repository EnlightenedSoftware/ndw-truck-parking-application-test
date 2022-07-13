import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IOrganization, Organization } from '../organization.model';
import { OrganizationService } from '../service/organization.service';
import { IParking } from 'app/entities/parking/parking.model';
import { ParkingService } from 'app/entities/parking/service/parking.service';

@Component({
  selector: 'jhi-organization-update',
  templateUrl: './organization-update.component.html',
})
export class OrganizationUpdateComponent implements OnInit {
  isSaving = false;

  organizationsCollection: IParking[] = [];

  editForm = this.fb.group({
    id: [],
    name: [],
    website: [],
    emailAddress: [],
    phoneNumber: [],
    createdOn: [],
    createdBy: [],
    updatedOn: [],
    updatedBy: [],
    isActive: [],
    organization: [],
  });

  constructor(
    protected organizationService: OrganizationService,
    protected parkingService: ParkingService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ organization }) => {
      if (organization.id === undefined) {
        const today = dayjs().startOf('day');
        organization.createdOn = today;
        organization.updatedOn = today;
      }

      this.updateForm(organization);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const organization = this.createFromForm();
    if (organization.id !== undefined) {
      this.subscribeToSaveResponse(this.organizationService.update(organization));
    } else {
      this.subscribeToSaveResponse(this.organizationService.create(organization));
    }
  }

  trackParkingById(_index: number, item: IParking): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrganization>>): void {
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

  protected updateForm(organization: IOrganization): void {
    this.editForm.patchValue({
      id: organization.id,
      name: organization.name,
      website: organization.website,
      emailAddress: organization.emailAddress,
      phoneNumber: organization.phoneNumber,
      createdOn: organization.createdOn ? organization.createdOn.format(DATE_TIME_FORMAT) : null,
      createdBy: organization.createdBy,
      updatedOn: organization.updatedOn ? organization.updatedOn.format(DATE_TIME_FORMAT) : null,
      updatedBy: organization.updatedBy,
      isActive: organization.isActive,
      organization: organization.organization,
    });

    this.organizationsCollection = this.parkingService.addParkingToCollectionIfMissing(
      this.organizationsCollection,
      organization.organization
    );
  }

  protected loadRelationshipsOptions(): void {
    this.parkingService
      .query({ filter: 'organization-is-null' })
      .pipe(map((res: HttpResponse<IParking[]>) => res.body ?? []))
      .pipe(
        map((parkings: IParking[]) =>
          this.parkingService.addParkingToCollectionIfMissing(parkings, this.editForm.get('organization')!.value)
        )
      )
      .subscribe((parkings: IParking[]) => (this.organizationsCollection = parkings));
  }

  protected createFromForm(): IOrganization {
    return {
      ...new Organization(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      website: this.editForm.get(['website'])!.value,
      emailAddress: this.editForm.get(['emailAddress'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
      createdOn: this.editForm.get(['createdOn'])!.value ? dayjs(this.editForm.get(['createdOn'])!.value, DATE_TIME_FORMAT) : undefined,
      createdBy: this.editForm.get(['createdBy'])!.value,
      updatedOn: this.editForm.get(['updatedOn'])!.value ? dayjs(this.editForm.get(['updatedOn'])!.value, DATE_TIME_FORMAT) : undefined,
      updatedBy: this.editForm.get(['updatedBy'])!.value,
      isActive: this.editForm.get(['isActive'])!.value,
      organization: this.editForm.get(['organization'])!.value,
    };
  }
}
