import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ParkingEntranceComponent } from '../list/parking-entrance.component';
import { ParkingEntranceDetailComponent } from '../detail/parking-entrance-detail.component';
import { ParkingEntranceUpdateComponent } from '../update/parking-entrance-update.component';
import { ParkingEntranceRoutingResolveService } from './parking-entrance-routing-resolve.service';

const parkingEntranceRoute: Routes = [
  {
    path: '',
    component: ParkingEntranceComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ParkingEntranceDetailComponent,
    resolve: {
      parkingEntrance: ParkingEntranceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ParkingEntranceUpdateComponent,
    resolve: {
      parkingEntrance: ParkingEntranceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ParkingEntranceUpdateComponent,
    resolve: {
      parkingEntrance: ParkingEntranceRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(parkingEntranceRoute)],
  exports: [RouterModule],
})
export class ParkingEntranceRoutingModule {}
