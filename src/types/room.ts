export type RoomType = 'single' | 'double' | 'triple' | 'four_sharing';
export type RoomStatus = 'available' | 'occupied' | 'maintenance';

export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  floor: number;
  type: RoomType;
  rent: number;
  status: RoomStatus;
  capacity: number;
  occupiedCount: number;
  amenities?: string[];
}
