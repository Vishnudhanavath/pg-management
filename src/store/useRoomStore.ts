import { create } from 'zustand';
import type { Room, RoomType, RoomStatus } from '../types/room';
import { mockRooms } from '../data/mockRooms';
import { mockProperties } from '../data/mockProperties';

const STORAGE_KEY = 'pg_rooms';

export const sortRooms = (roomsList: Room[]): Room[] => {
  return [...roomsList].sort((a, b) => {
    if (a.floor !== b.floor) {
      return a.floor - b.floor;
    }
    return a.roomNumber.localeCompare(b.roomNumber, undefined, {
      numeric: true,
      sensitivity: 'base',
    });
  });
};

const getInitialRooms = (): Room[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return sortRooms(parsed);
      }
    }
  } catch (e) {
    console.error('Failed to parse rooms from localStorage', e);
  }
  return sortRooms(mockRooms);
};

export const DEFAULT_SHARING_RENTS: Record<number, number> = {
  1: 14000, // Single sharing
  2: 9500,  // 2 sharing
  3: 7500,  // 3 sharing
  4: 6000,  // 4 sharing
  5: 5000,  // 5 sharing
  6: 4500,  // 6 sharing
};

export const getSharingLabel = (beds: number): string => {
  switch (beds) {
    case 1:
      return '1 Share';
    case 2:
      return '2 Share';
    case 3:
      return '3 Share';
    case 4:
      return '4 Share';
    default:
      return `${beds} Share`;
  }
};

export const getPropertySharingRents = (propertyId?: string): Record<number, number> | undefined => {
  if (!propertyId) return undefined;
  try {
    const raw = localStorage.getItem('pg_properties');
    if (raw) {
      const props = JSON.parse(raw);
      if (Array.isArray(props)) {
        const found = props.find((p: any) => p.id === propertyId);
        if (found?.sharingRents) return found.sharingRents;
      }
    }
  } catch (e) {
    // fallback
  }
  const fallback = mockProperties.find((p) => p.id === propertyId);
  return fallback?.sharingRents;
};

export const getRentForSharing = (
  beds: number,
  propertyIdOrRents?: string | Record<number, number>
): number => {
  let sharingMap: Record<number, number> | undefined;
  if (typeof propertyIdOrRents === 'string') {
    sharingMap = getPropertySharingRents(propertyIdOrRents);
  } else if (propertyIdOrRents && typeof propertyIdOrRents === 'object') {
    sharingMap = propertyIdOrRents;
  }

  if (sharingMap && sharingMap[beds]) {
    return Number(sharingMap[beds]);
  }
  if (DEFAULT_SHARING_RENTS[beds]) {
    return DEFAULT_SHARING_RENTS[beds];
  }
  return Math.max(3500, 6000 - Math.max(0, beds - 4) * 500);
};

export const getRoomTypeFromBeds = (beds: number): RoomType => {
  switch (beds) {
    case 1:
      return 'single';
    case 2:
      return 'double';
    case 3:
      return 'triple';
    default:
      return 'four_sharing';
  }
};

interface RoomState {
  rooms: Room[];
  activeFloor: number;
  isAddRoomModalOpen: boolean;
  selectedRoomForDetail: Room | null;
  setActiveFloor: (floor: number) => void;
  openAddRoomModal: () => void;
  closeAddRoomModal: () => void;
  setSelectedRoomForDetail: (room: Room | null) => void;
  addRoom: (roomData: Omit<Room, 'id'> & { id?: string }) => Room;
  updateRoom: (roomId: string, updates: Partial<Room>) => void;
  deleteRoom: (roomId: string) => void;
  generateRoomsForProperty: (
    propertyId: string,
    totalFloors: number,
    totalRooms: number,
    defaultBedsPerRoom?: number,
    sharingRents?: Record<number, number> | number
  ) => void;
  updatePropertyRoomsCapacity: (propertyId: string, newBedsPerRoom: number) => void;
  addBedToRoom: (roomId: string) => {
    success: boolean;
    newCapacity?: number;
    newRent?: number;
    addedLetter?: string;
  };
  removeBedFromRoom: (roomId: string) => {
    success: boolean;
    error?: string;
    newCapacity?: number;
    newRent?: number;
    removedLetter?: string;
  };
}

export const useRoomStore = create<RoomState>((set) => ({
  rooms: getInitialRooms(),
  activeFloor: 1,
  isAddRoomModalOpen: false,
  selectedRoomForDetail: null,

  setActiveFloor: (floor) => set({ activeFloor: floor }),
  openAddRoomModal: () => set({ isAddRoomModalOpen: true }),
  closeAddRoomModal: () => set({ isAddRoomModalOpen: false }),
  setSelectedRoomForDetail: (room) => set({ selectedRoomForDetail: room }),

  addRoom: (roomData) => {
    const capacity = Number(roomData.capacity) || 2;
    const newRoom: Room = {
      id: roomData.id || `room-${Date.now()}`,
      propertyId: roomData.propertyId,
      roomNumber: roomData.roomNumber.trim(),
      floor: Number(roomData.floor),
      type: roomData.type || getRoomTypeFromBeds(capacity),
      rent: Number(roomData.rent) || 8500,
      status: (roomData.status as RoomStatus) || 'available',
      capacity,
      occupiedCount: Number(roomData.occupiedCount) || 0,
      amenities: roomData.amenities || ['Attached Washroom'],
    };

    set((state) => {
      const updated = sortRooms([...state.rooms, newRoom]);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save rooms to localStorage', e);
      }
      return {
        rooms: updated,
        isAddRoomModalOpen: false,
        activeFloor: newRoom.floor,
      };
    });

    return newRoom;
  },

  updateRoom: (roomId, updates) => {
    set((state) => {
      const updated = state.rooms.map((r) => {
        if (r.id === roomId) {
          const capacity = updates.capacity !== undefined ? Math.max(1, Number(updates.capacity)) : r.capacity;
          const type = updates.type || getRoomTypeFromBeds(capacity);
          let rent = updates.rent !== undefined ? Number(updates.rent) : r.rent;
          if (updates.capacity !== undefined && updates.rent === undefined) {
            rent = getRentForSharing(capacity, r.propertyId);
          }
          let status = updates.status || r.status;
          // Auto-adjust status if capacity changes
          if (updates.capacity !== undefined) {
            if (capacity > r.occupiedCount && status === 'occupied') {
              status = 'available';
            } else if (capacity <= r.occupiedCount && r.occupiedCount > 0 && status === 'available') {
              status = 'occupied';
            }
          }
          return {
            ...r,
            ...updates,
            capacity,
            type,
            rent,
            status,
          };
        }
        return r;
      });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save rooms to localStorage', e);
      }

      return {
        rooms: updated,
        selectedRoomForDetail:
          state.selectedRoomForDetail?.id === roomId
            ? updated.find((r) => r.id === roomId) || null
            : state.selectedRoomForDetail,
      };
    });
  },

  addBedToRoom: (roomId) => {
    let result: {
      success: boolean;
      newCapacity?: number;
      newRent?: number;
      addedLetter?: string;
    } = {
      success: false,
      newCapacity: 0,
    };
    set((state) => {
      const targetRoom = state.rooms.find((r) => r.id === roomId);
      if (!targetRoom) return state;

      const newCapacity = targetRoom.capacity + 1;
      const newType = getRoomTypeFromBeds(newCapacity);
      const newRent = getRentForSharing(newCapacity, targetRoom.propertyId);
      // If room was marked 'occupied' but now has an available bed, update status to 'available'
      const newStatus: RoomStatus =
        targetRoom.status === 'occupied' && newCapacity > targetRoom.occupiedCount
          ? 'available'
          : targetRoom.status;

      const updated = state.rooms.map((r) => {
        if (r.id === roomId) {
          return {
            ...r,
            capacity: newCapacity,
            type: newType,
            rent: newRent,
            status: newStatus,
          };
        }
        return r;
      });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save rooms to localStorage', e);
      }

      const addedLetter = String.fromCharCode(64 + newCapacity);
      result = { success: true, newCapacity, newRent, addedLetter };

      return {
        rooms: updated,
        selectedRoomForDetail:
          state.selectedRoomForDetail?.id === roomId
            ? updated.find((r) => r.id === roomId) || null
            : state.selectedRoomForDetail,
      };
    });
    return result;
  },

  removeBedFromRoom: (roomId) => {
    let result: {
      success: boolean;
      error?: string;
      newCapacity?: number;
      newRent?: number;
      removedLetter?: string;
    } = { success: false, error: '' };
    set((state) => {
      const targetRoom = state.rooms.find((r) => r.id === roomId);
      if (!targetRoom) {
        result = { success: false, error: 'Room not found' };
        return state;
      }

      if (targetRoom.capacity <= 1) {
        result = { success: false, error: 'A room must have at least 1 bed.' };
        return state;
      }

      if (targetRoom.capacity <= targetRoom.occupiedCount) {
        result = {
          success: false,
          error: `Cannot remove bed: all ${targetRoom.occupiedCount} beds are currently occupied by tenants.`,
        };
        return state;
      }

      const removedLetter = String.fromCharCode(65 + targetRoom.capacity - 1);
      const newCapacity = targetRoom.capacity - 1;
      const newType = getRoomTypeFromBeds(newCapacity);
      const newRent = getRentForSharing(newCapacity, targetRoom.propertyId);

      // If all remaining beds are occupied, switch to 'occupied'
      const newStatus: RoomStatus =
        targetRoom.status === 'available' &&
        newCapacity <= targetRoom.occupiedCount &&
        targetRoom.occupiedCount > 0
          ? 'occupied'
          : targetRoom.status;

      const updated = state.rooms.map((r) => {
        if (r.id === roomId) {
          return {
            ...r,
            capacity: newCapacity,
            type: newType,
            rent: newRent,
            status: newStatus,
          };
        }
        return r;
      });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save rooms to localStorage', e);
      }

      result = { success: true, newCapacity, newRent, removedLetter };

      return {
        rooms: updated,
        selectedRoomForDetail:
          state.selectedRoomForDetail?.id === roomId
            ? updated.find((r) => r.id === roomId) || null
            : state.selectedRoomForDetail,
      };
    });
    return result;
  },

  deleteRoom: (roomId) => {
    set((state) => {
      const updated = state.rooms.filter((r) => r.id !== roomId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save rooms to localStorage', e);
      }
      return {
        rooms: updated,
        selectedRoomForDetail:
          state.selectedRoomForDetail?.id === roomId ? null : state.selectedRoomForDetail,
      };
    });
  },

  generateRoomsForProperty: (propertyId, totalFloors, totalRooms, defaultBedsPerRoom, sharingRents) => {
    set((state) => {
      // Don't duplicate if rooms already exist for this property
      const existing = state.rooms.filter((r) => r.propertyId === propertyId);
      if (existing.length > 0) return state;

      const newRooms: Room[] = [];
      const roomsPerFloor = Math.max(1, Math.ceil(totalRooms / totalFloors));
      let count = 0;

      for (let floor = 1; floor <= totalFloors && count < totalRooms; floor++) {
        for (let r = 1; r <= roomsPerFloor && count < totalRooms; r++) {
          count++;
          const roomNum = `${floor}${r < 10 ? '0' : ''}${r}`;
          // Use specified default bed capacity or fallback to alternate 2 and 3 sharing
          const capacity = defaultBedsPerRoom && defaultBedsPerRoom > 0
            ? defaultBedsPerRoom
            : (r % 3 === 1 ? 2 : r % 3 === 2 ? 3 : 1);

          let roomRent: number;
          if (typeof sharingRents === 'object' && sharingRents !== null) {
            if (sharingRents[capacity] && sharingRents[capacity] > 0) {
              roomRent = sharingRents[capacity];
            } else {
              const available = Object.values(sharingRents).find((val) => typeof val === 'number' && val > 0);
              roomRent = available || (capacity === 1 ? 14000 : capacity === 2 ? 9500 : capacity === 3 ? 7500 : 6000);
            }
          } else if (typeof sharingRents === 'number' && sharingRents > 0) {
            roomRent = sharingRents;
          } else {
            roomRent = capacity === 1 ? 14000 : capacity === 2 ? 9500 : capacity === 3 ? 7500 : 6000;
          }

          newRooms.push({
            id: `room-${propertyId}-${roomNum}`,
            propertyId,
            roomNumber: roomNum,
            floor,
            type: getRoomTypeFromBeds(capacity),
            rent: roomRent,
            status: 'available',
            capacity,
            occupiedCount: 0,
            amenities: ['Attached Washroom', 'High-speed Wi-Fi'],
          });
        }
      }

      const updated = sortRooms([...state.rooms, ...newRooms]);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save generated rooms to localStorage', e);
      }

      return { rooms: updated };
    });
  },

  updatePropertyRoomsCapacity: (propertyId, newBedsPerRoom) => {
    set((state) => {
      const cap = Number(newBedsPerRoom) || 2;
      const updated = state.rooms.map((r) => {
        if (r.propertyId === propertyId) {
          return {
            ...r,
            capacity: cap,
            type: getRoomTypeFromBeds(cap),
          };
        }
        return r;
      });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save rooms to localStorage', e);
      }

      return { rooms: updated };
    });
  },
}));
