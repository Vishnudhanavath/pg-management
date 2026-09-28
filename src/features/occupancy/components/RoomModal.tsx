import React, { useState, useEffect } from 'react';
import {
  BedDouble,
  Check,
  IndianRupee,
  Layers,
  Plus,
  Trash2,
  User,
  ShieldAlert,
  Lock,
  DoorClosed,
} from 'lucide-react';
import type { Room, RoomStatus } from '../../../types/room';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { useRoomStore, getSharingLabel, getRentForSharing } from '../../../store/useRoomStore';
import { mockTenants } from '../../../data/mockTenants';
import { toast } from '../../../store/useToastStore';

export interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room | null;
}

export const RoomModal: React.FC<RoomModalProps> = ({ isOpen, onClose, room }) => {
  const { updateRoom } = useRoomStore();

  const [capacity, setCapacity] = useState<number>(room?.capacity || 2);
  const [rent, setRent] = useState<string>(room?.rent ? room.rent.toString() : '8500');
  const [status, setStatus] = useState<RoomStatus>(room?.status || 'available');
  const [isSaved, setIsSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync internal state when room changes
  useEffect(() => {
    if (room) {
      setCapacity(room.capacity);
      setRent(room.rent.toString());
      setStatus(room.status);
      setErrorMessage(null);
      setIsSaved(false);
    }
  }, [room?.id, room?.capacity, room?.rent, room?.status]);

  if (!room) return null;

  const activeTenants = mockTenants.filter(
    (t) => (t.roomId === room.id || t.roomNumber === room.roomNumber) && t.status === 'active'
  );

  const handleAddBed = () => {
    const nextCapacity = capacity + 1;
    setCapacity(nextCapacity);
    const newRent = getRentForSharing(nextCapacity, room.propertyId);
    setRent(newRent.toString());
    setErrorMessage(null);
  };

  const handleRemoveBed = () => {
    if (capacity <= 1) {
      setErrorMessage('A room must contain at least 1 bed.');
      return;
    }
    if (capacity <= room.occupiedCount) {
      setErrorMessage(`Cannot remove bed: all ${room.occupiedCount} beds are currently occupied by tenants.`);
      return;
    }
    const nextCapacity = capacity - 1;
    setCapacity(nextCapacity);
    const newRent = getRentForSharing(nextCapacity, room.propertyId);
    setRent(newRent.toString());
    setErrorMessage(null);
  };

  const handleSave = () => {
    if (capacity < room.occupiedCount) {
      const msg = `Capacity cannot be lower than current occupancy (${room.occupiedCount} beds).`;
      setErrorMessage(msg);
      toast.warning('Invalid Capacity', msg);
      return;
    }

    const rentNum = Number(rent) || room.rent;
    let nextStatus = status;
    if (capacity > room.occupiedCount && status === 'occupied') {
      nextStatus = 'available';
    } else if (capacity <= room.occupiedCount && room.occupiedCount > 0 && status === 'available') {
      nextStatus = 'occupied';
    }

    updateRoom(room.id, {
      capacity: Number(capacity),
      rent: rentNum,
      status: nextStatus,
    });

    setStatus(nextStatus);
    setIsSaved(true);
    setErrorMessage(null);
    const vacantCount = Math.max(0, capacity - room.occupiedCount);
    toast.success(
      `Room ${room.roomNumber} Updated`,
      `${capacity} Beds (${vacantCount} Vacant) • ₹${rentNum.toLocaleString()}/bed/mo`
    );
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 900);
  };

  const vacantSlots = Math.max(0, capacity - room.occupiedCount);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="680px"
      title={
        <div className="room-popup-header-title">
          <div className="room-popup-title-main">
            <div className="room-popup-icon-wrap">
              <DoorClosed size={20} />
            </div>
            <span>Room {room.roomNumber} Configuration</span>
          </div>
          <div className="room-popup-meta-badges">
            <span className="drawer-meta-pill">
              <Layers size={13} style={{ marginRight: '4px' }} />
              Floor {room.floor}
            </span>
            <span className="drawer-meta-pill">
              {room.type.replace('_', ' ')}
            </span>
            <StatusBadge status={status} />
          </div>
        </div>
      }
      subtitle="Configure bed capacity, add or remove bed slots, adjust monthly rent, and room status."
      footer={
        <div className="room-popup-footer">
          <div className="room-popup-footer-left">
            {isSaved && <span className="save-success-indicator">✓ Configuration saved successfully!</span>}
            {errorMessage && (
              <span className="room-popup-error-inline">
                <ShieldAlert size={14} />
                {errorMessage}
              </span>
            )}
          </div>
          <div className="room-popup-footer-actions">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="primary" onClick={handleSave}>
              <Check size={16} style={{ marginRight: '6px' }} />
              Save Configuration
            </Button>
          </div>
        </div>
      }
    >
      <div className="room-popup-body">
        {/* Section 1: Bed Capacity Selection */}
        <div className="room-popup-section">
          <div className="room-popup-section-header">
            <label className="input-label" style={{ margin: 0 }}>
              Bed Capacity
            </label>
            <span className="room-popup-occupancy-pill">
              {capacity} {capacity === 1 ? 'Bed' : 'Beds'} ({room.occupiedCount} Occupied • {vacantSlots} Vacant)
            </span>
          </div>

          {/* Quick presets */}
          <div className="drawer-capacity-stepper">
            {[1, 2, 3, 4, 5, 6].map((num) => {
              const isBelowOccupied = num < room.occupiedCount;
              return (
                <button
                  type="button"
                  key={num}
                  className={`drawer-bed-btn ${capacity === num ? 'active' : ''} ${isBelowOccupied ? 'disabled' : ''}`}
                  onClick={() => {
                    if (isBelowOccupied) {
                      setErrorMessage(`Cannot set below ${room.occupiedCount} beds: active tenants currently occupy these beds.`);
                    } else {
                      setCapacity(num);
                      setErrorMessage(null);
                    }
                  }}
                  title={isBelowOccupied ? `Occupied by ${room.occupiedCount} tenants` : `${num} Beds`}
                >
                  {num} {num === 1 ? 'Bed' : 'Beds'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Detailed Bed Slots List */}
        <div className="room-popup-section">
          <div className="room-popup-section-header">
            <label className="input-label" style={{ margin: 0 }}>
              Bed Slots in Room ({capacity})
            </label>
            <button
              type="button"
              className="room-popup-add-link"
              onClick={handleAddBed}
            >
              <Plus size={14} /> Add Bed Slot
            </button>
          </div>

          <div className="drawer-bed-list">
            {Array.from({ length: capacity }, (_, i) => {
              const isOccupied = i < room.occupiedCount;
              const letter = String.fromCharCode(65 + i);
              const tenant = activeTenants[i];

              return (
                <div key={i} className={`drawer-bed-item ${isOccupied ? 'occupied' : 'vacant'}`}>
                  <div className="drawer-bed-left">
                    <div className="drawer-bed-icon-badge">
                      {isOccupied ? <User size={15} /> : <BedDouble size={15} />}
                    </div>
                    <div>
                      <div className="drawer-bed-name">Bed {letter}</div>
                      <div className="drawer-bed-tenant">
                        {isOccupied
                          ? tenant
                            ? `Assigned: ${tenant.name}`
                            : 'Occupied by Active Tenant'
                          : 'Vacant (Available for allocation)'}
                      </div>
                    </div>
                  </div>

                  <div className="drawer-bed-actions">
                    {isOccupied ? (
                      <span className="drawer-bed-locked-pill" title="Cannot remove occupied bed">
                        <Lock size={11} style={{ marginRight: '3px' }} />
                        Occupied
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="drawer-remove-bed-btn"
                        title={`Remove Bed ${letter}`}
                        onClick={handleRemoveBed}
                      >
                        <Trash2 size={13} />
                        Remove Bed
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Section 3: Financials & Monthly Rent */}
        <div className="room-popup-section">
          <div className="room-popup-grid-single">
            <div>
              <Input
                label={
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <IndianRupee size={14} style={{ color: 'var(--primary)' }} />
                    Monthly Rent per Bed (₹) — {getSharingLabel(capacity)} Price
                  </span>
                }
                type="number"
                value={rent}
                onChange={(e) => setRent(e.target.value)}
              />
            </div>

          </div>
        </div>

        {/* Section 4: Room Status */}
        <div className="room-popup-section" style={{ borderBottom: 'none', paddingBottom: 0 }}>
          <label className="input-label">Room Status</label>
          <div className="status-selector-row">
            {(['available', 'occupied', 'maintenance'] as RoomStatus[]).map((s) => (
              <button
                type="button"
                key={s}
                className={`status-pill-btn status-${s} ${status === s ? 'active' : ''}`}
                onClick={() => setStatus(s)}
              >
                <span className={`status-dot dot-${s}`} />
                {s === 'available' ? 'Available' : s === 'occupied' ? 'Occupied' : 'Maintenance'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
