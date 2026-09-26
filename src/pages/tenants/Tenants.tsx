import React, { useEffect, useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { PageHeader } from '../../components/common/PageHeader';
import { TenantTable } from '../../features/tenants/components/TenantTable';
import { TenantDrawer } from '../../features/tenants/components/TenantDrawer';
import { mockTenants } from '../../data/mockTenants';
import type { Tenant } from '../../types/tenant';
import { normalizeBedLabel } from '../../features/tenants/tenantUtils';

const TENANTS_STORAGE_KEY = 'pg_tenants';

const loadTenants = (): Tenant[] => {
  try {
    const saved = localStorage.getItem(TENANTS_STORAGE_KEY);
    if (!saved) return mockTenants;
    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed as Tenant[] : mockTenants;
  } catch (error) {
    console.error('Failed to load tenants from localStorage', error);
    return mockTenants;
  }
};

export const Tenants: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>(loadTenants);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [aadhaarError, setAadhaarError] = useState('');
  const [selectedProofName, setSelectedProofName] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(TENANTS_STORAGE_KEY, JSON.stringify(tenants));
    } catch (error) {
      console.error('Failed to save tenants to localStorage', error);
    }
  }, [tenants]);

  const handleSaveTenant = (updatedTenant: Tenant) => {
    setTenants((current) => current.map((tenant) => tenant.id === updatedTenant.id ? updatedTenant : tenant));
    setSelectedTenant(updatedTenant);
  };

  const handleAddTenant = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const proof = values.get('aadhaarProof');
    if (!(proof instanceof File) || !proof.size) {
      setAadhaarError('Upload an Aadhaar proof file.');
      return;
    }
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(proof.type)) {
      setAadhaarError('Choose a PDF, JPG, or PNG file.');
      return;
    }
    if (proof.size > 5 * 1024 * 1024) {
      setAadhaarError('The file must be 5 MB or smaller.');
      return;
    }
    const proofDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(proof);
    }).catch(() => '');
    if (!proofDataUrl) {
      setAadhaarError('Could not read this file. Please try again.');
      return;
    }
    const name = String(values.get('name'));
    const roomNumber = String(values.get('roomNumber'));
    const rent = Number(values.get('monthlyRent'));
    const age = Number(values.get('age'));
    const aadhaarNumber = String(values.get('aadhaarNumber')).replace(/\D/g, '');
    const newTenant: Tenant = {
      id: crypto.randomUUID(), name, age, phone: String(values.get('phone')), aadhaarNumber,
      alternatePhone: String(values.get('alternatePhone')), emergencyPhone: String(values.get('emergencyPhone')), email: String(values.get('email')),
      address: String(values.get('address')), propertyId: 'prop-1', roomId: "room-" + roomNumber, roomNumber,
      bedLabel: normalizeBedLabel(String(values.get('bedLabel'))), sharingType: String(values.get('sharingType')),
      moveInDate: String(values.get('moveInDate')), expectedMoveOutDate: '', depositAmount: Number(values.get('depositAmount')) || 0,
      advancePayment: Number(values.get('advancePayment')) || 0, monthlyRent: rent, negotiatedRent: rent,
      aadhaarProof: { name: proof.name, type: proof.type, dataUrl: proofDataUrl }, status: 'active',
    };
    setTenants((current) => [newTenant, ...current]);
    setIsAddOpen(false);
  };

  return (
    <div className="page-tenants tenant-page">
      <PageHeader title="Tenants" subtitle="Resident directory and active agreements" action={<Button onClick={() => setIsAddOpen(true)}><Plus size={16} /> Add tenant</Button>} />
      <TenantTable tenants={tenants} onSelectTenant={setSelectedTenant} />
      <TenantDrawer isOpen={Boolean(selectedTenant)} onClose={() => setSelectedTenant(null)} tenant={selectedTenant} onSave={handleSaveTenant} />
      <Modal isOpen={isAddOpen} onClose={() => { setIsAddOpen(false); setAadhaarError(''); setSelectedProofName(''); }} title="Add tenant" subtitle="Add a resident and their agreement details" maxWidth="720px" footer={null}>
        <form className="tenant-edit-form tenant-create-form" onSubmit={handleAddTenant}>
          <div className="tenant-edit-grid">
            <Input label="Full name" name="name" placeholder="e.g. Rahul Sharma" required autoFocus />
            <Input label="Age" name="age" type="number" min="1" max="120" step="1" placeholder="e.g. 25" required />
            <Input label="Phone" name="phone" type="tel" placeholder="e.g. +91 98765 43210" required />
            <Input label="Aadhaar number" name="aadhaarNumber" type="text" inputMode="numeric" autoComplete="off" maxLength={12} pattern="[0-9]{12}" title="Enter a 12-digit Aadhaar number" placeholder="12-digit Aadhaar number" required />
            <Input label="Alternate phone" name="alternatePhone" type="tel" placeholder="e.g. +91 98765 43210" />
            <Input label="Emergency phone" name="emergencyPhone" type="tel" placeholder="e.g. +91 98765 43210" required />
            <Input label="Email" name="email" type="email" placeholder="e.g. rahul@example.com" required />
            <Input label="Address" name="address" placeholder="e.g. Koramangala, Bengaluru" />
            <Input label="Room number" name="roomNumber" placeholder="e.g. 101" required />
            <Input label="Bed" name="bedLabel" placeholder="e.g. Bed A" />
            <Input label="Sharing type" name="sharingType" placeholder="e.g. 2 Share" />
            <Input label="Move-in date" name="moveInDate" type="date" required />
            <Input label="Deposit amount" name="depositAmount" type="number" min="0" defaultValue="0" />
            <Input label="Advance payment" name="advancePayment" type="number" min="0" defaultValue="0" />
            <Input label="Agreed monthly rent" name="monthlyRent" type="number" min="0" placeholder="e.g. 9500" required />
          </div>
          <div className="tenant-proof-field">
            <label className="input-label" htmlFor="tenant-aadhaar-proof">Aadhaar proof</label>
            <label className="tenant-proof-picker" htmlFor="tenant-aadhaar-proof">
              <Upload size={18} aria-hidden="true" />
              <span>{selectedProofName || 'Select PDF, JPG, or PNG'}</span>
              <small>Maximum file size 5 MB</small>
            </label>
            <input id="tenant-aadhaar-proof" className="tenant-proof-input" type="file" name="aadhaarProof" accept="application/pdf,image/jpeg,image/png" required onChange={(event) => { setAadhaarError(''); setSelectedProofName(event.target.files?.[0]?.name || ''); }} />
            {aadhaarError && <span className="input-error-text">{aadhaarError}</span>}
          </div>
          <Button type="submit"><Plus size={16} /> Add tenant</Button>
        </form>
      </Modal>
    </div>
  );
};
