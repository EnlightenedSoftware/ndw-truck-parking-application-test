import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParkingComponent } from '../list/parking.component';
import { ParkingDetailComponent } from '../detail/parking-detail.component';
import { ParkingUpdateComponent } from '../update/parking-update.component';
import { ParkingRoutingResolveService } from './parking-routing-resolve.service';

const parkingRoute: Routes = [
  {
    path: '',
    component: ParkingComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParkingDetailComponent,
    resolve: {
      parking: ParkingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParkingUpdateComponent,
    resolve: {
      parking: ParkingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParkingUpdateComponent,
    resolve: {
      parking: ParkingRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(parkingRoute)],
  exports: [RouterModule],
})
export class ParkingRoutingModule {}
