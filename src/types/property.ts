export type PropertyType = 'Co-ed' | 'Men' | 'Women';

export interface Property {
  id: string;
  name: string;
  address: string;
  totalRooms: number;
  totalFloors: number;
  roomsPerFloor?: number;
  bedsPerRoom?: number;
  occupancyRate?: number;
  propertyType?: PropertyType;
  amenities?: string[];
  contactPhone?: string;
  description?: string;
  sharingRents?: Record<number, number>;
}

