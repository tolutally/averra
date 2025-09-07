import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const sendNudge = createAsyncThunk(
  'nudge/sendNudge',
  async ({ caseIds, message, cadence }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/nudges/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseIds, message, cadence }),
      });

      if (!response.ok) {
        throw new Error('Failed to send nudge');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const scheduleNudge = createAsyncThunk(
  'nudge/scheduleNudge',
  async ({ caseIds, message, scheduledAt, cadence }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/nudges/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseIds, message, scheduledAt, cadence }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule nudge');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelNudge = createAsyncThunk(
  'nudge/cancelNudge',
  async (nudgeId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/nudges/${nudgeId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel nudge');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  nudges: [],
  scheduledNudges: [],
  nudgeHistory: [],
  loading: false,
  error: null,
  defaultCadence: 48, // hours
  defaultMessage: 'Reminder: Please complete your pending documents.',
};

const nudgeSlice = createSlice({
  name: 'nudge',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    addNudge: (state, action) => {
      state.nudges.push(action.payload);
    },
    updateNudge: (state, action) => {
      const { nudgeId, updates } = action.payload;
      const nudgeIndex = state.nudges.findIndex(n => n.id === nudgeId);
      if (nudgeIndex !== -1) {
        state.nudges[nudgeIndex] = { ...state.nudges[nudgeIndex], ...updates };
      }
    },
    removeNudge: (state, action) => {
      const nudgeId = action.payload;
      state.nudges = state.nudges.filter(n => n.id !== nudgeId);
    },
    addScheduledNudge: (state, action) => {
      state.scheduledNudges.push(action.payload);
    },
    removeScheduledNudge: (state, action) => {
      const nudgeId = action.payload;
      state.scheduledNudges = state.scheduledNudges.filter(n => n.id !== nudgeId);
    },
    addToHistory: (state, action) => {
      state.nudgeHistory.unshift(action.payload);
    },
    setDefaultCadence: (state, action) => {
      state.defaultCadence = action.payload;
    },
    setDefaultMessage: (state, action) => {
      state.defaultMessage = action.payload;
    },
    markNudgeClicked: (state, action) => {
      const { nudgeId, clickedAt } = action.payload;
      const nudgeIndex = state.nudges.findIndex(n => n.id === nudgeId);
      if (nudgeIndex !== -1) {
        state.nudges[nudgeIndex].clickedAt = clickedAt;
        state.nudges[nudgeIndex].clicked = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Send nudge
      .addCase(sendNudge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendNudge.fulfilled, (state, action) => {
        state.loading = false;
        const nudge = action.payload;
        state.nudges.push(nudge);
        state.nudgeHistory.unshift({
          ...nudge,
          sentAt: new Date().toISOString(),
          status: 'sent',
        });
      })
      .addCase(sendNudge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Schedule nudge
      .addCase(scheduleNudge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(scheduleNudge.fulfilled, (state, action) => {
        state.loading = false;
        const nudge = action.payload;
        state.scheduledNudges.push(nudge);
      })
      .addCase(scheduleNudge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel nudge
      .addCase(cancelNudge.fulfilled, (state, action) => {
        const nudgeId = action.payload.id;
        state.scheduledNudges = state.scheduledNudges.filter(n => n.id !== nudgeId);
        state.nudgeHistory.unshift({
          ...action.payload,
          cancelledAt: new Date().toISOString(),
          status: 'cancelled',
        });
      });
  },
});

export const {
  clearError,
  addNudge,
  updateNudge,
  removeNudge,
  addScheduledNudge,
  removeScheduledNudge,
  addToHistory,
  setDefaultCadence,
  setDefaultMessage,
  markNudgeClicked,
} = nudgeSlice.actions;

export default nudgeSlice.reducer;
