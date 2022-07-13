import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParkingComponent } from './list/parking.component';
import { ParkingDetailComponent } from './detail/parking-detail.component';
import { ParkingUpdateComponent } from './update/parking-update.component';
import { ParkingDeleteDialogComponent } from './delete/parking-delete-dialog.component';
import { ParkingRoutingModule } from './route/parking-routing.module';

@NgModule({
  imports: [SharedModule, ParkingRoutingModule],
  declarations: [ParkingComponent, ParkingDetailComponent, ParkingUpdateComponent, ParkingDeleteDialogComponent],
  entryComponents: [ParkingDeleteDialogComponent],
})
export class ParkingModule {}
