import type { Property } from '../types/property';

export const mockProperties: Property[] = [
  {
    id: 'prop-1',
    name: 'Serene Living PG',
    address: '124 Indiranagar, Bengaluru, Karnataka 560038',
    totalRooms: 24,
    totalFloors: 3,
    roomsPerFloor: 8,
    bedsPerRoom: 2,
    occupancyRate: 88,
    sharingRents: { 1: 14000, 2: 9500, 3: 7500, 4: 6000 },
  },
  {
    id: 'prop-2',
    name: 'Green View Luxury PG',
    address: '45 Koramangala 4th Block, Bengaluru, Karnataka 560034',
    totalRooms: 18,
    totalFloors: 2,
    roomsPerFloor: 9,
    bedsPerRoom: 2,
    occupancyRate: 94,
    sharingRents: { 1: 15000, 2: 9500, 3: 8000, 4: 6500 },
  },
];
