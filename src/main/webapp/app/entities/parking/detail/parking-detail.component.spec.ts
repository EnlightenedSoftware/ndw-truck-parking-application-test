import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ParkingDetailComponent } from './parking-detail.component';

describe('Parking Management Detail Component', () => {
  let comp: ParkingDetailComponent;
  let fixture: ComponentFixture<ParkingDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ParkingDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ parking: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ParkingDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ParkingDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load parking on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.parking).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
