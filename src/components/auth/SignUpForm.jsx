import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function SignUpForm({ onSuccess, onSwitchToLogin }) {
  const { signUp, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4:
      case 5: return 'Strong';
      default: return '';
    }
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 0:
      case 1: return '#ff4757';
      case 2: return '#ffa502';
      case 3: return '#3742fa';
      case 4:
      case 5: return '#2ed573';
      default: return '#ddd';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Calculate password strength for password field
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Clear field-specific errors when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters long';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = 'Password must contain at least one number';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const result = await signUp(formData);
    if (result.success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="auth-form-title">
        <span className="auth-icon">🐱</span>
        Join the Cat Family!
      </h2>
      <p className="auth-form-subtitle">Create your Cat E-Shop account</p>

      {error && (
        <div className="auth-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="signup-name" className="form-label">
          Full Name
        </label>
        <input
          type="text"
          id="signup-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`form-input ${formErrors.name ? 'error' : ''}`}
          placeholder="Enter your full name"
          disabled={loading}
          autoComplete="name"
        />
        {formErrors.name && (
          <span className="form-error">{formErrors.name}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="signup-email" className="form-label">
          Email Address
        </label>
        <input
          type="email"
          id="signup-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`form-input ${formErrors.email ? 'error' : ''}`}
          placeholder="Enter your email"
          disabled={loading}
          autoComplete="email"
        />
        {formErrors.email && (
          <span className="form-error">{formErrors.email}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="signup-password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="signup-password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`form-input ${formErrors.password ? 'error' : ''}`}
          placeholder="Create a strong password"
          disabled={loading}
          autoComplete="new-password"
        />
        {formData.password && (
          <div className="password-strength">
            <div className="strength-bar">
              <div
                className="strength-fill"
                style={{
                  width: `${(passwordStrength / 5) * 100}%`,
                  backgroundColor: getPasswordStrengthColor(passwordStrength)
                }}
              ></div>
            </div>
            <span 
              className="strength-text"
              style={{ color: getPasswordStrengthColor(passwordStrength) }}
            >
              {getPasswordStrengthText(passwordStrength)}
            </span>
          </div>
        )}
        {formErrors.password && (
          <span className="form-error">{formErrors.password}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="signup-confirm-password" className="form-label">
          Confirm Password
        </label>
        <input
          type="password"
          id="signup-confirm-password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={`form-input ${formErrors.confirmPassword ? 'error' : ''}`}
          placeholder="Confirm your password"
          disabled={loading}
          autoComplete="new-password"
        />
        {formErrors.confirmPassword && (
          <span className="form-error">{formErrors.confirmPassword}</span>
        )}
      </div>

      <button
        type="submit"
        className={`auth-submit-btn ${loading ? 'loading' : ''}`}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="loading-spinner"></span>
            Creating account...
          </>
        ) : (
          <>
            <span className="btn-icon">🎉</span>
            Create Account
          </>
        )}
      </button>

      <div className="auth-form-footer">
        <p>
          Already have an account?{' '}
          <button
            type="button"
            className="auth-link-btn"
            onClick={onSwitchToLogin}
            disabled={loading}
          >
            Sign in here
          </button>
        </p>
      </div>

      <div className="auth-demo-note">
        <p><strong>Demo Note:</strong> This is a demonstration. Your data is stored locally for the demo experience.</p>
      </div>
    </form>
  );
}

export default SignUpForm;