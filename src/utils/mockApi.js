// Mock API endpoints for development - ALL DORMANT (no network calls)
// Replace with actual API calls in production

// Mock token validation - DORMANT VERSION
export const mockValidateToken = async (token) => {
  // DORMANT: No actual API call, just return dummy data immediately
  console.log('[MOCK API - DORMANT] Token validation:', token);
  
  // Mock validation logic with instant response
  if (token === 'expired' || token === 'invalid') {
    return {
      valid: false,
      error: token === 'expired' ? 'Token has expired' : 'Invalid token',
      requiresOTP: false,
    };
  }
  
  // Valid tokens
  const requiresOTP = token.includes('otp') || token.includes('secure');
  
  return {
    valid: true,
    requiresOTP,
    user: {
      id: 'user_123',
      email: 'user@company.com',
    },
  };
};

// Mock OTP verification - DORMANT VERSION
export const mockVerifyOTP = async (token, otp) => {
  // DORMANT: No actual API call, just return dummy data immediately
  console.log('[MOCK API - DORMANT] OTP verification:', { token, otp });
  
  // Mock OTP validation with instant response
  if (otp === '123456' || otp === '000000') {
    return {
      verified: true,
      user: {
        id: 'user_123',
        email: 'user@company.com',
        name: 'John Doe',
      },
    };
  }
  
  return {
    verified: false,
    error: 'Invalid verification code',
  };
};

// Mock analytics endpoint - DORMANT VERSION
export const mockSendAnalytics = async (events) => {
  // DORMANT: No actual API call, just log to console
  console.log('[MOCK API - DORMANT] Analytics Events:', events);
  
  // Always return success immediately
  return { success: true };
};
