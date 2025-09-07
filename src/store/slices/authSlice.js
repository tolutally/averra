import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { mockValidateToken, mockVerifyOTP } from '../../utils/mockApi';

// Async thunks - DORMANT API CALLS
export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async ({ token }, { rejectWithValue }) => {
    try {
      // DORMANT: Always use mock API (no backend calls)
      console.log('[AUTH - DORMANT] Token validation:', token);
      const data = await mockValidateToken(token);
      return data;
      
      // DORMANT: Real API call disabled for frontend-only development
      // const response = await fetch(`/api/auth/validate-token`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ token }),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('Token validation failed');
      // }
      //
      // const data = await response.json();
      // return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ token, otp }, { rejectWithValue }) => {
    try {
      // DORMANT: Always use mock API (no backend calls)
      console.log('[AUTH - DORMANT] OTP verification:', { token, otp });
      const data = await mockVerifyOTP(token, otp);
      return data;
      
      // DORMANT: Real API call disabled for frontend-only development  
      // const response = await fetch(`/api/auth/verify-otp`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ token, otp }),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('OTP verification failed');
      // }
      //
      // const data = await response.json();
      // return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  tokenValidation: {
    isValid: false,
    requiresOTP: false,
    loading: false,
    error: null,
  },
  otpVerification: {
    verified: false,
    loading: false,
    error: null,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.tokenValidation.error = null;
      state.otpVerification.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.tokenValidation = initialState.tokenValidation;
      state.otpVerification = initialState.otpVerification;
    },
  },
  extraReducers: (builder) => {
    builder
      // Token validation
      .addCase(validateToken.pending, (state) => {
        state.tokenValidation.loading = true;
        state.tokenValidation.error = null;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.tokenValidation.loading = false;
        state.tokenValidation.isValid = action.payload.valid;
        state.tokenValidation.requiresOTP = action.payload.requiresOTP;
        state.token = action.payload.valid ? action.meta.arg.token : null;
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.tokenValidation.loading = false;
        state.tokenValidation.error = action.payload;
        state.tokenValidation.isValid = false;
      })
      // OTP verification
      .addCase(verifyOTP.pending, (state) => {
        state.otpVerification.loading = true;
        state.otpVerification.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.otpVerification.loading = false;
        state.otpVerification.verified = action.payload.verified;
        state.isAuthenticated = action.payload.verified;
        state.user = action.payload.user || null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.otpVerification.loading = false;
        state.otpVerification.error = action.payload;
        state.otpVerification.verified = false;
      });
  },
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
