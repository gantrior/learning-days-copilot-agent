import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

function LoginForm({ onSuccess, onSwitchToSignUp }) {
  const { signIn, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
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
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
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

    const result = await signIn(formData);
    if (result.success && onSuccess) {
      onSuccess();
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2 className="auth-form-title">
        <span className="auth-icon">🐱</span>
        Welcome Back!
      </h2>
      <p className="auth-form-subtitle">Sign in to your Cat E-Shop account</p>

      {error && (
        <div className="auth-error">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="login-email" className="form-label">
          Email Address
        </label>
        <input
          type="email"
          id="login-email"
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
        <label htmlFor="login-password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="login-password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`form-input ${formErrors.password ? 'error' : ''}`}
          placeholder="Enter your password"
          disabled={loading}
          autoComplete="current-password"
        />
        {formErrors.password && (
          <span className="form-error">{formErrors.password}</span>
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
            Signing in...
          </>
        ) : (
          <>
            <span className="btn-icon">🔑</span>
            Sign In
          </>
        )}
      </button>

      <div className="auth-form-footer">
        <p>
          Don't have an account?{' '}
          <button
            type="button"
            className="auth-link-btn"
            onClick={onSwitchToSignUp}
            disabled={loading}
          >
            Sign up here
          </button>
        </p>
      </div>

      <div className="auth-demo-note">
        <p><strong>Demo Note:</strong> This is a demonstration. Use any email and password to sign in!</p>
      </div>
    </form>
  );
}

export default LoginForm;