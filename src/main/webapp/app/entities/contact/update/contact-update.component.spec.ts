import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ContactService } from '../service/contact.service';
import { IContact, Contact } from '../contact.model';
import { IParking } from 'app/entities/parking/parking.model';
import { ParkingService } from 'app/entities/parking/service/parking.service';

import { ContactUpdateComponent } from './contact-update.component';

describe('Contact Management Update Component', () => {
  let comp: ContactUpdateComponent;
  let fixture: ComponentFixture<ContactUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let contactService: ContactService;
  let parkingService: ParkingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ContactUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ContactUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ContactUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    contactService = TestBed.inject(ContactService);
    parkingService = TestBed.inject(ParkingService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call contact query and add missing value', () => {
      const contact: IContact = { id: 456 };
      const contact: IParking = { id: 99754 };
      contact.contact = contact;

      const contactCollection: IParking[] = [{ id: 53709 }];
      jest.spyOn(parkingService, 'query').mockReturnValue(of(new HttpResponse({ body: contactCollection })));
      const expectedCollection: IParking[] = [contact, ...contactCollection];
      jest.spyOn(parkingService, 'addParkingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ contact });
      comp.ngOnInit();

      expect(parkingService.query).toHaveBeenCalled();
      expect(parkingService.addParkingToCollectionIfMissing).toHaveBeenCalledWith(contactCollection, contact);
      expect(comp.contactsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const contact: IContact = { id: 456 };
      const contact: IParking = { id: 16495 };
      contact.contact = contact;

      activatedRoute.data = of({ contact });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(contact));
      expect(comp.contactsCollection).toContain(contact);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contact>>();
      const contact = { id: 123 };
      jest.spyOn(contactService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contact });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contact }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(contactService.update).toHaveBeenCalledWith(contact);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contact>>();
      const contact = new Contact();
      jest.spyOn(contactService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contact });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contact }));
      saveSubject.complete();

      // THEN
      expect(contactService.create).toHaveBeenCalledWith(contact);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contact>>();
      const contact = { id: 123 };
      jest.spyOn(contactService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contact });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(contactService.update).toHaveBeenCalledWith(contact);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackParkingById', () => {
      it('Should return tracked Parking primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackParkingById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
