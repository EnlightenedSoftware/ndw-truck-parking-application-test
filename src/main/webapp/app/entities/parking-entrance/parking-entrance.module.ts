import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ParkingEntranceComponent } from './list/parking-entrance.component';
import { ParkingEntranceDetailComponent } from './detail/parking-entrance-detail.component';
import { ParkingEntranceUpdateComponent } from './update/parking-entrance-update.component';
import { ParkingEntranceDeleteDialogComponent } from './delete/parking-entrance-delete-dialog.component';
import { ParkingEntranceRoutingModule } from './route/parking-entrance-routing.module';

@NgModule({
  imports: [SharedModule, ParkingEntranceRoutingModule],
  declarations: [
    ParkingEntranceComponent,
    ParkingEntranceDetailComponent,
    ParkingEntranceUpdateComponent,
    ParkingEntranceDeleteDialogComponent,
  ],
  entryComponents: [ParkingEntranceDeleteDialogComponent],
})
export class ParkingEntranceModule {}
