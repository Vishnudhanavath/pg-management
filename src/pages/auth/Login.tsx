import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  BedDouble,
  CreditCard,
  UserCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { CelestialBackground } from './CelestialBackground';
import './auth.css';

interface LoginProps {
  onSuccess?: () => void;
  onNavigateToSignup?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSuccess, onNavigateToSignup }) => {
  const { login, loginWithOtp, loginWithGoogle, isLoading } = useAuthStore();

  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) return;
    setOtpSent(true);
    setOtp('123456');
    setOtpTimer(30);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMethod === 'password') {
      if (!email) return;
      const success = await login(email, password, 'owner');
      if (success && onSuccess) {
        onSuccess();
      }
    } else {
      if (!phone || !otp) return;
      const success = await loginWithOtp(phone, otp);
      if (success && onSuccess) {
        onSuccess();
      }
    }
  };

  const handleGoogleLogin = async () => {
    const success = await loginWithGoogle();
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
            <span>Next-Gen PG Operations Suite</span>
          </div>

          <h1 className="auth-hero-title">
            Run your PG with <span>effortless efficiency.</span>
          </h1>
          <p className="auth-hero-desc">
            Complete real-time control over room occupancy, instant UPI rent collections,
            digital KYC verification, and resident complaints — all in one modern command center.
          </p>

          <div className="auth-hero-features">
            <div className="auth-feature-card auth-feature-card-indigo">
              <div className="auth-feature-icon-box">
                <BedDouble size={19} />
              </div>
              <div className="auth-feature-body">
                <div className="auth-feature-header-row">
                  <span className="auth-feature-title">Live Room & Bed Matrix</span>
                  <span className="auth-feature-pill auth-feature-pill-emerald">
                    <span className="auth-feature-pill-dot"></span>
                    Real-time
                  </span>
                </div>
                <div className="auth-feature-desc">Interactive slots for single, double & triple occupancy with instant vacant bed alerts.</div>
              </div>
            </div>

            <div className="auth-feature-card auth-feature-card-cyan">
              <div className="auth-feature-icon-box">
                <CreditCard size={19} />
              </div>
              <div className="auth-feature-body">
                <div className="auth-feature-header-row">
                  <span className="auth-feature-title">Automated Rent & UPI Collections</span>
                  <span className="auth-feature-pill auth-feature-pill-cyan">
                    <Zap size={10} />
                    WhatsApp QR
                  </span>
                </div>
                <div className="auth-feature-desc">Dynamic QR codes, automatic WhatsApp payment reminders, and zero reconciliation hassle.</div>
              </div>
            </div>

            <div className="auth-feature-card auth-feature-card-emerald">
              <div className="auth-feature-icon-box">
                <UserCheck size={19} />
              </div>
              <div className="auth-feature-body">
                <div className="auth-feature-header-row">
                  <span className="auth-feature-title">Digital Tenant KYC & Dossier</span>
                  <span className="auth-feature-pill auth-feature-pill-violet">
                    <ShieldCheck size={10} />
                    Aadhaar Archive
                  </span>
                </div>
                <div className="auth-feature-desc">Paperless Aadhaar archives, digital agreements, police verification logs, and emergency contacts.</div>
              </div>
            </div>
          </div>

          {/* Stats Ticker (Commented out)
          <div className="auth-hero-stats">
            <div className="auth-hero-stat-item">
              <h5>98.4%</h5>
              <p>On-Time Collection</p>
            </div>
            <div className="auth-hero-stat-item">
              <h5>1,200+</h5>
              <p>Rooms Managed</p>
            </div>
            <div className="auth-hero-stat-item">
              <h5>₹4.8L+</h5>
              <p>Monthly Cashflow</p>
            </div>
            <div className="auth-hero-stat-item">
              <h5>4.9 ★</h5>
              <p>Owner Satisfaction</p>
            </div>
          </div>
          */}
        </div>

        <div className="auth-hero-footer">
          <span>&copy; {new Date().getFullYear()} MANA P.G Systems. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <a href="#support" onClick={(e) => e.preventDefault()}>Support</a>
          </div>
        </div>
      </div>

      {/* ================= Right Form Panel ================= */}
      <div className="auth-form-panel">
        <div className="auth-cool-card">
          <div className="auth-card-header">
            <div className="auth-card-top-badge">
              <Zap size={12} /> Secure Access Portal
            </div>
            <h2 className="auth-card-title">Welcome to MANA P.G</h2>
            <p className="auth-card-subtitle">
              Sign in to manage your properties, residents, and cashflow in real-time.
            </p>
          </div>

          {/* Auth Method Tabs: Password vs Mobile OTP */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${authMethod === 'password' ? 'active' : ''}`}
              onClick={() => setAuthMethod('password')}
            >
              <Mail size={15} /> Email & Password
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${authMethod === 'otp' ? 'active' : ''}`}
              onClick={() => {
                setAuthMethod('otp');
                if (!otpSent) handleSendOtp();
              }}
            >
              <Smartphone size={15} /> Mobile Phone OTP
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
            {authMethod === 'password' ? (
              <>
                <div className="auth-input-group">
                  <label htmlFor="login-email" className="auth-input-label">
                    Email Address, Username or Mobile
                  </label>
                  <div className="auth-input-wrapper">
                    <Mail size={16} className="auth-input-icon" />
                    <input
                      id="login-email"
                      type="text"
                      placeholder="e.g. owner@manapg.com or 9876543210"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="username"
                      className="auth-input"
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <div className="auth-input-label">
                    <label htmlFor="login-password">Password</label>
                    <button
                      type="button"
                      className="auth-forgot-link"
                      onClick={() => setIsForgotModalOpen(true)}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="auth-input-wrapper">
                    <Lock size={16} className="auth-input-icon" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
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
              </>
            ) : (
              <>
                <div className="auth-input-group">
                  <label htmlFor="login-phone" className="auth-input-label">
                    Registered Mobile Number
                  </label>
                  <div className="auth-input-wrapper">
                    <Smartphone size={16} className="auth-input-icon" />
                    <span className="auth-phone-prefix">+91</span>
                    <input
                      id="login-phone"
                      type="tel"
                      maxLength={10}
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      autoComplete="off"
                      className="auth-input auth-input-phone"
                    />
                  </div>
                </div>

                <div className="auth-input-group">
                  <label htmlFor="login-otp" className="auth-input-label">
                    6-Digit Verification Code
                  </label>
                  <div className="auth-otp-row">
                    <div className="auth-input-wrapper" style={{ flex: 1 }}>
                      <input
                        id="login-otp"
                        type="text"
                        maxLength={6}
                        placeholder="123456"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                        required
                        autoComplete="one-time-code"
                        className="auth-input"
                        style={{ letterSpacing: '0.22em', fontWeight: 'bold' }}
                      />
                    </div>
                    <button
                      type="button"
                      className="auth-send-otp-btn"
                      onClick={handleSendOtp}
                    >
                      {otpSent ? `Resend (${otpTimer}s)` : 'Send OTP'}
                    </button>
                  </div>
                  <div className="auth-otp-notice">
                    <span>Demo code: <strong>123456</strong></span>
                    <button
                      type="button"
                      className="auth-demo-otp-btn"
                      onClick={() => setOtp('123456')}
                    >
                      Auto-fill 123456
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="auth-row-options">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me on this browser</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="auth-submit-btn"
            >
              {isLoading ? (
                <span className="auth-spinner-label">
                  <span className="auth-spinner" /> Signing in...
                </span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <button
            type="button"
            className="auth-google-btn"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="auth-google-icon" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.72-2.1-6.66-4.93H1.3v3.15C3.3 21.3 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.34 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.3C.47 8.23 0 10.06 0 12s.47 3.77 1.3 5.42l4.04-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.3 2.7 1.3 6.58l4.04 3.15c.94-2.83 3.56-4.98 6.66-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="auth-switch-footer">
            <span>Don't have a PG account?</span>
            <button
              type="button"
              className="auth-switch-btn"
              onClick={onNavigateToSignup}
            >
              Register Your PG
            </button>
          </div>

          <div className="auth-security-badge">
            <ShieldCheck size={14} color="#34d399" />
            <span>256-bit Bank Grade SSL Encryption • Made for PG Owners</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        defaultEmail={email}
      />
    </div>
  );
};
