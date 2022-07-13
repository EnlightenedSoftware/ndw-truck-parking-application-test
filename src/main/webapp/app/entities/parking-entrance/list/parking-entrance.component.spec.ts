import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ParkingEntranceService } from '../service/parking-entrance.service';

import { ParkingEntranceComponent } from './parking-entrance.component';

describe('ParkingEntrance Management Component', () => {
  let comp: ParkingEntranceComponent;
  let fixture: ComponentFixture<ParkingEntranceComponent>;
  let service: ParkingEntranceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ParkingEntranceComponent],
    })
      .overrideTemplate(ParkingEntranceComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ParkingEntranceComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ParkingEntranceService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.parkingEntrances?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
