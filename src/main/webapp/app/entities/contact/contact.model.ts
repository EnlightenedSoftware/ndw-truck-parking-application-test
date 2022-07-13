import { IParking } from 'app/entities/parking/parking.model';

export interface IContact {
  id?: number;
  department?: string | null;
  emailAddress?: string | null;
  phoneNumber?: string | null;
  contact?: IParking | null;
}

export class Contact implements IContact {
  constructor(
    public id?: number,
    public department?: string | null,
    public emailAddress?: string | null,
    public phoneNumber?: string | null,
    public contact?: IParking | null
  ) {}
}

export function getContactIdentifier(contact: IContact): number | undefined {
  return contact.id;
}
