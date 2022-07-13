import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAddress, Address } from '../address.model';
import { AddressService } from '../service/address.service';
import { IParking } from 'app/entities/parking/parking.model';
import { ParkingService } from 'app/entities/parking/service/parking.service';
import { IOrganization } from 'app/entities/organization/organization.model';
import { OrganizationService } from 'app/entities/organization/service/organization.service';

@Component({
  selector: 'jhi-address-update',
  templateUrl: './address-update.component.html',
})
export class AddressUpdateComponent implements OnInit {
  isSaving = false;

  addressesCollection: IParking[] = [];
  organizationsSharedCollection: IOrganization[] = [];

  editForm = this.fb.group({
    id: [],
    street: [],
    houseNumber: [],
    postalCode: [],
    city: [],
    address: [],
    address: [],
  });

  constructor(
    protected addressService: AddressService,
    protected parkingService: ParkingService,
    protected organizationService: OrganizationService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ address }) => {
      this.updateForm(address);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const address = this.createFromForm();
    if (address.id !== undefined) {
      this.subscribeToSaveResponse(this.addressService.update(address));
    } else {
      this.subscribeToSaveResponse(this.addressService.create(address));
    }
  }

  trackParkingById(_index: number, item: IParking): number {
    return item.id!;
  }

  trackOrganizationById(_index: number, item: IOrganization): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAddress>>): void {
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

  protected updateForm(address: IAddress): void {
    this.editForm.patchValue({
      id: address.id,
      street: address.street,
      houseNumber: address.houseNumber,
      postalCode: address.postalCode,
      city: address.city,
      address: address.address,
      address: address.address,
    });

    this.addressesCollection = this.parkingService.addParkingToCollectionIfMissing(this.addressesCollection, address.address);
    this.organizationsSharedCollection = this.organizationService.addOrganizationToCollectionIfMissing(
      this.organizationsSharedCollection,
      address.address
    );
  }

  protected loadRelationshipsOptions(): void {
    this.parkingService
      .query({ filter: 'address-is-null' })
      .pipe(map((res: HttpResponse<IParking[]>) => res.body ?? []))
      .pipe(
        map((parkings: IParking[]) => this.parkingService.addParkingToCollectionIfMissing(parkings, this.editForm.get('address')!.value))
      )
      .subscribe((parkings: IParking[]) => (this.addressesCollection = parkings));

    this.organizationService
      .query()
      .pipe(map((res: HttpResponse<IOrganization[]>) => res.body ?? []))
      .pipe(
        map((organizations: IOrganization[]) =>
          this.organizationService.addOrganizationToCollectionIfMissing(organizations, this.editForm.get('address')!.value)
        )
      )
      .subscribe((organizations: IOrganization[]) => (this.organizationsSharedCollection = organizations));
  }

  protected createFromForm(): IAddress {
    return {
      ...new Address(),
      id: this.editForm.get(['id'])!.value,
      street: this.editForm.get(['street'])!.value,
      houseNumber: this.editForm.get(['houseNumber'])!.value,
      postalCode: this.editForm.get(['postalCode'])!.value,
      city: this.editForm.get(['city'])!.value,
      address: this.editForm.get(['address'])!.value,
      address: this.editForm.get(['address'])!.value,
    };
  }
}
