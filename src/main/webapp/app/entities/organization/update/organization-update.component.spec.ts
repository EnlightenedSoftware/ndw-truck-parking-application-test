import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { OrganizationService } from '../service/organization.service';
import { IOrganization, Organization } from '../organization.model';
import { IParking } from 'app/entities/parking/parking.model';
import { ParkingService } from 'app/entities/parking/service/parking.service';

import { OrganizationUpdateComponent } from './organization-update.component';

describe('Organization Management Update Component', () => {
  let comp: OrganizationUpdateComponent;
  let fixture: ComponentFixture<OrganizationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let organizationService: OrganizationService;
  let parkingService: ParkingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [OrganizationUpdateComponent],
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
      .overrideTemplate(OrganizationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(OrganizationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    organizationService = TestBed.inject(OrganizationService);
    parkingService = TestBed.inject(ParkingService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call organization query and add missing value', () => {
      const organization: IOrganization = { id: 456 };
      const organization: IParking = { id: 33748 };
      organization.organization = organization;

      const organizationCollection: IParking[] = [{ id: 88541 }];
      jest.spyOn(parkingService, 'query').mockReturnValue(of(new HttpResponse({ body: organizationCollection })));
      const expectedCollection: IParking[] = [organization, ...organizationCollection];
      jest.spyOn(parkingService, 'addParkingToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ organization });
      comp.ngOnInit();

      expect(parkingService.query).toHaveBeenCalled();
      expect(parkingService.addParkingToCollectionIfMissing).toHaveBeenCalledWith(organizationCollection, organization);
      expect(comp.organizationsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const organization: IOrganization = { id: 456 };
      const organization: IParking = { id: 18776 };
      organization.organization = organization;

      activatedRoute.data = of({ organization });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(organization));
      expect(comp.organizationsCollection).toContain(organization);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Organization>>();
      const organization = { id: 123 };
      jest.spyOn(organizationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organization });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organization }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(organizationService.update).toHaveBeenCalledWith(organization);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Organization>>();
      const organization = new Organization();
      jest.spyOn(organizationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organization });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: organization }));
      saveSubject.complete();

      // THEN
      expect(organizationService.create).toHaveBeenCalledWith(organization);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Organization>>();
      const organization = { id: 123 };
      jest.spyOn(organizationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ organization });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(organizationService.update).toHaveBeenCalledWith(organization);
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
