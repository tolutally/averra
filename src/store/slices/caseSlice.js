import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const fetchCase = createAsyncThunk(
  'case/fetchCase',
  async (caseId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cases/${caseId}`);
      if (!response.ok) throw new Error('Failed to fetch case');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCase = createAsyncThunk(
  'case/createCase',
  async (caseData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(caseData),
      });
      if (!response.ok) throw new Error('Failed to create case');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCase = createAsyncThunk(
  'case/updateCase',
  async ({ caseId, updates }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cases/${caseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update case');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeCase = createAsyncThunk(
  'case/completeCase',
  async (caseId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/cases/${caseId}/complete`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to complete case');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  cases: [],
  currentCase: null,
  loading: false,
  error: null,
  optimisticUpdates: {},
};

const caseSlice = createSlice({
  name: 'case',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentCase: (state, action) => {
      state.currentCase = action.payload;
    },
    addOptimisticUpdate: (state, action) => {
      const { caseId, update } = action.payload;
      state.optimisticUpdates[caseId] = {
        ...state.optimisticUpdates[caseId],
        ...update,
      };
    },
    removeOptimisticUpdate: (state, action) => {
      const { caseId, key } = action.payload;
      if (state.optimisticUpdates[caseId]) {
        delete state.optimisticUpdates[caseId][key];
        if (Object.keys(state.optimisticUpdates[caseId]).length === 0) {
          delete state.optimisticUpdates[caseId];
        }
      }
    },
    updateCaseStatus: (state, action) => {
      const { caseId, status } = action.payload;
      const caseIndex = state.cases.findIndex(c => c.id === caseId);
      if (caseIndex !== -1) {
        state.cases[caseIndex].status = status;
      }
      if (state.currentCase && state.currentCase.id === caseId) {
        state.currentCase.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch case
      .addCase(fetchCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCase.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCase = action.payload;
        // Update in cases array if exists
        const caseIndex = state.cases.findIndex(c => c.id === action.payload.id);
        if (caseIndex !== -1) {
          state.cases[caseIndex] = action.payload;
        } else {
          state.cases.push(action.payload);
        }
      })
      .addCase(fetchCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create case
      .addCase(createCase.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCase.fulfilled, (state, action) => {
        state.loading = false;
        state.cases.push(action.payload);
        state.currentCase = action.payload;
      })
      .addCase(createCase.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update case
      .addCase(updateCase.fulfilled, (state, action) => {
        const caseIndex = state.cases.findIndex(c => c.id === action.payload.id);
        if (caseIndex !== -1) {
          state.cases[caseIndex] = action.payload;
        }
        if (state.currentCase && state.currentCase.id === action.payload.id) {
          state.currentCase = action.payload;
        }
        // Remove optimistic update
        delete state.optimisticUpdates[action.payload.id];
      })
      // Complete case
      .addCase(completeCase.fulfilled, (state, action) => {
        const caseIndex = state.cases.findIndex(c => c.id === action.payload.id);
        if (caseIndex !== -1) {
          state.cases[caseIndex] = action.payload;
        }
        if (state.currentCase && state.currentCase.id === action.payload.id) {
          state.currentCase = action.payload;
        }
      });
  },
});

export const {
  clearError,
  setCurrentCase,
  addOptimisticUpdate,
  removeOptimisticUpdate,
  updateCaseStatus,
} = caseSlice.actions;

export default caseSlice.reducer;
