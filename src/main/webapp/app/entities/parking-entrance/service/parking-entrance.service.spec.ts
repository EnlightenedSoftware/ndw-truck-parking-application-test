import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IParkingEntrance, ParkingEntrance } from '../parking-entrance.model';

import { ParkingEntranceService } from './parking-entrance.service';

describe('ParkingEntrance Service', () => {
  let service: ParkingEntranceService;
  let httpMock: HttpTestingController;
  let elemDefault: IParkingEntrance;
  let expectedResult: IParkingEntrance | IParkingEntrance[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ParkingEntranceService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      location: 'AAAAAAA',
      primaryRoadId: 'AAAAAAA',
      alternativeRoadId: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ParkingEntrance', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ParkingEntrance()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ParkingEntrance', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          location: 'BBBBBB',
          primaryRoadId: 'BBBBBB',
          alternativeRoadId: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ParkingEntrance', () => {
      const patchObject = Object.assign(
        {
          location: 'BBBBBB',
          alternativeRoadId: 'BBBBBB',
        },
        new ParkingEntrance()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ParkingEntrance', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          location: 'BBBBBB',
          primaryRoadId: 'BBBBBB',
          alternativeRoadId: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a ParkingEntrance', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addParkingEntranceToCollectionIfMissing', () => {
      it('should add a ParkingEntrance to an empty array', () => {
        const parkingEntrance: IParkingEntrance = { id: 123 };
        expectedResult = service.addParkingEntranceToCollectionIfMissing([], parkingEntrance);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parkingEntrance);
      });

      it('should not add a ParkingEntrance to an array that contains it', () => {
        const parkingEntrance: IParkingEntrance = { id: 123 };
        const parkingEntranceCollection: IParkingEntrance[] = [
          {
            ...parkingEntrance,
          },
          { id: 456 },
        ];
        expectedResult = service.addParkingEntranceToCollectionIfMissing(parkingEntranceCollection, parkingEntrance);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ParkingEntrance to an array that doesn't contain it", () => {
        const parkingEntrance: IParkingEntrance = { id: 123 };
        const parkingEntranceCollection: IParkingEntrance[] = [{ id: 456 }];
        expectedResult = service.addParkingEntranceToCollectionIfMissing(parkingEntranceCollection, parkingEntrance);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parkingEntrance);
      });

      it('should add only unique ParkingEntrance to an array', () => {
        const parkingEntranceArray: IParkingEntrance[] = [{ id: 123 }, { id: 456 }, { id: 18508 }];
        const parkingEntranceCollection: IParkingEntrance[] = [{ id: 123 }];
        expectedResult = service.addParkingEntranceToCollectionIfMissing(parkingEntranceCollection, ...parkingEntranceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const parkingEntrance: IParkingEntrance = { id: 123 };
        const parkingEntrance2: IParkingEntrance = { id: 456 };
        expectedResult = service.addParkingEntranceToCollectionIfMissing([], parkingEntrance, parkingEntrance2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(parkingEntrance);
        expect(expectedResult).toContain(parkingEntrance2);
      });

      it('should accept null and undefined values', () => {
        const parkingEntrance: IParkingEntrance = { id: 123 };
        expectedResult = service.addParkingEntranceToCollectionIfMissing([], null, parkingEntrance, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(parkingEntrance);
      });

      it('should return initial array if no ParkingEntrance is added', () => {
        const parkingEntranceCollection: IParkingEntrance[] = [{ id: 123 }];
        expectedResult = service.addParkingEntranceToCollectionIfMissing(parkingEntranceCollection, undefined, null);
        expect(expectedResult).toEqual(parkingEntranceCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
