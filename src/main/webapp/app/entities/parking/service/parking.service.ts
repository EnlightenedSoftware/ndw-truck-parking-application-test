import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParking, getParkingIdentifier } from '../parking.model';

export type EntityResponseType = HttpResponse<IParking>;
export type EntityArrayResponseType = HttpResponse<IParking[]>;

@Injectable({ providedIn: 'root' })
export class ParkingService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/parkings');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(parking: IParking): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(parking);
    return this.http
      .post<IParking>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(parking: IParking): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(parking);
    return this.http
      .put<IParking>(`${this.resourceUrl}/${getParkingIdentifier(parking) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(parking: IParking): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(parking);
    return this.http
      .patch<IParking>(`${this.resourceUrl}/${getParkingIdentifier(parking) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IParking>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IParking[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addParkingToCollectionIfMissing(parkingCollection: IParking[], ...parkingsToCheck: (IParking | null | undefined)[]): IParking[] {
    const parkings: IParking[] = parkingsToCheck.filter(isPresent);
    if (parkings.length > 0) {
      const parkingCollectionIdentifiers = parkingCollection.map(parkingItem => getParkingIdentifier(parkingItem)!);
      const parkingsToAdd = parkings.filter(parkingItem => {
        const parkingIdentifier = getParkingIdentifier(parkingItem);
        if (parkingIdentifier == null || parkingCollectionIdentifiers.includes(parkingIdentifier)) {
          return false;
        }
        parkingCollectionIdentifiers.push(parkingIdentifier);
        return true;
      });
      return [...parkingsToAdd, ...parkingCollection];
    }
    return parkingCollection;
  }

  protected convertDateFromClient(parking: IParking): IParking {
    return Object.assign({}, parking, {
      createdOn: parking.createdOn?.isValid() ? parking.createdOn.toJSON() : undefined,
      updatedOn: parking.updatedOn?.isValid() ? parking.updatedOn.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.createdOn = res.body.createdOn ? dayjs(res.body.createdOn) : undefined;
      res.body.updatedOn = res.body.updatedOn ? dayjs(res.body.updatedOn) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((parking: IParking) => {
        parking.createdOn = parking.createdOn ? dayjs(parking.createdOn) : undefined;
        parking.updatedOn = parking.updatedOn ? dayjs(parking.updatedOn) : undefined;
      });
    }
    return res;
  }
}
