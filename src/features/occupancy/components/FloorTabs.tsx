import React from 'react';
import { Layers } from 'lucide-react';

export interface FloorTabsProps {
  floors: number[];
  activeFloor: number;
  onSelectFloor: (floor: number) => void;
  roomCountsByFloor?: Record<number, number>;
}

export const FloorTabs: React.FC<FloorTabsProps> = ({
  floors,
  activeFloor,
  onSelectFloor,
  roomCountsByFloor,
}) => {
  return (
    <div className="floor-tabs-container">
      {floors.map((floor) => {
        const count = roomCountsByFloor?.[floor] ?? 0;
        const isActive = activeFloor === floor;

        return (
          <button
            key={floor}
            type="button"
            className={`floor-nav-tab ${isActive ? 'active' : ''}`}
            onClick={() => onSelectFloor(floor)}
          >
            <Layers size={14} className="floor-tab-icon" />
            <span className="floor-tab-name">Floor {floor}</span>
            <span className="floor-tab-badge">{count} {count === 1 ? 'room' : 'rooms'}</span>
          </button>
        );
      })}
    </div>
  );
};
