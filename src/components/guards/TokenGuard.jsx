import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { validateToken, verifyOTP } from '../../store/slices/authSlice';
import { trackEvent } from '../../utils/telemetry';

const TokenGuard = ({ children, requireOTP = false }) => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const [tokenState, setTokenState] = useState({
    isValidating: true,
    isValid: false,
    requiresOTP: false,
    otpVerified: false,
    error: null
  });
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    if (token) {
      validateTokenAndSetState();
    } else {
      setTokenState(prev => ({ ...prev, isValidating: false, error: 'No token provided' }));
    }
  }, [token]);

  const validateTokenAndSetState = async () => {
    try {
      const result = await dispatch(validateToken({ token })).unwrap();
      
      setTokenState({
        isValidating: false,
        isValid: result.valid,
        requiresOTP: result.requiresOTP || requireOTP,
        otpVerified: !result.requiresOTP && !requireOTP,
        error: result.valid ? null : result.error
      });

      // Track token validation
      trackEvent('token_validation', {
        valid: result.valid,
        requires_otp: result.requiresOTP || requireOTP,
        error: result.error
      });

      if (!result.valid) {
        trackEvent('validation_error', {
          type: 'token',
          error: result.error
        });
      }
    } catch (error) {
      setTokenState({
        isValidating: false,
        isValid: false,
        requiresOTP: false,
        otpVerified: false,
        error: error.message
      });

      trackEvent('validation_error', {
        type: 'token',
        error: error.message
      });
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');

    try {
      const result = await dispatch(verifyOTP({ token, otp })).unwrap();
      
      if (result.verified) {
        setTokenState(prev => ({ ...prev, otpVerified: true }));
        trackEvent('otp_verification', { success: true });
      } else {
        setOtpError(result.error || 'Invalid OTP');
        trackEvent('validation_error', {
          type: 'otp',
          error: result.error
        });
      }
    } catch (error) {
      setOtpError(error.message);
      trackEvent('validation_error', {
        type: 'otp',
        error: error.message
      });
    }
  };

  const requestNewLink = () => {
    trackEvent('new_link_requested', { expired_token: token });
    // Logic to request new link
  };

  // Loading state
  if (tokenState.isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Validating access...</p>
        </div>
      </div>
    );
  }

  // Invalid token state
  if (!tokenState.isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 max-w-md">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-red-800 mb-2">Link Expired or Invalid</h1>
          <p className="text-red-600 mb-6">{tokenState.error}</p>
          <button
            onClick={requestNewLink}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  // OTP verification required
  if (tokenState.requiresOTP && !tokenState.otpVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Verify Your Identity</h1>
            <p className="text-gray-600">Please enter the verification code sent to your email</p>
          </div>
          
          <form onSubmit={handleOTPSubmit} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter 6-digit code"
                maxLength={6}
                required
              />
              {otpError && (
                <p className="mt-1 text-sm text-red-600">{otpError}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Verify
            </button>
          </form>
        </div>
      </div>
    );
  }

  // All validations passed, render children
  return children;
};

export default TokenGuard;
