export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  propertyId: string;
  roomId: string;
  roomNumber: string;
  moveInDate: string;
  depositAmount: number;
  monthlyRent: number;
  status: 'active' | 'notice' | 'moved_out';
}
