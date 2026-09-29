import React, { useState } from 'react';
import {
  Mail,
  ArrowLeft,
  CheckCircle2,
  Send,
  ShieldCheck,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Key,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { toast } from '../../store/useToastStore';
import { authApi } from '../../lib/api';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

type ModalStep = 'request' | 'confirm' | 'success';

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
}) => {
  const [step, setStep] = useState<ModalStep>('request');
  const [email, setEmail] = useState(defaultEmail);
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Step 1: Send Forgot Password Request (POST /api/v1/auth/forgot-password)
  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await authApi.forgotPassword({ email: email.trim() });
      toast.success(
        'Reset Instructions Sent',
        `We've sent a recovery token/link to ${email}.`
      );
      setStep('confirm');
    } catch (err: any) {
      if (err.message === 'BACKEND_UNREACHABLE') {
        // Backend offline fallback: auto-fill demo token to let user test Step 2 seamlessly
        toast.info(
          'Backend API Offline',
          'Switched to offline testing mode. Demo reset token pre-filled.'
        );
        setResetToken('DEMO-OTP-123456');
        setStep('confirm');
      } else {
        toast.error('Request Failed', err.message || 'Could not send reset instructions.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Confirm Reset Password (POST /api/v1/auth/reset-password)
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetToken.trim()) {
      toast.warning('Token Required', 'Please enter the reset token or OTP code.');
      return;
    }

    if (newPassword.length < 8) {
      toast.warning('Password Too Short', 'New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords Do Not Match', 'Please ensure both password fields match.');
      return;
    }

    setIsSubmitting(true);
    try {
      await authApi.resetPassword({
        reset_token: resetToken.trim(),
        new_password: newPassword,
      });

      toast.success('Password Updated', 'Your password has been changed successfully!');
      setStep('success');
    } catch (err: any) {
      if (err.message === 'BACKEND_UNREACHABLE') {
        // Backend offline fallback
        toast.info(
          'Backend API Offline',
          'Demo password reset simulated successfully! Please sign in with your new credentials.'
        );
        setStep('success');
      } else {
        toast.error('Reset Failed', err.message || 'Invalid or expired reset token.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('request');
    setResetToken('');
    setNewPassword('');
    setConfirmPassword('');
    onClose();
  };

  return (
    <div className="auth-modal-backdrop" onClick={handleClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="auth-modal-header">
          <div className="auth-modal-icon-badge">
            <KeyRound size={22} className="auth-modal-icon" />
          </div>
          <h3>
            {step === 'request' && 'Reset Password'}
            {step === 'confirm' && 'Set New Password'}
            {step === 'success' && 'Password Changed!'}
          </h3>
          <p className="auth-modal-subtitle">
            {step === 'request' &&
              'Enter your registered email address to receive password reset instructions and OTP token.'}
            {step === 'confirm' &&
              `Enter the verification token sent to ${email || 'your email'} and choose a new password.`}
            {step === 'success' &&
              'Your password has been updated securely. You can now log into your account.'}
          </p>
        </div>

        {/* STEP 1: Request Reset */}
        {step === 'request' && (
          <form onSubmit={handleRequestSubmit} className="auth-modal-form">
            <div className="auth-input-group">
              <label htmlFor="reset-email" className="auth-input-label">
                Registered Email Address
              </label>
              <div className="auth-input-wrapper">
                <Mail size={18} className="auth-input-icon" />
                <input
                  id="reset-email"
                  type="email"
                  placeholder="e.g. owner@manapg.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="auth-input"
                  autoFocus
                />
              </div>
            </div>

            <div className="auth-modal-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isSubmitting}
                className="auth-modal-cancel-btn"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !email}
                className="auth-modal-submit-btn"
              >
                {isSubmitting ? (
                  <span className="auth-spinner-label">
                    <span className="auth-spinner" /> Sending...
                  </span>
                ) : (
                  <>
                    <Send size={16} /> Send Reset Link
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: Confirm Reset Token & New Password */}
        {step === 'confirm' && (
          <form onSubmit={handleResetSubmit} className="auth-modal-form">
            <div className="auth-input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="reset-token" className="auth-input-label">
                  Reset Token / OTP Code
                </label>
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="auth-forgot-link"
                  style={{ fontSize: '0.75rem' }}
                >
                  Change Email
                </button>
              </div>
              <div className="auth-input-wrapper">
                <Key size={18} className="auth-input-icon" />
                <input
                  id="reset-token"
                  type="text"
                  placeholder="Paste reset token or enter OTP"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  required
                  className="auth-input"
                  autoFocus
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label htmlFor="new-password" className="auth-input-label">
                New Password (Min 8 chars)
              </label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
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

            <div className="auth-input-group">
              <label htmlFor="confirm-new-password" className="auth-input-label">
                Confirm New Password
              </label>
              <div className="auth-input-wrapper">
                <Lock size={18} className="auth-input-icon" />
                <input
                  id="confirm-new-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="auth-input"
                />
              </div>
            </div>

            <div className="auth-modal-actions">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep('request')}
                disabled={isSubmitting}
                className="auth-modal-cancel-btn"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || !resetToken || !newPassword}
                className="auth-modal-submit-btn"
              >
                {isSubmitting ? (
                  <span className="auth-spinner-label">
                    <span className="auth-spinner" /> Updating...
                  </span>
                ) : (
                  <>
                    <KeyRound size={16} /> Update Password
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* STEP 3: Success Screen */}
        {step === 'success' && (
          <div className="auth-modal-success">
            <div className="auth-success-badge">
              <CheckCircle2 size={36} color="var(--success, #10b981)" />
            </div>
            <h4>Password Updated Successfully!</h4>
            <p>
              Your credentials have been securely updated. You can now sign into your MANA P.G dashboard using your new password.
            </p>
            <div className="auth-security-notice">
              <ShieldCheck size={16} />
              <span>Security Tip: Keep your new password private and avoid sharing account tokens.</span>
            </div>
            <div className="auth-modal-success-actions">
              <Button variant="primary" onClick={handleClose} size="md" style={{ width: '100%' }}>
                <ArrowLeft size={16} /> Back to Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

