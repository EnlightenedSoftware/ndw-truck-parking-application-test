import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IParkingEntrance, ParkingEntrance } from '../parking-entrance.model';
import { ParkingEntranceService } from '../service/parking-entrance.service';

@Injectable({ providedIn: 'root' })
export class ParkingEntranceRoutingResolveService implements Resolve<IParkingEntrance> {
  constructor(protected service: ParkingEntranceService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IParkingEntrance> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((parkingEntrance: HttpResponse<ParkingEntrance>) => {
          if (parkingEntrance.body) {
            return of(parkingEntrance.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ParkingEntrance());
  }
}
