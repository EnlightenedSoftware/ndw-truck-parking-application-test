import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ParkingEntranceService } from '../service/parking-entrance.service';
import { IParkingEntrance, ParkingEntrance } from '../parking-entrance.model';

import { ParkingEntranceUpdateComponent } from './parking-entrance-update.component';

describe('ParkingEntrance Management Update Component', () => {
  let comp: ParkingEntranceUpdateComponent;
  let fixture: ComponentFixture<ParkingEntranceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let parkingEntranceService: ParkingEntranceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ParkingEntranceUpdateComponent],
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
      .overrideTemplate(ParkingEntranceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParkingEntranceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    parkingEntranceService = TestBed.inject(ParkingEntranceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const parkingEntrance: IParkingEntrance = { id: 456 };

      activatedRoute.data = of({ parkingEntrance });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(parkingEntrance));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParkingEntrance>>();
      const parkingEntrance = { id: 123 };
      jest.spyOn(parkingEntranceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parkingEntrance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parkingEntrance }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(parkingEntranceService.update).toHaveBeenCalledWith(parkingEntrance);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParkingEntrance>>();
      const parkingEntrance = new ParkingEntrance();
      jest.spyOn(parkingEntranceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parkingEntrance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: parkingEntrance }));
      saveSubject.complete();

      // THEN
      expect(parkingEntranceService.create).toHaveBeenCalledWith(parkingEntrance);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ParkingEntrance>>();
      const parkingEntrance = { id: 123 };
      jest.spyOn(parkingEntranceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ parkingEntrance });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(parkingEntranceService.update).toHaveBeenCalledWith(parkingEntrance);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
