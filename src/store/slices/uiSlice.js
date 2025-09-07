import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  error: null,
  toast: null,
  modal: null,
  sidebar: {
    isOpen: false,
    width: 300,
  },
  theme: 'light',
  featureFlags: {
    strictMode: false,
    otpRequired: false,
    fileScanning: true,
    realTimeUpdates: true,
    advancedFilters: false,
  },
  notifications: [],
  breadcrumbs: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    showToast: (state, action) => {
      state.toast = {
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
    },
    hideToast: (state) => {
      state.toast = null;
    },
    openModal: (state, action) => {
      state.modal = action.payload;
    },
    closeModal: (state) => {
      state.modal = null;
    },
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebar.isOpen = action.payload;
    },
    setSidebarWidth: (state, action) => {
      state.sidebar.width = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setFeatureFlag: (state, action) => {
      const { flag, value } = action.payload;
      state.featureFlags[flag] = value;
    },
    setFeatureFlags: (state, action) => {
      state.featureFlags = { ...state.featureFlags, ...action.payload };
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    removeNotification: (state, action) => {
      const notificationId = action.payload;
      state.notifications = state.notifications.filter(n => n.id !== notificationId);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    setBreadcrumbs: (state, action) => {
      state.breadcrumbs = action.payload;
    },
    addBreadcrumb: (state, action) => {
      state.breadcrumbs.push(action.payload);
    },
    removeBreadcrumb: (state, action) => {
      const index = action.payload;
      state.breadcrumbs = state.breadcrumbs.slice(0, index + 1);
    },
    clearBreadcrumbs: (state) => {
      state.breadcrumbs = [];
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  showToast,
  hideToast,
  openModal,
  closeModal,
  toggleSidebar,
  setSidebarOpen,
  setSidebarWidth,
  setTheme,
  setFeatureFlag,
  setFeatureFlags,
  addNotification,
  removeNotification,
  clearAllNotifications,
  setBreadcrumbs,
  addBreadcrumb,
  removeBreadcrumb,
  clearBreadcrumbs,
} = uiSlice.actions;

export default uiSlice.reducer;
