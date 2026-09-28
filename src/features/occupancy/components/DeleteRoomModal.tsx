import React from 'react';
import { Trash2, AlertTriangle, DoorClosed, BedDouble, Layers, IndianRupee } from 'lucide-react';
import type { Room } from '../../../types/room';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { formatCurrency } from '../../../lib/utils';

export interface DeleteRoomModalProps {
  room: Room | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (room: Room) => void;
}

export const DeleteRoomModal: React.FC<DeleteRoomModalProps> = ({
  room,
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!room) return null;

  const vacantCount = Math.max(0, room.capacity - room.occupiedCount);

  const modalTitle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: '#fef2f2',
          color: '#dc2626',
          border: '1.5px solid #fecaca',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Trash2 size={22} />
      </div>
      <div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
          Delete Room {room.roomNumber}
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      maxWidth="540px"
      footer={
        <div className="modal-footer-actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            id="btn-cancel-delete-room"
            style={{ fontSize: '0.95rem', fontWeight: 600, padding: '10px 18px' }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => onConfirm(room)}
            id={`btn-confirm-delete-room-${room.roomNumber}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              padding: '10px 20px',
            }}
          >
            <Trash2 size={16} />
            Delete Room
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Confirmation Question */}
        <p
          style={{
            margin: 0,
            fontSize: '1.05rem',
            lineHeight: 1.55,
            color: '#1e293b',
            fontWeight: 500,
          }}
        >
          Are you sure you want to permanently delete{' '}
          <strong style={{ color: '#0f172a', fontWeight: 700 }}>Room {room.roomNumber}</strong> from{' '}
          <strong style={{ color: '#0f172a', fontWeight: 700, whiteSpace: 'nowrap' }}>
            Floor {room.floor}
          </strong>
          ?
        </p>

        {/* Room Overview Summary Card */}
        <div
          style={{
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '14px',
            padding: '16px 18px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px 20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#e2e8f0',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Layers size={18} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#475569',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '2px',
                }}
              >
                Location
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                Floor {room.floor}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#e2e8f0',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <BedDouble size={18} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#475569',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '2px',
                }}
              >
                Capacity
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                {room.capacity} {room.capacity === 1 ? 'Bed' : 'Beds'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#e2e8f0',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <IndianRupee size={18} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#475569',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '2px',
                }}
              >
                Monthly Rent
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
                {formatCurrency(room.rent)}/bed
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: room.occupiedCount > 0 ? '#ffedd5' : '#dcfce7',
                color: room.occupiedCount > 0 ? '#c2410c' : '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <DoorClosed size={18} />
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#475569',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  marginBottom: '2px',
                }}
              >
                Occupancy
              </div>
              <div
                style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: room.occupiedCount > 0 ? '#c2410c' : '#15803d',
                }}
              >
                {room.occupiedCount} Occupied / {vacantCount} Vacant
              </div>
            </div>
          </div>
        </div>

        {/* Warning or Safety Banner with High Contrast */}
        {room.occupiedCount > 0 ? (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: '#fff7ed',
              border: '1.5px solid #fed7aa',
              borderLeft: '4px solid #ea580c',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <AlertTriangle
              size={20}
              style={{ color: '#ea580c', flexShrink: 0, marginTop: '2px' }}
            />
            <div style={{ fontSize: '0.925rem', lineHeight: 1.5, color: '#7c2d12' }}>
              <strong
                style={{
                  color: '#9a3412',
                  fontSize: '0.975rem',
                  display: 'block',
                  marginBottom: '4px',
                  fontWeight: 700,
                }}
              >
                Active Tenants Warning
              </strong>
              This room currently houses{' '}
              <strong style={{ color: '#431407', fontWeight: 700 }}>
                {room.occupiedCount} active {room.occupiedCount === 1 ? 'tenant' : 'tenants'}
              </strong>
              . Deleting this room will remove their bed assignments and affect tenant records.
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '12px',
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              borderLeft: '4px solid #16a34a',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.925rem',
              color: '#14532d',
              fontWeight: 500,
            }}
          >
            <DoorClosed size={20} style={{ color: '#16a34a', flexShrink: 0 }} />
            <span>
              This room is <strong style={{ color: '#052e16', fontWeight: 700 }}>100% vacant</strong>. No active tenant contracts will be disrupted.
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};
