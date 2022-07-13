import dayjs from 'dayjs/esm';
import { IParkingEntrance } from 'app/entities/parking-entrance/parking-entrance.model';

export interface IParking {
  id?: number;
  name?: string | null;
  location?: string | null;
  places?: number | null;
  refrigeratedPlaces?: number | null;
  lzvPlaces?: number | null;
  hourlyRate?: number | null;
  pricingUrl?: string | null;
  otherServicesDescription?: string | null;
  organization?: string | null;
  createdOn?: dayjs.Dayjs | null;
  createdBy?: string | null;
  updatedOn?: dayjs.Dayjs | null;
  updatedBy?: string | null;
  isActive?: string | null;
  parking?: IParkingEntrance | null;
}

export class Parking implements IParking {
  constructor(
    public id?: number,
    public name?: string | null,
    public location?: string | null,
    public places?: number | null,
    public refrigeratedPlaces?: number | null,
    public lzvPlaces?: number | null,
    public hourlyRate?: number | null,
    public pricingUrl?: string | null,
    public otherServicesDescription?: string | null,
    public organization?: string | null,
    public createdOn?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public updatedOn?: dayjs.Dayjs | null,
    public updatedBy?: string | null,
    public isActive?: string | null,
    public parking?: IParkingEntrance | null
  ) {}
}

export function getParkingIdentifier(parking: IParking): number | undefined {
  return parking.id;
}
