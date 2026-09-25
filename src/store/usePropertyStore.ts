import { create } from 'zustand';
import type { Property } from '../types/property';
import { mockProperties } from '../data/mockProperties';
import { useRoomStore } from './useRoomStore';

const STORAGE_KEY = 'pg_properties';
const SELECTED_STORAGE_KEY = 'pg_selected_property_id';

const getInitialProperties = (): Property[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse properties from localStorage', e);
  }
  return mockProperties;
};

const getInitialSelectedProperty = (properties: Property[]): Property | null => {
  try {
    const savedId = localStorage.getItem(SELECTED_STORAGE_KEY);
    if (savedId) {
      const found = properties.find((p) => p.id === savedId);
      if (found) return found;
    }
  } catch (e) {
    console.error('Failed to get selected property from localStorage', e);
  }
  return properties[0] ?? null;
};

interface PropertyState {
  properties: Property[];
  selectedProperty: Property | null;
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  editingProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  openAddModal: () => void;
  closeAddModal: () => void;
  openEditModal: (property: Property) => void;
  closeEditModal: () => void;
  addProperty: (
    propertyData: Omit<Property, 'id'> & {
      id?: string;
      defaultBedsPerRoom?: number;
      defaultRent?: number;
      sharingRents?: Record<number, number>;
    }
  ) => Property;
  updateProperty: (id: string, updates: Partial<Property>) => void;
  deleteProperty: (id: string) => void;
}

const initialProperties = getInitialProperties();

export const usePropertyStore = create<PropertyState>((set) => ({
  properties: initialProperties,
  selectedProperty: getInitialSelectedProperty(initialProperties),
  isAddModalOpen: false,
  isEditModalOpen: false,
  editingProperty: null,

  setSelectedProperty: (property) => {
    set({ selectedProperty: property });
    try {
      if (property) {
        localStorage.setItem(SELECTED_STORAGE_KEY, property.id);
      } else {
        localStorage.removeItem(SELECTED_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save selected property to localStorage', e);
    }
  },

  openAddModal: () => set({ isAddModalOpen: true }),
  closeAddModal: () => set({ isAddModalOpen: false }),

  openEditModal: (property) => set({ isEditModalOpen: true, editingProperty: property }),
  closeEditModal: () => set({ isEditModalOpen: false, editingProperty: null }),

  addProperty: (propertyData) => {
    const newProperty: Property = {
      id: propertyData.id || `prop-${Date.now()}`,
      name: propertyData.name.trim(),
      address: propertyData.address.trim(),
      totalRooms: Number(propertyData.totalRooms),
      totalFloors: Number(propertyData.totalFloors),
      roomsPerFloor: propertyData.roomsPerFloor
        ? Number(propertyData.roomsPerFloor)
        : Math.max(1, Math.ceil(Number(propertyData.totalRooms) / Math.max(1, Number(propertyData.totalFloors)))),
      bedsPerRoom: propertyData.bedsPerRoom ? Number(propertyData.bedsPerRoom) : (propertyData.defaultBedsPerRoom || 2),
      occupancyRate: propertyData.occupancyRate ?? 0,
      propertyType: propertyData.propertyType || 'Men',
      amenities: propertyData.amenities || [],
      contactPhone: propertyData.contactPhone?.trim(),
      description: propertyData.description?.trim(),
      sharingRents: propertyData.sharingRents,
    };

    set((state) => {
      const updatedProperties = [newProperty, ...state.properties];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProperties));
        localStorage.setItem(SELECTED_STORAGE_KEY, newProperty.id);
      } catch (e) {
        console.error('Failed to save properties to localStorage', e);
      }
      return {
        properties: updatedProperties,
        selectedProperty: newProperty,
        isAddModalOpen: false,
      };
    });

    try {
      useRoomStore.getState().generateRoomsForProperty(
        newProperty.id,
        newProperty.totalFloors,
        newProperty.totalRooms,
        newProperty.bedsPerRoom,
        propertyData.sharingRents || propertyData.defaultRent
      );
    } catch (e) {
      console.error('Failed to auto-generate rooms for property', e);
    }

    return newProperty;
  },

  updateProperty: (id, updates) => {
    set((state) => {
      const updatedProperties = state.properties.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            ...updates,
            name: updates.name !== undefined ? updates.name.trim() : p.name,
            address: updates.address !== undefined ? updates.address.trim() : p.address,
            totalFloors: updates.totalFloors !== undefined ? Number(updates.totalFloors) : p.totalFloors,
            totalRooms: updates.totalRooms !== undefined ? Number(updates.totalRooms) : p.totalRooms,
            roomsPerFloor: updates.roomsPerFloor !== undefined ? Number(updates.roomsPerFloor) : p.roomsPerFloor,
            bedsPerRoom: updates.bedsPerRoom !== undefined ? Number(updates.bedsPerRoom) : p.bedsPerRoom,
            contactPhone: updates.contactPhone !== undefined ? updates.contactPhone.trim() : p.contactPhone,
            description: updates.description !== undefined ? updates.description.trim() : p.description,
            sharingRents: updates.sharingRents !== undefined ? updates.sharingRents : p.sharingRents,
          };
        }
        return p;
      });

      const updatedSelected =
        state.selectedProperty?.id === id
          ? updatedProperties.find((p) => p.id === id) ?? state.selectedProperty
          : state.selectedProperty;

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProperties));
        if (updatedSelected) {
          localStorage.setItem(SELECTED_STORAGE_KEY, updatedSelected.id);
        }
      } catch (e) {
        console.error('Failed to save updated property to localStorage', e);
      }

      if (updates.bedsPerRoom !== undefined && Number(updates.bedsPerRoom) > 0) {
        try {
          useRoomStore.getState().updatePropertyRoomsCapacity(id, Number(updates.bedsPerRoom));
        } catch (e) {
          console.error('Failed to update room capacities', e);
        }
      }

      return {
        properties: updatedProperties,
        selectedProperty: updatedSelected,
        isEditModalOpen: false,
        editingProperty: null,
      };
    });
  },

  deleteProperty: (id) => {
    set((state) => {
      const updated = state.properties.filter((p) => p.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update localStorage after delete', e);
      }
      const nextSelected = state.selectedProperty?.id === id ? (updated[0] ?? null) : state.selectedProperty;
      if (nextSelected) {
        try {
          localStorage.setItem(SELECTED_STORAGE_KEY, nextSelected.id);
        } catch {
          // Ignore
        }
      }
      return {
        properties: updated,
        selectedProperty: nextSelected,
      };
    });
  },
}));
