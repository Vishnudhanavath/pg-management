import React from 'react';
import { BedDouble, Check, Users, Trash2, User, Plus, X } from 'lucide-react';
import type { Room } from '../../../types/room';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatCurrency } from '../../../lib/utils';
import { useRoomStore, getSharingLabel } from '../../../store/useRoomStore';
import { toast } from '../../../store/useToastStore';

export interface RoomCardProps {
  room: Room;
  onClick?: (room: Room) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onClick }) => {
  const { deleteRoom, addBedToRoom, removeBedFromRoom } = useRoomStore();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete Room ${room.roomNumber}?`)) {
      deleteRoom(room.id);
      toast.info(
        `Room ${room.roomNumber} Deleted`,
        `Floor ${room.floor} • ${room.capacity} beds removed`
      );
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

  return (
    <div
      className="interactive-room-card"
      onClick={() => onClick?.(room)}
    >
      {/* Header */}
      <div className="room-card-header">
        <div className="room-title-wrap">
          <div className="room-num-badge">
            <BedDouble size={16} className="room-icon" />
            <span className="room-number">Room {room.roomNumber}</span>
          </div>
          <span className="room-capacity-badge">
            <Users size={12} style={{ marginRight: '4px' }} />
            {getSharingLabel(room.capacity)}
          </span>
        </div>

        <div className="room-actions-wrap">
          <StatusBadge status={room.status} />
          <button
            type="button"
            className="room-delete-btn"
            title="Delete Room"
            onClick={handleDelete}
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
                className={`bed-chip ${isOccupied ? 'occupied' : 'vacant'}`}
                title={`Bed ${bedLetter}: ${isOccupied ? 'Occupied' : 'Vacant (Click indicator to remove)'}`}
              >
                <div className="bed-chip-left">
                  <BedDouble size={13} />
                  <span>Bed {bedLetter}</span>
                </div>
                {isOccupied ? (
                  <span className="bed-status-indicator occupied" title="Occupied by active tenant">
                    <User size={11} />
                  </span>
                ) : (
                  <button
                    type="button"
                    className="bed-status-indicator vacant"
                    title={`Bed ${bedLetter} is vacant (click to remove)`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveBed(e);
                    }}
                    aria-label={`Remove Bed ${bedLetter}`}
                  >
                    <Check size={11} className="indicator-icon-check" />
                    <X size={11} className="indicator-icon-remove" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Quick inline "+ Add Bed" chip */}
          <button
            type="button"
            className={`bed-chip bed-chip-add ${room.capacity % 2 === 0 ? 'full-width' : ''}`}
            title={`Add Bed ${String.fromCharCode(65 + room.capacity)} to Room ${room.roomNumber}`}
            onClick={handleAddBed}
          >
            <Plus size={13} />
            <span>Add Bed</span>
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
          <span className="rent-share-badge">{getSharingLabel(room.capacity)}</span>
        </div>

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
  );
};
