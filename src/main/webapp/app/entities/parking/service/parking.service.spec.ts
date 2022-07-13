import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IParking, Parking } from '../parking.model';

import { ParkingService } from './parking.service';

describe('Parking Service', () => {
  let service: ParkingService;
  let httpMock: HttpTestingController;
  let elemDefault: IParking;
  let expectedResult: IParking | IParking[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ParkingService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      location: 'AAAAAAA',
      places: 0,
      refrigeratedPlaces: 0,
      lzvPlaces: 0,
      hourlyRate: 0,
      pricingUrl: 'AAAAAAA',
      otherServicesDescription: 'AAAAAAA',
      organization: 'AAAAAAA',
      createdOn: currentDate,
      createdBy: 'AAAAAAA',
      updatedOn: currentDate,
      updatedBy: 'AAAAAAA',
      isActive: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          createdOn: currentDate.format(DATE_TIME_FORMAT),
          updatedOn: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Parking', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          createdOn: currentDate.format(DATE_TIME_FORMAT),
          updatedOn: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdOn: currentDate,
          updatedOn: currentDate,
        },
        returnedFromService
      );

      service.create(new Parking()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Parking', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          location: 'BBBBBB',
          places: 1,
          refrigeratedPlaces: 1,
          lzvPlaces: 1,
          hourlyRate: 1,
          pricingUrl: 'BBBBBB',
          otherServicesDescription: 'BBBBBB',
          organization: 'BBBBBB',
          createdOn: currentDate.format(DATE_TIME_FORMAT),
          createdBy: 'BBBBBB',
          updatedOn: currentDate.format(DATE_TIME_FORMAT),
          updatedBy: 'BBBBBB',
          isActive: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdOn: currentDate,
          updatedOn: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Parking', () => {
      const patchObject = Object.assign(
        {
          lzvPlaces: 1,
          otherServicesDescription: 'BBBBBB',
          organization: 'BBBBBB',
          createdOn: currentDate.format(DATE_TIME_FORMAT),
          createdBy: 'BBBBBB',
          updatedOn: currentDate.format(DATE_TIME_FORMAT),
          updatedBy: 'BBBBBB',
        },
        new Parking()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          createdOn: currentDate,
          updatedOn: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Parking', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          location: 'BBBBBB',
          places: 1,
          refrigeratedPlaces: 1,
          lzvPlaces: 1,
          hourlyRate: 1,
          pricingUrl: 'BBBBBB',
          otherServicesDescription: 'BBBBBB',
          organization: 'BBBBBB',
          createdOn: currentDate.format(DATE_TIME_FORMAT),
          createdBy: 'BBBBBB',
          updatedOn: currentDate.format(DATE_TIME_FORMAT),
          updatedBy: 'BBBBBB',
          isActive: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          createdOn: currentDate,
          updatedOn: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Parking', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addParkingToCollectionIfMissing', () => {
      it('should add a Parking to an empty array', () => {
        const parking: IParking = { id: 123 };
        expectedResult = service.addParkingToCollectionIfMissing([], parking);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parking);
      });

      it('should not add a Parking to an array that contains it', () => {
        const parking: IParking = { id: 123 };
        const parkingCollection: IParking[] = [
          {
            ...parking,
          },
          { id: 456 },
        ];
        expectedResult = service.addParkingToCollectionIfMissing(parkingCollection, parking);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Parking to an array that doesn't contain it", () => {
        const parking: IParking = { id: 123 };
        const parkingCollection: IParking[] = [{ id: 456 }];
        expectedResult = service.addParkingToCollectionIfMissing(parkingCollection, parking);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parking);
      });

      it('should add only unique Parking to an array', () => {
        const parkingArray: IParking[] = [{ id: 123 }, { id: 456 }, { id: 80428 }];
        const parkingCollection: IParking[] = [{ id: 123 }];
        expectedResult = service.addParkingToCollectionIfMissing(parkingCollection, ...parkingArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const parking: IParking = { id: 123 };
        const parking2: IParking = { id: 456 };
        expectedResult = service.addParkingToCollectionIfMissing([], parking, parking2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parking);
        expect(expectedResult).toContain(parking2);
      });

      it('should accept null and undefined values', () => {
        const parking: IParking = { id: 123 };
        expectedResult = service.addParkingToCollectionIfMissing([], null, parking, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parking);
      });

      it('should return initial array if no Parking is added', () => {
        const parkingCollection: IParking[] = [{ id: 123 }];
        expectedResult = service.addParkingToCollectionIfMissing(parkingCollection, undefined, null);
        expect(expectedResult).toEqual(parkingCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
