import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParking, Parking } from '../parking.model';
import { ParkingService } from '../service/parking.service';

@Injectable({ providedIn: 'root' })
export class ParkingRoutingResolveService implements Resolve<IParking> {
  constructor(protected service: ParkingService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParking> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((parking: HttpResponse<Parking>) => {
          if (parking.body) {
            return of(parking.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Parking());
  }
}
