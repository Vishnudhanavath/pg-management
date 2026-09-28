import React from 'react';
import {
  Layers,
  DoorClosed,
  BedDouble,
  Users,
  Sparkles,
  X,
} from 'lucide-react';

export type FloorFilterType = 'all' | 'vacant' | 'occupied';

export interface FloorStatusBarProps {
  floorNumber: number;
  totalRooms: number;
  totalBeds: number;
  occupiedBeds: number;
  vacantBeds: number;
  activeFilter?: FloorFilterType;
  onFilterChange?: (filter: FloorFilterType) => void;
  onAddRoom?: () => void;
}

export const FloorStatusBar: React.FC<FloorStatusBarProps> = ({
  floorNumber,
  totalRooms,
  totalBeds,
  occupiedBeds,
  vacantBeds,
  activeFilter = 'all',
  onFilterChange,
}) => {
  const handleCardClick = (filter: FloorFilterType) => {
    if (!onFilterChange) return;
    if (activeFilter === filter) {
      onFilterChange('all');
    } else {
      onFilterChange(filter);
    }
  };

  return (
    <div className="floor-status-bar-card" id={`floor-${floorNumber}-status-bar`}>
      {/* Top Header: Identity, Live Pill & Occupancy Progress */}
      <div className="floor-status-header">
        <div className="floor-status-identity">
          <div className="floor-icon-pill" aria-hidden="true">
            <Layers size={18} />
          </div>
          <div className="floor-identity-text">
            <div className="floor-title-row">
              <h3 className="floor-status-title">Floor {floorNumber} Capacity & Status</h3>
              {totalBeds === 0 ? (
                <span className="status-pill status-pill-empty">No Beds Configured</span>
              ) : vacantBeds === 0 ? (
                <span className="status-pill status-pill-full">
                  <span className="status-indicator-dot full" />
                  100% Full Capacity
                </span>
              ) : (
                <span className="status-pill status-pill-vacant">
                  <span className="status-indicator-dot live-pulse" />
                  {vacantBeds} {vacantBeds === 1 ? 'Bed' : 'Beds'} Available
                </span>
              )}
            </div>
            <p className="floor-status-subtitle">
              Live bed allocation and availability breakdown for Floor {floorNumber}
            </p>
          </div>
        </div>
      </div>

      {/* 4 Interactive Metric Cards */}
      <div className="floor-metrics-grid">
        {/* Rooms Card */}
        <div
          className="floor-metric-card rooms-card"
          onClick={() => handleCardClick('all')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick('all')}
          title="Click to view all rooms on Floor"
        >
          <div className="metric-icon-box rooms-box">
            <DoorClosed size={20} />
          </div>
          <div className="metric-content">
            <span className="metric-number rooms-num">{totalRooms}</span>
            <span className="metric-label rooms-lbl">{totalRooms === 1 ? 'Room' : 'Rooms'}</span>
            <span className="metric-subtext rooms-sub">On Floor {floorNumber}</span>
          </div>
        </div>

        {/* Total Beds Card */}
        <div
          className="floor-metric-card total-beds-card"
          onClick={() => handleCardClick('all')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick('all')}
          title="Total bed capacity across all rooms on this floor"
        >
          <div className="metric-icon-box total-beds-box">
            <BedDouble size={20} />
          </div>
          <div className="metric-content">
            <span className="metric-number total-beds-num">{totalBeds}</span>
            <span className="metric-label total-beds-lbl">Total Beds</span>
            <span className="metric-subtext total-beds-sub">Max floor capacity</span>
          </div>
        </div>

        {/* Vacant Beds Card */}
        <div
          className={`floor-metric-card vacant-card ${activeFilter === 'vacant' ? 'active-filter-vacant' : ''}`}
          onClick={() => handleCardClick('vacant')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick('vacant')}
          title="Click to filter and view rooms with vacant beds"
        >
          <div className="metric-icon-box vacant-box">
            <Sparkles size={20} />
          </div>
          <div className="metric-content">
            <span className="metric-number vacant-num">{vacantBeds}</span>
            <span className="metric-label vacant-lbl">Vacant Beds</span>
            <span className="metric-subtext vacant-sub">
              {activeFilter === 'vacant' ? 'Active filter (click to reset)' : 'Available to book'}
            </span>
          </div>
        </div>

        {/* Occupied Beds Card */}
        <div
          className={`floor-metric-card occupied-card ${activeFilter === 'occupied' ? 'active-filter-occupied' : ''}`}
          onClick={() => handleCardClick('occupied')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick('occupied')}
          title="Click to filter and view rooms with occupied beds"
        >
          <div className="metric-icon-box occupied-box">
            <Users size={20} />
          </div>
          <div className="metric-content">
            <span className="metric-number occupied-num">{occupiedBeds}</span>
            <span className="metric-label occupied-lbl">Occupied Beds</span>
            <span className="metric-subtext occupied-sub">
              {activeFilter === 'occupied' ? 'Active filter (click to reset)' : 'Active residents'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Feedback Banner */}
      {activeFilter !== 'all' && (
        <div className="floor-filter-banner">
          <div className="filter-banner-text">
            <span>Showing: </span>
            <strong className={activeFilter === 'vacant' ? 'filter-tag-vacant' : 'filter-tag-occupied'}>
              {activeFilter === 'vacant' ? 'Rooms with Vacant Beds' : 'Rooms with Occupied Beds'}
            </strong>
          </div>
          <button
            type="button"
            className="btn-clear-filter"
            onClick={() => onFilterChange?.('all')}
            id="btn-clear-floor-filter"
          >
            <X size={14} />
            Show All {totalRooms} Rooms
          </button>
        </div>
      )}
    </div>
  );
};
