import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchStep = createAsyncThunk(
  'step/fetchStep',
  async ({ token, stepId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/steps/${stepId}?token=${token}`);
      if (!response.ok) throw new Error('Failed to fetch step');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitStep = createAsyncThunk(
  'step/submitStep',
  async ({ stepId, token, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/steps/${stepId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, data }),
      });
      if (!response.ok) throw new Error('Failed to submit step');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const requestRevision = createAsyncThunk(
  'step/requestRevision',
  async ({ stepId, token, reason }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/steps/${stepId}/revision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, reason }),
      });
      if (!response.ok) throw new Error('Failed to request revision');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const saveDraft = createAsyncThunk(
  'step/saveDraft',
  async ({ stepId, token, data }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/steps/${stepId}/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, data }),
      });
      if (!response.ok) throw new Error('Failed to save draft');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  currentStep: null,
  steps: [],
  loading: false,
  error: null,
  validationErrors: {},
  draftData: {},
  optimisticUpdates: {},
  stepProgress: {
    currentStepIndex: 0,
    totalSteps: 0,
    completedSteps: [],
  },
};

const stepSlice = createSlice({
  name: 'step',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setValidationError: (state, action) => {
      const { field, error } = action.payload;
      state.validationErrors[field] = error;
    },
    clearValidationError: (state, action) => {
      const field = action.payload;
      delete state.validationErrors[field];
    },
    clearAllValidationErrors: (state) => {
      state.validationErrors = {};
    },
    updateDraft: (state, action) => {
      const { stepId, data } = action.payload;
      state.draftData[stepId] = {
        ...state.draftData[stepId],
        ...data,
      };
    },
    clearDraft: (state, action) => {
      const stepId = action.payload;
      delete state.draftData[stepId];
    },
    addOptimisticUpdate: (state, action) => {
      const { stepId, update } = action.payload;
      state.optimisticUpdates[stepId] = {
        ...state.optimisticUpdates[stepId],
        ...update,
      };
    },
    removeOptimisticUpdate: (state, action) => {
      const { stepId, key } = action.payload;
      if (state.optimisticUpdates[stepId]) {
        delete state.optimisticUpdates[stepId][key];
        if (Object.keys(state.optimisticUpdates[stepId]).length === 0) {
          delete state.optimisticUpdates[stepId];
        }
      }
    },
    updateStepProgress: (state, action) => {
      state.stepProgress = { ...state.stepProgress, ...action.payload };
    },
    markStepViewed: (state, action) => {
      const stepId = action.payload;
      if (state.currentStep && state.currentStep.id === stepId) {
        state.currentStep.viewed = true;
        state.currentStep.viewedAt = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch step
      .addCase(fetchStep.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStep.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStep = action.payload;
        // Update in steps array if exists
        const stepIndex = state.steps.findIndex(s => s.id === action.payload.id);
        if (stepIndex !== -1) {
          state.steps[stepIndex] = action.payload;
        } else {
          state.steps.push(action.payload);
        }
      })
      .addCase(fetchStep.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit step
      .addCase(submitStep.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitStep.fulfilled, (state, action) => {
        state.loading = false;
        const stepIndex = state.steps.findIndex(s => s.id === action.payload.id);
        if (stepIndex !== -1) {
          state.steps[stepIndex] = action.payload;
        }
        if (state.currentStep && state.currentStep.id === action.payload.id) {
          state.currentStep = action.payload;
        }
        // Clear draft and optimistic updates
        delete state.draftData[action.payload.id];
        delete state.optimisticUpdates[action.payload.id];
      })
      .addCase(submitStep.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Request revision
      .addCase(requestRevision.fulfilled, (state, action) => {
        const stepIndex = state.steps.findIndex(s => s.id === action.payload.id);
        if (stepIndex !== -1) {
          state.steps[stepIndex] = action.payload;
        }
        if (state.currentStep && state.currentStep.id === action.payload.id) {
          state.currentStep = action.payload;
        }
      })
      // Save draft
      .addCase(saveDraft.fulfilled, (state, action) => {
        const { stepId } = action.meta.arg;
        state.draftData[stepId] = {
          ...state.draftData[stepId],
          lastSaved: new Date().toISOString(),
        };
      });
  },
});

export const {
  clearError,
  setValidationError,
  clearValidationError,
  clearAllValidationErrors,
  updateDraft,
  clearDraft,
  addOptimisticUpdate,
  removeOptimisticUpdate,
  updateStepProgress,
  markStepViewed,
} = stepSlice.actions;

export default stepSlice.reducer;
