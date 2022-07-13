import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IParkingEntrance, getParkingEntranceIdentifier } from '../parking-entrance.model';

export type EntityResponseType = HttpResponse<IParkingEntrance>;
export type EntityArrayResponseType = HttpResponse<IParkingEntrance[]>;

@Injectable({ providedIn: 'root' })
export class ParkingEntranceService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/parking-entrances');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(parkingEntrance: IParkingEntrance): Observable<EntityResponseType> {
    return this.http.post<IParkingEntrance>(this.resourceUrl, parkingEntrance, { observe: 'response' });
  }

  update(parkingEntrance: IParkingEntrance): Observable<EntityResponseType> {
    return this.http.put<IParkingEntrance>(
      `${this.resourceUrl}/${getParkingEntranceIdentifier(parkingEntrance) as number}`,
      parkingEntrance,
      { observe: 'response' }
    );
  }

  partialUpdate(parkingEntrance: IParkingEntrance): Observable<EntityResponseType> {
    return this.http.patch<IParkingEntrance>(
      `${this.resourceUrl}/${getParkingEntranceIdentifier(parkingEntrance) as number}`,
      parkingEntrance,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IParkingEntrance>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IParkingEntrance[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addParkingEntranceToCollectionIfMissing(
    parkingEntranceCollection: IParkingEntrance[],
    ...parkingEntrancesToCheck: (IParkingEntrance | null | undefined)[]
  ): IParkingEntrance[] {
    const parkingEntrances: IParkingEntrance[] = parkingEntrancesToCheck.filter(isPresent);
    if (parkingEntrances.length > 0) {
      const parkingEntranceCollectionIdentifiers = parkingEntranceCollection.map(
        parkingEntranceItem => getParkingEntranceIdentifier(parkingEntranceItem)!
      );
      const parkingEntrancesToAdd = parkingEntrances.filter(parkingEntranceItem => {
        const parkingEntranceIdentifier = getParkingEntranceIdentifier(parkingEntranceItem);
        if (parkingEntranceIdentifier == null || parkingEntranceCollectionIdentifiers.includes(parkingEntranceIdentifier)) {
          return false;
        }
        parkingEntranceCollectionIdentifiers.push(parkingEntranceIdentifier);
        return true;
      });
      return [...parkingEntrancesToAdd, ...parkingEntranceCollection];
    }
    return parkingEntranceCollection;
  }
}
