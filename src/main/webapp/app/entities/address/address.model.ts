import { IParking } from 'app/entities/parking/parking.model';
import { IOrganization } from 'app/entities/organization/organization.model';

export interface IAddress {
  id?: number;
  street?: string | null;
  houseNumber?: string | null;
  postalCode?: string | null;
  city?: string | null;
  address?: IParking | null;
  address?: IOrganization | null;
}

export class Address implements IAddress {
  constructor(
    public id?: number,
    public street?: string | null,
    public houseNumber?: string | null,
    public postalCode?: string | null,
    public city?: string | null,
    public address?: IParking | null,
    public address?: IOrganization | null
  ) {}
}

export function getAddressIdentifier(address: IAddress): number | undefined {
  return address.id;
}
