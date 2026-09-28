import React from 'react';
import { BedDouble, Check, Users, Trash2, User, Plus, X, Pencil, DoorClosed } from 'lucide-react';
import type { Room } from '../../../types/room';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatCurrency } from '../../../lib/utils';
import { useRoomStore, getSharingLabel } from '../../../store/useRoomStore';
import { toast } from '../../../store/useToastStore';
import { mockTenants } from '../../../data/mockTenants';

export interface RoomCardProps {
  room: Room;
  onClick?: (room: Room) => void;
  onDeleteClick?: (room: Room) => void;
  onOccupiedBedClick?: (room: Room, bedIndex: number) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onClick, onDeleteClick, onOccupiedBedClick }) => {
  const { addBedToRoom, removeBedFromRoom } = useRoomStore();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteClick) {
      onDeleteClick(room);
    }
  };

  const handleAddBed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = addBedToRoom(room.id);
    if (res.success && res.newCapacity) {
      const addedBedLetter = res.addedLetter || String.fromCharCode(64 + res.newCapacity);
      const newVacant = Math.max(0, res.newCapacity - room.occupiedCount);
      const shareLabel = getSharingLabel(res.newCapacity);
      const rentText = res.newRent ? ` • ${formatCurrency(res.newRent)}/bed/mo` : '';
      toast.success(
        `Bed ${addedBedLetter} Added (${shareLabel})`,
        `Room ${room.roomNumber} is now ${shareLabel}${rentText} (${newVacant} Vacant)`
      );
    }
  };

  const handleRemoveBed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const res = removeBedFromRoom(room.id);
    if (!res.success) {
      toast.warning(
        'Cannot Remove Bed',
        res.error || `All beds in Room ${room.roomNumber} are currently occupied.`
      );
    } else if (res.newCapacity !== undefined) {
      const newVacant = Math.max(0, res.newCapacity - room.occupiedCount);
      const shareLabel = getSharingLabel(res.newCapacity);
      const rentText = res.newRent ? ` • ${formatCurrency(res.newRent)}/bed/mo` : '';
      toast.info(
        `Bed ${res.removedLetter || ''} Removed (${shareLabel})`,
        `Room ${room.roomNumber} is now ${shareLabel}${rentText} (${newVacant} Vacant)`
      );
    }
  };

  const vacantBeds = Math.max(0, room.capacity - room.occupiedCount);
  const activeTenants = mockTenants.filter(
    (tenant) =>
      (tenant.roomId === room.id || tenant.roomNumber === room.roomNumber) &&
      tenant.status === 'active'
  );

  return (
    <div className="interactive-room-card">
      {/* Header */}
      <div className="room-card-header">
        <div className="room-title-wrap">
          <div className="room-num-badge">
            <DoorClosed size={16} className="room-icon" />
            <span className="room-number">Room {room.roomNumber}</span>
          </div>
        </div>

        <div className="room-actions-wrap">
          <StatusBadge status={room.status} />
          <button
            type="button"
            className="room-edit-btn"
            title="Edit room configuration"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.(room);
            }}
            aria-label="Edit room configuration"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            className="room-delete-btn"
            title="Delete Room"
            onClick={handleDeleteClick}
            aria-label={`Delete Room ${room.roomNumber}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Bed Layout Visualizer */}
      <div className="beds-visual-container">
        <div className="beds-label-row">
          <span className="beds-label">Bed Layout:</span>
          <span className="beds-vacancy-info">
            {vacantBeds > 0 ? (
              <span className="text-vacant">{vacantBeds} Vacant</span>
            ) : (
              <span className="text-full">Full</span>
            )}
          </span>
        </div>

        <div className="beds-chips-grid">
          {Array.from({ length: room.capacity }, (_, idx) => {
            const isOccupied = idx < room.occupiedCount;
            const bedLetter = String.fromCharCode(65 + idx);
            return (
              <div
                key={idx}
                className={`bed-chip ${isOccupied ? 'occupied clickable' : 'vacant'}`}
                onClick={(e) => {
                  if (isOccupied) {
                    e.stopPropagation();
                    onOccupiedBedClick?.(room, idx);
                  }
                }}
                role={isOccupied ? 'button' : undefined}
                tabIndex={isOccupied ? 0 : undefined}
                onKeyDown={(e) => {
                  if (isOccupied && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onOccupiedBedClick?.(room, idx);
                  }
                }}

              >
                <div className="bed-chip-left">
                  <BedDouble size={13} />
                  <span>Bed {bedLetter}</span>
                </div>
                {isOccupied ? (
                  <>
                    <span className="bed-status-indicator occupied">
                    <User size={11} />
                    </span>
                    <span className="bed-tenant-tooltip" role="tooltip">
                      {activeTenants[idx]?.name || "Occupied"}
                    </span>
                  </>
                ) : (
                  <>
                    <button
                    type="button"
                    className="bed-status-indicator vacant"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveBed(e);
                    }}
                    aria-label={`Remove Bed ${bedLetter}`}
                  >
                    <Check size={11} className="indicator-icon-check" />
                    <X size={11} className="indicator-icon-remove" />
                    </button>
                    <span className="bed-tenant-tooltip" role="tooltip">Bed {bedLetter}: Vacant</span>
                  </>
                )}
              </div>
            );
          })}

          {/* Quick inline "+ Add Bed" chip */}
          <button
            type="button"
            className={`bed-chip bed-chip-add ${room.capacity % 2 === 0 ? 'full-width' : ''}`}
            onClick={handleAddBed}
          >
            <Plus size={13} />
            <span>Add Bed</span>
            <span className="bed-tenant-tooltip bed-action-tooltip" role="tooltip">Add Bed</span>
          </button>
        </div>
      </div>

      {/* Rent & Amenities Footer */}
      <div className="room-card-footer">
        <div className="room-rent-info">
          <div className="rent-amount-group">
            <span className="rent-amount">{formatCurrency(room.rent)}</span>
            <span className="rent-period">/bed/mo</span>
          </div>
        </div>

        <div className="room-footer-right">
          <span className="room-capacity-badge">
            <Users size={13} />
            <span>{getSharingLabel(room.capacity)}</span>
          </span>
          {room.amenities && room.amenities.length > 0 && (
            <div className="room-amenities-mini">
              {room.amenities.slice(0, 2).map((a) => (
                <span key={a} className="mini-amenity-tag">
                  {a}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

