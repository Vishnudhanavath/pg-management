import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  BedDouble,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { CelestialBackground } from './CelestialBackground';
import './auth.css';

import { toast } from '../../store/useToastStore';
import type { UserRole } from '../../types/auth';

interface SignupProps {
  onSuccess?: () => void;
  onNavigateToLogin?: () => void;
}

export const Signup: React.FC<SignupProps> = ({ onSuccess, onNavigateToLogin }) => {
  const { signup, isLoading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('owner');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    if (password.length < 8) {
      toast.warning('Password Requirement', 'Password must be at least 8 characters long.');
      return;
    }

    const success = await signup({
      name,
      email,
      phone,
      role,
      password,
    });

    if (success && onSuccess) {
      onSuccess();
    }
  };


  return (
    <div className="auth-page-container">
      {/* Immersive Celestial Universe: Glowing Moon, Twinkling Stars & Meteors */}
      <CelestialBackground />

      {/* ================= Left Hero Panel ================= */}
      <div className="auth-hero-panel">
        <div className="auth-ambient-orb-1" />
        <div className="auth-ambient-orb-2" />

        <div className="auth-hero-brand">
          <div className="auth-hero-logo-icon">
            <Building2 size={22} />
          </div>
          <div>
            <div className="auth-hero-brand-name">MANA P.G</div>
            <div className="auth-hero-brand-tag">Smart PG & Hostel Management Suite</div>
          </div>
        </div>

        <div className="auth-hero-content">
          <div className="auth-hero-pill">
            <span className="auth-hero-pill-dot" />
            <Sparkles size={13} />
            <span>Join 150+ Leading PG Owners</span>
          </div>

          <h1 className="auth-hero-title">
            Take control of your <span>PG business today.</span>
          </h1>
          <p className="auth-hero-desc">
            Automate tenant management, bed allocations, electricity & maintenance charges,
            and collect rents seamlessly with zero paperwork.
          </p>

          <div className="auth-hero-features">
            <div className="auth-feature-card auth-feature-card-emerald">
              <div className="auth-feature-icon-box">
                <CheckCircle2 size={19} />
              </div>
              <div className="auth-feature-body">
                <div className="auth-feature-header-row">
                  <span className="auth-feature-title">Fast 2-Minute Onboarding</span>
                  <span className="auth-feature-pill auth-feature-pill-emerald">
                    <span className="auth-feature-pill-dot"></span>
                    Instant
                  </span>
                </div>
                <div className="auth-feature-desc">Set up your rooms, floor plans, and sharing rents in under 2 minutes.</div>
              </div>
            </div>

            <div className="auth-feature-card auth-feature-card-cyan">
              <div className="auth-feature-icon-box">
                <BedDouble size={19} />
              </div>
              <div className="auth-feature-body">
                <div className="auth-feature-header-row">
                  <span className="auth-feature-title">Multi-Branch Scaling</span>
                  <span className="auth-feature-pill auth-feature-pill-cyan">
                    <Sparkles size={10} />
                    Unlimited
                  </span>
                </div>
                <div className="auth-feature-desc">Scale effortlessly across multiple properties and wardens from one central account.</div>
              </div>
            </div>
          </div>

          {/* Stats Ticker (Commented out)
          <div className="auth-hero-stats">
            <div className="auth-hero-stat-item">
              <h5>₹0</h5>
              <p>Setup Fee</p>
            </div>
            <div className="auth-hero-stat-item">
              <h5>2 Min</h5>
              <p>Instant Go-Live</p>
            </div>
            <div className="auth-hero-stat-item">
              <h5>100%</h5>
              <p>Cloud Security</p>
            </div>
            <div className="auth-hero-stat-item">
              <h5>24/7</h5>
              <p>Priority Support</p>
            </div>
          </div>
          */}
        </div>

        <div className="auth-hero-footer">
          <span>&copy; {new Date().getFullYear()} MANA P.G Systems. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
          </div>
        </div>
      </div>

      {/* ================= Right Form Panel ================= */}
      <div className="auth-form-panel">
        <div className="auth-cool-card">
          <div className="auth-card-header">
            <div className="auth-card-top-badge">
              <Zap size={12} /> Free 30-Day PG Trial
            </div>
            <h2 className="auth-card-title">Register Your PG</h2>
            <p className="auth-card-subtitle">
              Start managing rooms, rent collection, and residents with ease.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
            <div className="auth-input-group">
              <label htmlFor="signup-role" className="auth-input-label">
                Role
              </label>
              <div className="auth-input-wrapper">
                <ShieldCheck size={16} className="auth-input-icon" />
                <select
                  id="signup-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="auth-input"
                  aria-label="Select role"
                >
                  <option value="owner">Owner</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
                <ChevronDown size={17} className="auth-select-chevron" aria-hidden="true" />
              </div>
            </div>

            <div className="auth-input-group">
              <label htmlFor="owner-name" className="auth-input-label">
                Owner / Manager Full Name
              </label>
              <div className="auth-input-wrapper">
                <User size={16} className="auth-input-icon" />
                <input
                  id="owner-name"
                  type="text"
                  placeholder="e.g. Chandu Sekhar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  className="auth-input"
                />
              </div>
            </div>

            <div className="auth-signup-grid-2">
              <div className="auth-input-group">
                <label htmlFor="signup-email" className="auth-input-label">
                  Work Email
                </label>
                <div className="auth-input-wrapper">
                  <Mail size={16} className="auth-input-icon" />
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="chandu@manapg.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="auth-input"
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label htmlFor="signup-phone" className="auth-input-label">
                  Mobile Number
                </label>
                <div className="auth-input-wrapper">
                  <Phone size={16} className="auth-input-icon" />
                  <input
                    id="signup-phone"
                    type="tel"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>
            </div>

            <div className="auth-input-group">
              <label htmlFor="signup-password" className="auth-input-label">
                Create Password
              </label>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="auth-input"
                />
                <button
                  type="button"
                  className="auth-input-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="auth-submit-btn"
              style={{ marginTop: '4px' }}
            >
              {isLoading ? (
                <span className="auth-spinner-label">
                  <span className="auth-spinner" /> Creating Account...
                </span>
              ) : (
                <>
                  <span>Create PG Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="auth-switch-footer">
            <span>Already have an account?</span>
            <button
              type="button"
              className="auth-switch-btn"
              onClick={onNavigateToLogin}
            >
              Sign In Here
            </button>
          </div>

          <div className="auth-security-badge">
            <ShieldCheck size={14} color="#34d399" />
            <span>256-bit Bank Grade SSL Encryption • Made for PG Owners</span>
          </div>
        </div>
      </div>
    </div>
  );
};
