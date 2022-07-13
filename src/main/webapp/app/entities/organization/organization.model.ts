import dayjs from 'dayjs/esm';
import { IParking } from 'app/entities/parking/parking.model';

export interface IOrganization {
  id?: number;
  name?: string | null;
  website?: string | null;
  emailAddress?: string | null;
  phoneNumber?: string | null;
  createdOn?: dayjs.Dayjs | null;
  createdBy?: string | null;
  updatedOn?: dayjs.Dayjs | null;
  updatedBy?: string | null;
  isActive?: string | null;
  organization?: IParking | null;
}

export class Organization implements IOrganization {
  constructor(
    public id?: number,
    public name?: string | null,
    public website?: string | null,
    public emailAddress?: string | null,
    public phoneNumber?: string | null,
    public createdOn?: dayjs.Dayjs | null,
    public createdBy?: string | null,
    public updatedOn?: dayjs.Dayjs | null,
    public updatedBy?: string | null,
    public isActive?: string | null,
    public organization?: IParking | null
  ) {}
}

export function getOrganizationIdentifier(organization: IOrganization): number | undefined {
  return organization.id;
}
