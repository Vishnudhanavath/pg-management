import React, { useState } from 'react';
import {
  Building2,
  Users,
  User,
  UserCheck,
  MapPin,
  Layers,
  BedDouble,
  Phone,
  Navigation,
  Check,
  Pencil,
  IndianRupee,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { usePropertyStore } from '../../../store/usePropertyStore';
import type { Property, PropertyType } from '../../../types/property';

interface SharingTypeItem {
  beds: number;
  label: string;
  sub: string;
  placeholder: string;
  isCustom?: boolean;
}

const DEFAULT_SHARING_ITEMS: SharingTypeItem[] = [
  { beds: 1, label: '1 Share', sub: 'Single Bed', placeholder: 'e.g. 14000' },
  { beds: 2, label: '2 Share', sub: 'Double Bed', placeholder: 'e.g. 9000' },
  { beds: 3, label: '3 Share', sub: 'Triple Bed', placeholder: 'e.g. 7500' },
  { beds: 4, label: '4 Share', sub: 'Four Bed', placeholder: 'e.g. 6000' },
];

interface EditPropertyFormData {
  name: string;
  address: string;
  propertyType: PropertyType;
  totalFloors: string;
  totalRooms: string;
  contactPhone: string;
  description: string;
  sharingRents: Record<number, string>;
}

interface EditPropertyModalContentProps {
  property: Property;
  onClose: () => void;
}

const EditPropertyModalContent: React.FC<EditPropertyModalContentProps> = ({ property, onClose }) => {
  const { updateProperty } = usePropertyStore();

  const customKeys = Object.keys(property.sharingRents || {})
    .map(Number)
    .filter((k) => k > 4);

  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [customShares, setCustomShares] = useState<number[]>(customKeys);

  const [formData, setFormData] = useState<EditPropertyFormData>({
    name: property.name || '',
    address: property.address || '',
    propertyType: property.propertyType || 'Men',
    totalFloors: (property.totalFloors ?? 1).toString(),
    totalRooms: (property.totalRooms ?? 1).toString(),
    contactPhone: property.contactPhone || '',
    description: property.description || '',
    sharingRents: {
      1: property.sharingRents?.[1]?.toString() || '',
      2: property.sharingRents?.[2]?.toString() || '',
      3: property.sharingRents?.[3]?.toString() || '',
      4: property.sharingRents?.[4]?.toString() || '',
      ...Object.fromEntries(
        Object.entries(property.sharingRents || {})
          .filter(([b]) => Number(b) > 4)
          .map(([b, v]) => [b, v.toString()])
      ),
    },
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scrollToModalTop = () => {
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
      modalContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (step: 1 | 2) => {
    setActiveStep(step);
    scrollToModalTop();
  };

  const handleAddCustomShare = () => {
    const allBeds = [1, 2, 3, 4, ...customShares];
    const nextBed = Math.max(...allBeds) + 1;
    if (nextBed <= 8) {
      setCustomShares((prev) => [...prev, nextBed]);
    }
  };

  const handleRemoveCustomShare = (beds: number) => {
    setCustomShares((prev) => prev.filter((b) => b !== beds));
    setFormData((prev) => {
      const updated = { ...prev.sharingRents };
      delete updated[beds];
      return { ...prev, sharingRents: updated };
    });
  };

  const allSharingItems: SharingTypeItem[] = [
    ...DEFAULT_SHARING_ITEMS,
    ...customShares.map((b) => ({
      beds: b,
      label: `${b} Share`,
      sub: `${b} Beds Dorm`,
      placeholder: `e.g. ${Math.max(3000, 7000 - (b - 3) * 1000)}`,
      isCustom: true,
    })),
  ];

  const handleSharingRentChange = (beds: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      sharingRents: {
        ...prev.sharingRents,
        [beds]: value,
      },
    }));
    if (errors[`rent_${beds}`]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[`rent_${beds}`];
        return updated;
      });
    }
  };

  const handleChange = (field: keyof EditPropertyFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Property name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Property name must be at least 3 characters';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Property address is required';
    } else if (formData.address.trim().length < 5) {
      newErrors.address = 'Please provide a complete address';
    }

    const floors = parseInt(formData.totalFloors, 10);
    if (isNaN(floors) || floors < 1) {
      newErrors.totalFloors = 'At least 1 floor';
    } else if (floors > 50) {
      newErrors.totalFloors = 'Max 50 floors';
    }

    const rooms = parseInt(formData.totalRooms, 10);
    if (isNaN(rooms) || rooms < 1) {
      newErrors.totalRooms = 'At least 1 room';
    } else if (rooms > 500) {
      newErrors.totalRooms = 'Max 500 rooms';
    }

    const phoneTrimmed = formData.contactPhone.trim();
    if (phoneTrimmed && !/^[0-9+() -]{7,15}$/.test(phoneTrimmed)) {
      newErrors.contactPhone = 'Invalid phone format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};

    Object.entries(formData.sharingRents).forEach(([b, val]) => {
      if (val && val.trim()) {
        const num = Number(val);
        if (isNaN(num) || num <= 0) {
          newErrors[`rent_${b}`] = 'Invalid amount';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinueToStep2 = () => {
    if (validateStep1()) {
      goToStep(2);
    } else {
      setTimeout(() => {
        const firstError = document.querySelector('.input-error, .input-error-text');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          scrollToModalTop();
        }
      }, 50);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const isStep1Valid = validateStep1();
    const isStep2Valid = validateStep2();

    if (!isStep1Valid) {
      goToStep(1);
      return;
    }
    if (!isStep2Valid) {
      goToStep(2);
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedSharingRents: Record<number, number> = {};
      Object.entries(formData.sharingRents).forEach(([b, val]) => {
        const num = Number(val);
        if (!isNaN(num) && num > 0) {
          parsedSharingRents[Number(b)] = num;
        }
      });

      updateProperty(property.id, {
        name: formData.name.trim(),
        address: formData.address.trim(),
        propertyType: formData.propertyType,
        totalFloors: parseInt(formData.totalFloors, 10),
        totalRooms: parseInt(formData.totalRooms, 10),
        contactPhone: formData.contactPhone.trim() || undefined,
        description: formData.description.trim() || undefined,
        sharingRents: parsedSharingRents,
      });

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = Boolean(
    formData.name.trim().length >= 3 &&
    formData.address.trim().length >= 5 &&
    parseInt(formData.totalFloors, 10) >= 1 &&
    parseInt(formData.totalRooms, 10) >= 1
  );

  const modalTitle = (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <Pencil size={22} style={{ color: 'var(--primary)' }} />
      <span>Edit PG Property</span>
    </div>
  );

  const modalFooter = (
    <>
      {activeStep === 1 ? (
        <>
          <span className="footer-required-hint">* Required fields</span>
          <div className="modal-footer-actions">
            <Button
              type="button"
              variant="primary"
              onClick={handleContinueToStep2}
              id="btn-edit-next-step"
            >
              Next: Sharing Rates & Pricing
              <ArrowRight size={16} style={{ marginLeft: '6px' }} />
            </Button>
          </div>
        </>
      ) : (
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={() => goToStep(1)}
            id="btn-edit-prev-step"
          >
            <ArrowLeft size={16} style={{ marginRight: '6px' }} />
            Back to Details
          </Button>
          <div className="modal-footer-actions">
            <Button
              type="button"
              variant="primary"
              disabled={isSubmitting}
              onClick={() => handleSubmit()}
              id="btn-edit-property-apply"
            >
              <Check size={16} style={{ marginRight: '6px' }} />
              {isSubmitting ? 'Saving Changes...' : 'Apply'}
            </Button>
          </div>
        </>
      )}
    </>
  );

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={modalTitle}
      subtitle={`Update details, address, floor counts, and sharing rates for ${property.name || 'this property'}.`}
      footer={modalFooter}
      maxWidth="840px"
    >
      <form onSubmit={handleSubmit} noValidate>
        {/* Premium Stepper Hero */}
        <div className="stepper-hero-container">
          <div className="stepper-progress-track">
            <div
              className="stepper-progress-fill"
              style={{ width: activeStep === 1 ? '50%' : '100%' }}
            />
          </div>

          <div className="stepper-cards-row">
            {/* Step 1 Card */}
            <button
              type="button"
              className={`stepper-card ${activeStep === 1 ? 'is-active' : ''} ${isStep1Valid ? 'is-completed' : ''}`}
              onClick={() => goToStep(1)}
              id="stepper-edit-step-1"
            >
              <div className="stepper-icon-box">
                {isStep1Valid && activeStep !== 1 ? (
                  <Check size={20} strokeWidth={2.5} />
                ) : (
                  <Building2 size={20} />
                )}
              </div>
              <div className="stepper-info-wrap">
                <div className="stepper-tag-row">
                  <span className="stepper-tag">STEP 1</span>
                  {isStep1Valid && activeStep !== 1 && (
                    <span className="stepper-status-chip done">Completed ✓</span>
                  )}
                  {activeStep === 1 && (
                    <span className="stepper-status-chip current">In Progress</span>
                  )}
                </div>
                <span className="stepper-card-title">Building Details</span>
                <span className="stepper-card-desc">Name, Category, Location & Floors</span>
              </div>
              {activeStep === 1 && <div className="stepper-active-indicator" />}
            </button>

            {/* Connecting Flow Arrow */}
            <div className="stepper-flow-arrow">
              <div className="stepper-arrow-circle">
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Step 2 Card */}
            <button
              type="button"
              className={`stepper-card ${activeStep === 2 ? 'is-active' : ''}`}
              onClick={handleContinueToStep2}
              id="stepper-edit-step-2"
            >
              <div className="stepper-icon-box">
                <IndianRupee size={20} />
              </div>
              <div className="stepper-info-wrap">
                <div className="stepper-tag-row">
                  <span className="stepper-tag">STEP 2</span>
                  {activeStep === 2 && (
                    <span className="stepper-status-chip current">In Progress</span>
                  )}
                </div>
                <span className="stepper-card-title">Sharing Rates & Pricing</span>
                <span className="stepper-card-desc">1, 2, 3, 4 Share Monthly Rent</span>
              </div>
              {activeStep === 2 && <div className="stepper-active-indicator" />}
            </button>
          </div>
        </div>

        {/* STEP 1: Building Details */}
        {activeStep === 1 && (
          <div className="step-content-pane">
            {/* Property Name */}
            <Input
              label={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                  <Building2 size={16} style={{ color: 'var(--primary)' }} />
                  Property / PG Name *
                </span>
              }
              placeholder="e.g. Royal Palms Executive Coliving"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={errors.name}
            />

            {/* PG Category Cards */}
            <div className="input-group">
              <label className="input-label">PG Category *</label>
              <div className="property-type-selector">
                {(['Co-ed', 'Men', 'Women'] as PropertyType[]).map((type) => {
                  const isActive = formData.propertyType === type;
                  return (
                    <button
                      type="button"
                      key={type}
                      className={`type-pill-btn ${isActive ? 'active' : ''}`}
                      onClick={() => handleChange('propertyType', type)}
                    >
                      <div className="type-pill-icon-box">
                        {type === 'Co-ed' && <Users size={18} />}
                        {type === 'Men' && <User size={18} />}
                        {type === 'Women' && <UserCheck size={18} />}
                      </div>
                      <div className="type-pill-text-wrap">
                        <span className="type-pill-label">
                          {type === 'Co-ed' ? 'Co-ed Living' : type === 'Men' ? "Men's PG" : "Women's PG"}
                        </span>
                        <span className="type-pill-sub">
                          {type === 'Co-ed' ? 'All residents welcome' : type === 'Men' ? 'Male residents only' : 'Female residents only'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Address & Landmark Row */}
            <div className="form-row-2">
              <div className="input-group" style={{ marginBottom: 0 }}>
                <label className="input-label" htmlFor="edit-prop-address">
                  <MapPin size={16} style={{ color: 'var(--primary)' }} />
                  Full Address *
                </label>
                <input
                  id="edit-prop-address"
                  className={`input-field ${errors.address ? 'input-error' : ''}`}
                  placeholder="e.g. #45, 17th Main Rd, 5th Block, Koramangala"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
                {errors.address && <span className="input-error-text">{errors.address}</span>}
              </div>

              <Input
                label={
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                    <Navigation size={16} style={{ color: 'var(--primary)' }} />
                    Landmark / Area
                  </span>
                }
                placeholder="e.g. Near Sony World Signal"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>

            {/* Floors, Rooms, and Phone in 3-column row */}
            <div className="form-row-3" style={{ marginTop: '16px' }}>
              <Input
                label={
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                    <Layers size={16} style={{ color: 'var(--primary)' }} />
                    Total Floors *
                  </span>
                }
                type="number"
                min="1"
                max="50"
                placeholder="e.g. 3"
                value={formData.totalFloors}
                onChange={(e) => handleChange('totalFloors', e.target.value)}
                error={errors.totalFloors}
              />

              <Input
                label={
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                    <BedDouble size={16} style={{ color: 'var(--primary)' }} />
                    Total Rooms *
                  </span>
                }
                type="number"
                min="1"
                max="500"
                placeholder="e.g. 24"
                value={formData.totalRooms}
                onChange={(e) => handleChange('totalRooms', e.target.value)}
                error={errors.totalRooms}
              />

              <Input
                label={
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                    <Phone size={16} style={{ color: 'var(--primary)' }} />
                    Helpline Phone
                  </span>
                }
                type="tel"
                placeholder="e.g. +91 98765 43210"
                value={formData.contactPhone}
                onChange={(e) => handleChange('contactPhone', e.target.value)}
                error={errors.contactPhone}
              />
            </div>
          </div>
        )}

        {/* STEP 2: Sharing Rates Pricing */}
        {activeStep === 2 && (
          <div className="step-content-pane">
            <div className="room-autogen-setup-card" style={{ marginTop: 0 }}>
              <div className="sharing-rent-header-row">
                <label className="input-label" style={{ marginBottom: 0 }}>
                  <IndianRupee size={16} style={{ color: 'var(--primary)', marginRight: '4px' }} />
                  Monthly Rent per Bed by Sharing Type
                </label>
                <button
                  type="button"
                  className="btn-add-share-type"
                  onClick={handleAddCustomShare}
                  title="Add higher sharing type (e.g. 5 Share)"
                >
                  <Plus size={14} />
                  <span>Add More Share</span>
                </button>
              </div>
              <p className="autogen-subtitle" style={{ marginBottom: '12px' }}>
                Configure your standard monthly pricing per bed for 1 share, 2 share, etc.
              </p>

              <div className="sharing-rent-grid">
                {allSharingItems.map((item) => {
                  const rentVal = formData.sharingRents[item.beds] || '';
                  const hasError = Boolean(errors[`rent_${item.beds}`]);

                  return (
                    <div
                      key={item.beds}
                      className="sharing-rent-card"
                    >
                      <div className="sharing-rent-header">
                        <div className="sharing-rent-title-wrap">
                          <span className="sharing-rent-icon">
                            {item.beds === 1 ? <User size={15} /> : <Users size={15} />}
                          </span>
                          <span className="sharing-rent-label">{item.label}</span>
                        </div>
                        {item.isCustom && (
                          <button
                            type="button"
                            className="btn-remove-share"
                            onClick={() => handleRemoveCustomShare(item.beds)}
                            title="Remove custom share"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <span className="sharing-rent-sub">{item.sub}</span>

                      <div className={`sharing-rent-input-box ${hasError ? 'has-error' : ''}`}>
                        <span className="sharing-rent-currency">₹</span>
                        <input
                          type="number"
                          min="1"
                          className="sharing-rent-input"
                          placeholder={item.placeholder}
                          value={rentVal}
                          onChange={(e) => handleSharingRentChange(item.beds, e.target.value)}
                        />
                      </div>
                      {hasError && (
                        <span className="input-error-text" style={{ fontSize: '0.75rem', marginTop: '3px' }}>
                          {errors[`rent_${item.beds}`]}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export const EditPropertyModal: React.FC = () => {
  const { isEditModalOpen, closeEditModal, editingProperty } = usePropertyStore();

  if (!isEditModalOpen || !editingProperty) {
    return null;
  }

  return (
    <EditPropertyModalContent
      key={editingProperty.id}
      property={editingProperty}
      onClose={closeEditModal}
    />
  );
};
