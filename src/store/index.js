import { configureStore } from '@reduxjs/toolkit';
import caseSlice from './slices/caseSlice';
import stepSlice from './slices/stepSlice';
import reviewSlice from './slices/reviewSlice';
import uploadSlice from './slices/uploadSlice';
import nudgeSlice from './slices/nudgeSlice';
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';
import telemetryMiddleware from './middleware/telemetryMiddleware';

export const store = configureStore({
  reducer: {
    case: caseSlice,
    step: stepSlice,
    review: reviewSlice,
    upload: uploadSlice,
    nudge: nudgeSlice,
    auth: authSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(telemetryMiddleware),
});

// Export for use in React components
export default store;
