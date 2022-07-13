import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParkingEntranceDetailComponent } from './parking-entrance-detail.component';

describe('ParkingEntrance Management Detail Component', () => {
  let comp: ParkingEntranceDetailComponent;
  let fixture: ComponentFixture<ParkingEntranceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParkingEntranceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ parkingEntrance: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParkingEntranceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParkingEntranceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load parkingEntrance on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.parkingEntrance).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
