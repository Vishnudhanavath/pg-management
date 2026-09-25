import React from 'react';
import { Plus, BedDouble, Building2, Wand2 } from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { Button } from '../../components/ui/Button';
import { FloorTabs } from '../../features/occupancy/components/FloorTabs';
import { RoomCard } from '../../features/occupancy/components/RoomCard';
import { AddRoomModal } from '../../features/occupancy/components/AddRoomModal';
import { RoomModal } from '../../features/occupancy/components/RoomModal';
import { EmptyState } from '../../components/common/EmptyState';
import { useRoomStore } from '../../store/useRoomStore';
import { usePropertyStore } from '../../store/usePropertyStore';

export const Occupancy: React.FC = () => {
  const { selectedProperty } = usePropertyStore();
  const {
    rooms,
    activeFloor,
    setActiveFloor,
    openAddRoomModal,
    selectedRoomForDetail,
    setSelectedRoomForDetail,
    generateRoomsForProperty,
  } = useRoomStore();

  const propertyId = selectedProperty?.id || 'prop-1';
  const propertyRooms = rooms.filter((r) => r.propertyId === propertyId);

  // Generate list of floors based on selected property
  const totalFloors = selectedProperty?.totalFloors || 3;
  const floorsList = Array.from({ length: totalFloors }, (_, i) => i + 1);

  // Filter and naturally sort rooms for current active floor by room number
  const floorRooms = propertyRooms
    .filter((r) => r.floor === activeFloor)
    .sort((a, b) =>
      a.roomNumber.localeCompare(b.roomNumber, undefined, {
        numeric: true,
        sensitivity: 'base',
      })
    );

  // Calculate room counts per floor
  const roomCountsByFloor = propertyRooms.reduce((acc, r) => {
    acc[r.floor] = (acc[r.floor] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  // Floor stats
  const totalBedsOnFloor = floorRooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBedsOnFloor = floorRooms.reduce((acc, r) => acc + r.occupiedCount, 0);
  const vacantBedsOnFloor = Math.max(0, totalBedsOnFloor - occupiedBedsOnFloor);

  const handleGenerateRooms = () => {
    if (selectedProperty) {
      generateRoomsForProperty(
        selectedProperty.id,
        selectedProperty.totalFloors,
        selectedProperty.totalRooms
      );
    }
  };

  return (
    <div className="page-occupancy">
      <PageHeader
        title="Occupancy & Bed Management"
        subtitle={`Floor-wise rooms, bed allocations, and vacancies for ${selectedProperty?.name || 'Selected PG'}`}
        action={
          <Button
            variant="primary"
            onClick={openAddRoomModal}
            id="btn-add-room-header"
            className="btn-add-room"
          >
            <Plus size={16} style={{ marginRight: '6px' }} />
            Add Room to Floor {activeFloor}
          </Button>
        }
      />

      {/* Floor Navigation Tabs */}
      <FloorTabs
        floors={floorsList}
        activeFloor={activeFloor}
        onSelectFloor={setActiveFloor}
        roomCountsByFloor={roomCountsByFloor}
      />

      {/* Active Floor Overview Stats */}
      {propertyRooms.length > 0 && (
        <div className="floor-summary-bar">
          <div className="floor-summary-info">
            <span className="floor-summary-title">Floor {activeFloor} Capacity:</span>
            <span className="floor-summary-item">
              <strong>{floorRooms.length}</strong> {floorRooms.length === 1 ? 'Room' : 'Rooms'}
            </span>
            <span className="floor-summary-divider">•</span>
            <span className="floor-summary-item">
              <strong>{totalBedsOnFloor}</strong> Total Beds
            </span>
            <span className="floor-summary-divider">•</span>
            <span className="floor-summary-item text-vacant">
              <strong>{vacantBedsOnFloor}</strong> Vacant Beds
            </span>
            <span className="floor-summary-divider">•</span>
            <span className="floor-summary-item text-occupied">
              <strong>{occupiedBedsOnFloor}</strong> Occupied Beds
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={openAddRoomModal}
            id="btn-add-room-toolbar"
          >
            <Plus size={14} style={{ marginRight: '5px' }} />
            Add Room
          </Button>
        </div>
      )}

      {/* Rooms Grid / Empty State */}
      {propertyRooms.length === 0 ? (
        <EmptyState
          title={`No rooms created for ${selectedProperty?.name || 'this property'}`}
          description={`Set up your floor-wise rooms and bed counts. You can auto-generate all ${selectedProperty?.totalRooms || 12} rooms across ${selectedProperty?.totalFloors || 3} floors, or add rooms individually.`}
          icon={<BedDouble size={42} style={{ color: 'var(--primary)' }} />}
          action={
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <Button variant="primary" onClick={handleGenerateRooms} id="btn-auto-gen-rooms">
                <Wand2 size={16} style={{ marginRight: '6px' }} />
                Auto-Generate Floor Rooms
              </Button>
              <Button variant="secondary" onClick={openAddRoomModal} id="btn-add-first-room">
                <Plus size={16} style={{ marginRight: '6px' }} />
                Add Room Manually
              </Button>
            </div>
          }
        />
      ) : floorRooms.length === 0 ? (
        <EmptyState
          title={`No rooms on Floor ${activeFloor}`}
          description={`Floor ${activeFloor} currently has no rooms registered. Add your first room to configure its bed count and rent.`}
          icon={<Building2 size={38} style={{ color: 'var(--primary)' }} />}
          action={
            <Button variant="primary" onClick={openAddRoomModal} id="btn-add-floor-room">
              <Plus size={16} style={{ marginRight: '6px' }} />
              Add First Room to Floor {activeFloor}
            </Button>
          }
        />
      ) : (
        <div className="rooms-grid">
          {floorRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onClick={setSelectedRoomForDetail}
            />
          ))}
        </div>
      )}

      {/* Add Room Modal */}
      <AddRoomModal />

      {/* Room Detail & Bed Config Modal Popup */}
      <RoomModal
        isOpen={Boolean(selectedRoomForDetail)}
        onClose={() => setSelectedRoomForDetail(null)}
        room={selectedRoomForDetail}
      />
    </div>
  );
};
