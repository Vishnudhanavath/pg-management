import { mockInvoices } from '../../data/mockInvoices';
import type { Tenant } from '../../types/tenant';

export const normalizeBedLabel = (value?: string) => {
  const label = value?.trim().replace(/^bed[\s:]*/i, '').trim();
  return label ? `Bed ${label}` : '';
};

export const getTenantRentStatus = (tenant: Tenant): 'paid' | 'pending' | 'overdue' => {
  if (tenant.rentStatus) return tenant.rentStatus;
  const invoice = mockInvoices.find(
    (inv) => inv.tenantId === tenant.id || inv.tenantName.toLowerCase() === tenant.name.toLowerCase()
  );
  if (invoice) return invoice.status as 'paid' | 'pending' | 'overdue';
  return 'pending';
};

