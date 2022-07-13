import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParkingService } from '../service/parking.service';
import { IParking, Parking } from '../parking.model';
import { IParkingEntrance } from 'app/entities/parking-entrance/parking-entrance.model';
import { ParkingEntranceService } from 'app/entities/parking-entrance/service/parking-entrance.service';

import { ParkingUpdateComponent } from './parking-update.component';

describe('Parking Management Update Component', () => {
  let comp: ParkingUpdateComponent;
  let fixture: ComponentFixture<ParkingUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let parkingService: ParkingService;
  let parkingEntranceService: ParkingEntranceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParkingUpdateComponent],
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
      .overrideTemplate(ParkingUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParkingUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    parkingService = TestBed.inject(ParkingService);
    parkingEntranceService = TestBed.inject(ParkingEntranceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ParkingEntrance query and add missing value', () => {
      const parking: IParking = { id: 456 };
      const parking: IParkingEntrance = { id: 89079 };
      parking.parking = parking;

      const parkingEntranceCollection: IParkingEntrance[] = [{ id: 44100 }];
      jest.spyOn(parkingEntranceService, 'query').mockReturnValue(of(new HttpResponse({ body: parkingEntranceCollection })));
      const additionalParkingEntrances = [parking];
      const expectedCollection: IParkingEntrance[] = [...additionalParkingEntrances, ...parkingEntranceCollection];
      jest.spyOn(parkingEntranceService, 'addParkingEntranceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ parking });
      comp.ngOnInit();

      expect(parkingEntranceService.query).toHaveBeenCalled();
      expect(parkingEntranceService.addParkingEntranceToCollectionIfMissing).toHaveBeenCalledWith(
        parkingEntranceCollection,
        ...additionalParkingEntrances
      );
      expect(comp.parkingEntrancesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const parking: IParking = { id: 456 };
      const parking: IParkingEntrance = { id: 9868 };
      parking.parking = parking;

      activatedRoute.data = of({ parking });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(parking));
      expect(comp.parkingEntrancesSharedCollection).toContain(parking);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Parking>>();
      const parking = { id: 123 };
      jest.spyOn(parkingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parking });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parking }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(parkingService.update).toHaveBeenCalledWith(parking);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Parking>>();
      const parking = new Parking();
      jest.spyOn(parkingService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parking });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parking }));
      saveSubject.complete();

      // THEN
      expect(parkingService.create).toHaveBeenCalledWith(parking);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Parking>>();
      const parking = { id: 123 };
      jest.spyOn(parkingService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parking });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(parkingService.update).toHaveBeenCalledWith(parking);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackParkingEntranceById', () => {
      it('Should return tracked ParkingEntrance primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackParkingEntranceById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
