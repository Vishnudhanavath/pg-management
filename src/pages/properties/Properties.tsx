import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Search,
  X,
  MapPin,
  Phone,
  Navigation,
  Trash2,
  CheckCircle2,
  Users,
  User,
  UserCheck,
  Check,
  Pencil,
} from 'lucide-react';
import { PageHeader } from '../../components/common/PageHeader';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/ui/Button';
import { usePropertyStore } from '../../store/usePropertyStore';
import type { Property } from '../../types/property';

export const Properties: React.FC = () => {
  const {
    properties,
    selectedProperty,
    setSelectedProperty,
    openAddModal,
    openEditModal,
    deleteProperty,
  } = usePropertyStore();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = properties.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      (p.propertyType && p.propertyType.toLowerCase().includes(q))
    );
  });

  const handleEdit = (property: Property, e: React.MouseEvent) => {
    e.stopPropagation();
    openEditModal(property);
  };

  const handleDelete = (property: Property, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove "${property.name}"?`)) {
      deleteProperty(property.id);
    }
  };

  const getCategoryIcon = (type?: string) => {
    switch (type) {
      case 'Men':
        return <User size={13} />;
      case 'Women':
        return <UserCheck size={13} />;
      default:
        return <Users size={13} />;
    }
  };

  return (
    <div className="page-properties">
      <PageHeader
        title="Properties & Buildings"
        subtitle="Manage your PG hostels, track occupancy rates, and add new buildings"
        action={
          <Button
            variant="primary"
            onClick={openAddModal}
            id="btn-add-property-header"
            className="btn-add-property"
          >
            <Plus size={16} style={{ marginRight: '6px' }} />
            Add Property
          </Button>
        }
      />

      {/* Search Bar */}
      {properties.length > 0 && (
        <div className="properties-toolbar">
          <div className="search-input-wrapper">
            <span className="search-icon">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search properties by name, location, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="properties-search-input"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear Search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Properties List / Empty State */}
      {properties.length === 0 ? (
        <EmptyState
          title="No properties registered yet"
          description="Get started by adding your first PG building or hostel to manage rooms, bookings, and tenants."
          icon={<Building2 size={42} style={{ color: 'var(--primary)' }} />}
          action={
            <Button variant="primary" onClick={openAddModal} id="btn-add-first-property">
              <Plus size={16} style={{ marginRight: '6px' }} />
              Add Your First Property
            </Button>
          }
        />
      ) : filteredProperties.length === 0 ? (
        <div className="no-search-results">
          <p>No properties match &quot;{searchQuery}&quot;</p>
          <Button variant="secondary" size="sm" onClick={() => setSearchQuery('')}>
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="properties-grid">
          {filteredProperties.map((property) => {
            const isSelected = selectedProperty?.id === property.id;
            const occupancy = property.occupancyRate ?? 0;

            return (
              <div
                key={property.id}
                className={`property-card-interactive ${isSelected ? 'is-active-property' : ''}`}
                onClick={() => setSelectedProperty(property)}
              >
                {/* Card Top Row */}
                <div className="property-card-top">
                  <div className="property-heading">
                    <h3 className="property-title">{property.name}</h3>
                    <div className="property-badges">
                      {property.propertyType && (
                        <span className={`property-type-tag type-${property.propertyType.toLowerCase()}`}>
                          {getCategoryIcon(property.propertyType)}
                          <span style={{ marginLeft: '4px' }}>{property.propertyType}</span>
                        </span>
                      )}
                      {isSelected ? (
                        <span className="active-property-badge">
                          <CheckCircle2 size={13} style={{ color: '#16a34a' }} />
                          <span style={{ marginLeft: '4px' }}>Active PG</span>
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="property-card-actions">
                    <button
                      type="button"
                      className="property-action-btn property-edit-btn"
                      title="Edit Property"
                      onClick={(e) => handleEdit(property, e)}
                      aria-label={`Edit ${property.name}`}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      className="property-action-btn property-delete-btn"
                      title="Remove Property"
                      onClick={(e) => handleDelete(property, e)}
                      aria-label={`Delete ${property.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Address */}
                <p className="property-address">
                  <MapPin size={15} className="address-icon" style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span>{property.address}</span>
                </p>

                {property.description && (
                  <p className="property-landmark">
                    <Navigation size={13} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
                    {property.description}
                  </p>
                )}

                {/* Key Metrics */}
                <div className="property-metrics-row">
                  <div className="metric-item">
                    <span className="metric-val">{property.totalFloors}</span>
                    <span className="metric-lbl">Floors</span>
                  </div>
                  <div className="metric-divider" />
                  <div className="metric-item">
                    <span className="metric-val">{property.totalRooms}</span>
                    <span className="metric-lbl">Rooms</span>
                  </div>
                  <div className="metric-divider" />
                  <div className="metric-item">
                    <span className="metric-val">{occupancy}%</span>
                    <span className="metric-lbl">Occupancy</span>
                  </div>
                </div>

                {/* Occupancy Progress Bar */}
                <div className="occupancy-bar-container">
                  <div className="occupancy-bar-track">
                    <div
                      className={`occupancy-bar-fill ${
                        occupancy >= 80 ? 'fill-high' : occupancy >= 50 ? 'fill-mid' : 'fill-low'
                      }`}
                      style={{ width: `${Math.min(occupancy, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Contact phone */}
                {property.contactPhone && (
                  <div className="property-contact-info">
                    <Phone size={13} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                    <span>{property.contactPhone}</span>
                  </div>
                )}

                {/* Card Footer */}
                <div className="property-card-footer">
                  <Button
                    type="button"
                    variant={isSelected ? 'secondary' : 'outline'}
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProperty(property);
                    }}
                  >
                    {isSelected ? (
                      <>
                        <Check size={14} style={{ marginRight: '6px' }} />
                        Currently Active
                      </>
                    ) : (
                      'Switch to this PG'
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
