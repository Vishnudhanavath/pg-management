import React, { useState } from 'react';
import {
  BedDouble,
  User,
  Users,
  Check,
  Building2,
  IndianRupee,
  DoorClosed,
} from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useRoomStore, getRoomTypeFromBeds } from '../../../store/useRoomStore';
import { usePropertyStore } from '../../../store/usePropertyStore';
import { toast } from '../../../store/useToastStore';
import type { RoomStatus } from '../../../types/room';

interface AddRoomFormProps {
  onSuccess: () => void;
}

const AddRoomForm: React.FC<AddRoomFormProps> = ({ onSuccess }) => {
  const { addRoom, activeFloor, rooms } = useRoomStore();
  const { selectedProperty } = usePropertyStore();
  const getNextRoomNumberForFloor = (f: number) => {
    const floorRooms = rooms.filter(
      (r) => r.propertyId === selectedProperty?.id && r.floor === f
    );
    let highestSuffix = 0;
    floorRooms.forEach((r) => {
      const match = r.roomNumber.match(/\d+$/);
      if (match) {
        const num = parseInt(match[0], 10);
        const suffix = num % 100;
        if (suffix > highestSuffix) highestSuffix = suffix;
      }
    });
    const nextSuffix = highestSuffix > 0 ? highestSuffix + 1 : floorRooms.length + 1;
    return `${f}${nextSuffix < 10 ? '0' : ''}${nextSuffix}`;
  };

  const floor = activeFloor;
  const [roomNumber, setRoomNumber] = useState<string>(getNextRoomNumberForFloor(activeFloor));
  const [bedCapacity, setBedCapacity] = useState<number>(2);
  const [rent, setRent] = useState<string>(
    selectedProperty?.sharingRents?.[2]?.toString() || '8500'
  );
  const [status, setStatus] = useState<RoomStatus>('available');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    }

    const rentVal = Number(rent);
    if (isNaN(rentVal) || rentVal <= 0) {
      newErrors.rent = 'Please enter valid monthly rent';
    }

    if (!bedCapacity || bedCapacity < 1 || bedCapacity > 10) {
      newErrors.bedCapacity = 'Bed count must be between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validate() || !selectedProperty) return;

    setIsSubmitting(true);
    try {
      addRoom({
        propertyId: selectedProperty.id,
        roomNumber: roomNumber.trim(),
        floor,
        type: getRoomTypeFromBeds(bedCapacity),
        capacity: bedCapacity,
        rent: Number(rent),
        status,
        occupiedCount: 0,
        amenities: [],
      });

      toast.success(
        `Room ${roomNumber.trim()} Created`,
        `Floor ${floor} • ${bedCapacity} Beds • ₹${Number(rent).toLocaleString()}/bed/mo`
      );

      onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Room Number & Rent */}
      <div className="form-row-2">
        <Input
          label={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Building2 size={14} style={{ color: 'var(--primary)' }} />
              Room Number *
            </span>
          }
          placeholder="e.g. 101, 102, 201"
          value={roomNumber}
          onChange={(e) => setRoomNumber(e.target.value)}
          error={errors.roomNumber}
          autoFocus
        />

        <Input
          label={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <IndianRupee size={14} style={{ color: 'var(--primary)' }} />
              Rent per Bed (₹/month) *
            </span>
          }
          type="number"
          placeholder="e.g. 8500"
          value={rent}
          onChange={(e) => setRent(e.target.value)}
          error={errors.rent}
        />
      </div>

      {/* Bed Capacity / Sharing Type Cards */}
      <div className="input-group">
        <label className="input-label">
          <BedDouble size={14} style={{ color: 'var(--primary)' }} />
          Number of Beds (Sharing Type) *
        </label>
        <div className="bed-capacity-grid">
          {[
            { beds: 1, label: 'Single', sub: '1 Bed / Private Room', icon: <User size={16} /> },
            { beds: 2, label: 'Double', sub: '2 Beds / 2 Sharing', icon: <Users size={16} /> },
            { beds: 3, label: 'Triple', sub: '3 Beds / 3 Sharing', icon: <Users size={16} /> },
            { beds: 4, label: '4-Sharing', sub: '4 Beds / Dorm style', icon: <Users size={16} /> },
          ].map((item) => {
            const isSelected = bedCapacity === item.beds;
            return (
              <button
                type="button"
                key={item.beds}
                className={`bed-option-card ${isSelected ? 'active' : ''}`}
                onClick={() => {
                  setBedCapacity(item.beds);
                  if (selectedProperty?.sharingRents?.[item.beds]) {
                    setRent(selectedProperty.sharingRents[item.beds].toString());
                  }
                }}
              >
                <div className="bed-option-icon">{item.icon}</div>
                <div className="bed-option-info">
                  <span className="bed-option-title">{item.label}</span>
                  <span className="bed-option-sub">{item.sub}</span>
                </div>
                {isSelected && <Check size={14} className="bed-option-check" />}
              </button>
            );
          })}
        </div>
        {errors.bedCapacity && <span className="input-error-text">{errors.bedCapacity}</span>}
      </div>

      {/* Initial Status */}
      <div className="input-group">
        <label className="input-label">Initial Room Status</label>
        <div className="status-selector-row">
          {(['available', 'occupied', 'maintenance'] as RoomStatus[]).map((s) => (
            <button
              type="button"
              key={s}
              className={`status-pill-btn status-${s} ${status === s ? 'active' : ''}`}
              onClick={() => setStatus(s)}
            >
              <span className={`status-dot dot-${s}`} />
              {s === 'available' ? 'Available' : s === 'occupied' ? 'Occupied' : 'Under Maintenance'}
            </button>
          ))}
        </div>
      </div>



      {/* Footer Submit Button */}
      <div className="modal-footer" style={{ margin: '20px -24px -20px -24px' }}>
        <span className="footer-required-hint">* Required fields</span>
        <div className="modal-footer-actions">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            id="btn-submit-room"
          >
            <Check size={16} style={{ marginRight: '6px' }} />
            {isSubmitting ? 'Adding Room...' : 'Apply'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export const AddRoomModal: React.FC = () => {
  const { isAddRoomModalOpen, closeAddRoomModal, activeFloor } = useRoomStore();
  const { selectedProperty } = usePropertyStore();

  const modalTitle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <DoorClosed size={20} style={{ color: 'var(--primary)' }} />
      <span>Add Room to Floor {activeFloor}</span>
    </div>
  );

  return (
    <Modal
      isOpen={isAddRoomModalOpen}
      onClose={closeAddRoomModal}
      title={modalTitle}
      subtitle={`Configure room number, bed capacity, and monthly rent for ${selectedProperty?.name || 'this property'}.`}
      maxWidth="680px"
    >
      {isAddRoomModalOpen && <AddRoomForm onSuccess={closeAddRoomModal} />}
    </Modal>
  );
};
