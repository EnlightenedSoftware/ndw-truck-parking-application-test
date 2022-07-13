export interface IParkingEntrance {
  id?: number;
  location?: string | null;
  primaryRoadId?: string | null;
  alternativeRoadId?: string | null;
}

export class ParkingEntrance implements IParkingEntrance {
  constructor(
    public id?: number,
    public location?: string | null,
    public primaryRoadId?: string | null,
    public alternativeRoadId?: string | null
  ) {}
}

export function getParkingEntranceIdentifier(parkingEntrance: IParkingEntrance): number | undefined {
  return parkingEntrance.id;
}
