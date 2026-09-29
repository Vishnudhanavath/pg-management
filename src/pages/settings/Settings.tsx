import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Mail, Shield, Building2, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export const Settings: React.FC = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="page-settings" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <PageHeader title="Settings" subtitle="System preferences and account options" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* User Account Profile */}
        <Card title="Current Account & Session">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, var(--primary) 0%, #818cf8 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  {user?.name || 'PG Administrator'}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <span
                    style={{
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    {user?.role ? user.role.toUpperCase() : 'OWNER'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Active Session
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                borderTop: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                padding: '14px 0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
                <Mail size={16} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-muted)' }}>Email:</span>
                <strong style={{ color: 'var(--text-main)' }}>{user?.email || 'owner@manapg.com'}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
                <Building2 size={16} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-muted)' }}>Property:</span>
                <strong style={{ color: 'var(--text-main)' }}>{user?.propertyName || 'MANA Executive PG'}</strong>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem' }}>
                <Shield size={16} color="var(--text-muted)" />
                <span style={{ color: 'var(--text-muted)' }}>Security:</span>
                <span style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> 2FA & SSL Protected
                </span>
              </div>
            </div>

            <div>
              <Button
                variant="danger"
                onClick={() => logout()}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <LogOut size={16} /> Sign Out of Account
              </Button>
            </div>
          </div>
        </Card>

        {/* General Application Preferences */}
        <Card title="System Preferences">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ display: 'block' }}>Automatic Rent Reminders</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Send WhatsApp & SMS notifications on 1st of month</span>
              </div>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <div>
                <strong style={{ display: 'block' }}>Digital KYC Mandatory</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Require Aadhaar before confirming bed allocation</span>
              </div>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <div>
                <strong style={{ display: 'block' }}>Sound & Desktop Alerts</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Notify immediately upon UPI rent payment received</span>
              </div>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
