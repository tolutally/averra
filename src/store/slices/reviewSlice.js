import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  reviews: [],
  currentReview: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    assignee: 'all',
    dateRange: null,
  },
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentReview: (state, action) => {
      state.currentReview = action.payload;
    },
    addReview: (state, action) => {
      state.reviews.push(action.payload);
    },
    updateReview: (state, action) => {
      const { reviewId, updates } = action.payload;
      const reviewIndex = state.reviews.findIndex(r => r.id === reviewId);
      if (reviewIndex !== -1) {
        state.reviews[reviewIndex] = { ...state.reviews[reviewIndex], ...updates };
      }
      if (state.currentReview && state.currentReview.id === reviewId) {
        state.currentReview = { ...state.currentReview, ...updates };
      }
    },
    removeReview: (state, action) => {
      const reviewId = action.payload;
      state.reviews = state.reviews.filter(r => r.id !== reviewId);
      if (state.currentReview && state.currentReview.id === reviewId) {
        state.currentReview = null;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  clearError,
  setCurrentReview,
  addReview,
  updateReview,
  removeReview,
  setFilters,
  clearFilters,
} = reviewSlice.actions;

export default reviewSlice.reducer;
