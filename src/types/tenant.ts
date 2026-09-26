export interface Tenant {
  id: string;
  name: string;
  age?: number;
  phone: string;
  aadhaarNumber?: string;
  alternatePhone?: string;
  emergencyPhone?: string;
  email: string;
  address?: string;
  propertyId: string;
  roomId: string;
  roomNumber: string;
  bedLabel?: string;
  sharingType?: string;
  moveInDate: string;
  expectedMoveOutDate?: string;
  depositAmount: number;
  advancePayment?: number;
  monthlyRent: number;
  negotiatedRent?: number;
  aadhaarProof?: {
    name: string;
    type: string;
    dataUrl: string;
  };
  status: 'active' | 'notice' | 'moved_out';
}
