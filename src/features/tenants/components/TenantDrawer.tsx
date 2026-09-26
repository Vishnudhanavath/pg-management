import React, { useEffect, useState } from 'react';
import { BedDouble, Building2, CalendarDays, Edit3, FileText, Mail, MapPin, Phone, Save, X } from 'lucide-react';
import type { Tenant } from '../../../types/tenant';
import { Drawer } from '../../../components/ui/Drawer';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { formatCurrency } from '../../../lib/utils';
import { normalizeBedLabel } from '../tenantUtils';

export interface TenantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tenant: Tenant | null;
  onSave?: (tenant: Tenant) => void;
}

const getInitials = (name: string) => name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();

const formatDate = (date?: string) => {
  if (!date) return 'Not specified';
  return new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const TenantDrawer: React.FC<TenantDrawerProps> = ({ isOpen, onClose, tenant, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Tenant | null>(tenant);

  useEffect(() => {
    setDraft(tenant);
    setIsEditing(false);
  }, [tenant?.id, tenant]);

  if (!tenant || !draft) return null;

  const updateDraft = (field: keyof Tenant, value: string | number) => {
    setDraft((current) => current ? { ...current, [field]: value } : current);
  };

  const handleSave = () => {
    const monthlyRent = Number(draft.negotiatedRent ?? draft.monthlyRent) || 0;
    onSave?.({
      ...draft,
      age: draft.age ? Number(draft.age) : undefined,
      depositAmount: Number(draft.depositAmount) || 0,
      advancePayment: Number(draft.advancePayment) || 0,
      monthlyRent,
      negotiatedRent: monthlyRent,
      bedLabel: normalizeBedLabel(draft.bedLabel),
    });
    setIsEditing(false);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="tenant-profile-intro">
          <div className="tenant-profile-avatar">{getInitials(draft.name)}</div>
          <div className="tenant-profile-copy">
            <strong>{draft.name}</strong>
            <span>{draft.age ? "Age " + draft.age + " · " : ""}Resident · Room {draft.roomNumber}</span>
          </div>
          <div className="tenant-profile-actions">
            <StatusBadge status={draft.status} />
            <Button
              type="button"
              variant={isEditing ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setIsEditing((value) => !value)}
            >
              {isEditing ? <X size={14} /> : <Edit3 size={14} />}
              {isEditing ? 'Cancel' : 'Edit details'}
            </Button>
          </div>
        </div>
      }
    >
      <div className="tenant-detail-drawer">

        {isEditing ? (
          <div className="tenant-edit-form">
            <div className="tenant-edit-grid">
              <Input label="Full name" value={draft.name} onChange={(e) => updateDraft('name', e.target.value)} />
              <Input label="Age" type="number" min="0" value={draft.age || ''} onChange={(e) => updateDraft('age', Number(e.target.value))} />
              <Input label="Phone" value={draft.phone} onChange={(e) => updateDraft('phone', e.target.value)} />
              <Input label="Aadhaar number" type="text" inputMode="numeric" value={draft.aadhaarNumber || ''} onChange={(e) => updateDraft('aadhaarNumber', e.target.value.replace(/\D/g, '').slice(0, 12))} />
              <Input label="Alternate phone" type="tel" value={draft.alternatePhone || ''} onChange={(e) => updateDraft('alternatePhone', e.target.value)} />
              <Input label="Emergency phone" type="tel" value={draft.emergencyPhone || ''} onChange={(e) => updateDraft('emergencyPhone', e.target.value)} />
              <Input label="Email" type="email" value={draft.email} onChange={(e) => updateDraft('email', e.target.value)} />
            </div>
            <Input label="Address" value={draft.address || ''} onChange={(e) => updateDraft('address', e.target.value)} />
            <div className="tenant-edit-grid">
              <Input label="Room number" value={draft.roomNumber} onChange={(e) => updateDraft('roomNumber', e.target.value)} />
              <Input label="Bed" placeholder="e.g. Bed A" value={draft.bedLabel || ''} onChange={(e) => updateDraft('bedLabel', e.target.value)} onBlur={(e) => updateDraft('bedLabel', normalizeBedLabel(e.target.value))} />
              <Input label="Sharing type" value={draft.sharingType || ''} onChange={(e) => updateDraft('sharingType', e.target.value)} />
              <Input label="Move-in date" type="date" value={draft.moveInDate} onChange={(e) => updateDraft('moveInDate', e.target.value)} />
              <Input label="Expected move-out" type="date" value={draft.expectedMoveOutDate || ''} onChange={(e) => updateDraft('expectedMoveOutDate', e.target.value)} />
              <div className="input-group">
                <label className="input-label" htmlFor="tenant-status">Status</label>
                <select id="tenant-status" className="input-field" value={draft.status} onChange={(e) => updateDraft('status', e.target.value)}>
                  <option value="active">Active</option>
                  <option value="notice">Notice</option>
                  <option value="moved_out">Moved out</option>
                </select>
              </div>
              <Input label="Advance payment" type="number" min="0" value={draft.advancePayment || ''} onChange={(e) => updateDraft('advancePayment', Number(e.target.value))} />
              <Input label="Agreed monthly rent" type="number" min="0" value={draft.negotiatedRent ?? draft.monthlyRent} onChange={(e) => updateDraft('negotiatedRent', e.target.value === '' ? '' : Number(e.target.value))} />
            </div>
            <Button type="button" variant="primary" onClick={handleSave}>
              <Save size={15} /> Save Tenant Details
            </Button>
          </div>
        ) : (
          <>
            <div className="tenant-detail-section">
              <div className="tenant-detail-group-label">Contact</div>
              <div className="tenant-detail-item"><Phone size={16} /><div><span>Phone</span><strong>{draft.phone}</strong></div></div>
              <div className="tenant-detail-item"><FileText size={16} /><div><span>Aadhaar number</span><strong>{draft.aadhaarNumber ? `XXXX XXXX ${draft.aadhaarNumber.slice(-4)}` : 'Not provided'}</strong></div></div>
              <div className="tenant-detail-item"><Phone size={16} /><div><span>Alternate phone</span><strong>{draft.alternatePhone || 'Not provided'}</strong></div></div>
              <div className="tenant-detail-item"><Phone size={16} /><div><span>Emergency phone</span><strong>{draft.emergencyPhone || 'Not provided'}</strong></div></div>
              <div className="tenant-detail-item"><Mail size={16} /><div><span>Email</span><strong>{draft.email}</strong></div></div>
              <div className="tenant-detail-item"><MapPin size={16} /><div><span>Address</span><strong>{draft.address || 'Not specified'}</strong></div></div>
              {draft.aadhaarProof && <div className="tenant-detail-item"><FileText size={16} /><div><span>Aadhaar proof</span><a href={draft.aadhaarProof.dataUrl} download={draft.aadhaarProof.name}>{draft.aadhaarProof.name}</a></div></div>}
              <div className="tenant-detail-group-label">Accommodation</div>
              <div className="tenant-detail-item"><Building2 size={16} /><div><span>Room</span><strong>Room {draft.roomNumber}</strong></div></div>
              <div className="tenant-detail-item"><BedDouble size={16} /><div><span>Bed & sharing</span><strong>{normalizeBedLabel(draft.bedLabel) || 'Not assigned'} · {draft.sharingType || 'Sharing not set'}</strong></div></div>
              <div className="tenant-detail-group-label">Stay</div>
              <div className="tenant-detail-item"><CalendarDays size={16} /><div><span>Move-in date</span><strong>{formatDate(draft.moveInDate)}</strong></div></div>
              <div className="tenant-detail-item"><CalendarDays size={16} /><div><span>Expected move-out</span><strong>{formatDate(draft.expectedMoveOutDate)}</strong></div></div>
            </div>
            <div className="tenant-detail-group-label tenant-payment-label">Payments & agreement</div>
            <div className="tenant-detail-financials">
              <div><span>Advance payment</span><strong>{formatCurrency(draft.advancePayment || 0)}</strong></div>
              <div><span>Agreed monthly rent</span><strong>{formatCurrency(draft.negotiatedRent || draft.monthlyRent)}</strong></div>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
};
