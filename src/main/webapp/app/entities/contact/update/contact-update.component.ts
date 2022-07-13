import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IContact, Contact } from '../contact.model';
import { ContactService } from '../service/contact.service';
import { IParking } from 'app/entities/parking/parking.model';
import { ParkingService } from 'app/entities/parking/service/parking.service';

@Component({
  selector: 'jhi-contact-update',
  templateUrl: './contact-update.component.html',
})
export class ContactUpdateComponent implements OnInit {
  isSaving = false;

  contactsCollection: IParking[] = [];

  editForm = this.fb.group({
    id: [],
    department: [],
    emailAddress: [],
    phoneNumber: [],
    contact: [],
  });

  constructor(
    protected contactService: ContactService,
    protected parkingService: ParkingService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ contact }) => {
      this.updateForm(contact);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const contact = this.createFromForm();
    if (contact.id !== undefined) {
      this.subscribeToSaveResponse(this.contactService.update(contact));
    } else {
      this.subscribeToSaveResponse(this.contactService.create(contact));
    }
  }

  trackParkingById(_index: number, item: IParking): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IContact>>): void {
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

  protected updateForm(contact: IContact): void {
    this.editForm.patchValue({
      id: contact.id,
      department: contact.department,
      emailAddress: contact.emailAddress,
      phoneNumber: contact.phoneNumber,
      contact: contact.contact,
    });

    this.contactsCollection = this.parkingService.addParkingToCollectionIfMissing(this.contactsCollection, contact.contact);
  }

  protected loadRelationshipsOptions(): void {
    this.parkingService
      .query({ filter: 'contact-is-null' })
      .pipe(map((res: HttpResponse<IParking[]>) => res.body ?? []))
      .pipe(
        map((parkings: IParking[]) => this.parkingService.addParkingToCollectionIfMissing(parkings, this.editForm.get('contact')!.value))
      )
      .subscribe((parkings: IParking[]) => (this.contactsCollection = parkings));
  }

  protected createFromForm(): IContact {
    return {
      ...new Contact(),
      id: this.editForm.get(['id'])!.value,
      department: this.editForm.get(['department'])!.value,
      emailAddress: this.editForm.get(['emailAddress'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
      contact: this.editForm.get(['contact'])!.value,
    };
  }
}
