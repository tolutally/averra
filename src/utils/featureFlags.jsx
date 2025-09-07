import React from 'react';
import { useSelector } from 'react-redux';

// Feature flags hook
export const useFeatureFlags = () => {
  const featureFlags = useSelector(state => state.ui.featureFlags);

  const isEnabled = (flagName) => {
    return featureFlags[flagName] || false;
  };

  const isStrictModeEnabled = () => {
    return featureFlags.strictMode || false;
  };

  const isOTPRequired = () => {
    return featureFlags.otpRequired || false;
  };

  const isFileScanningEnabled = () => {
    return featureFlags.fileScanning || true;
  };

  const isRealTimeUpdatesEnabled = () => {
    return featureFlags.realTimeUpdates || true;
  };

  const isAdvancedFiltersEnabled = () => {
    return featureFlags.advancedFilters || false;
  };

  return {
    isEnabled,
    isStrictModeEnabled,
    isOTPRequired,
    isFileScanningEnabled,
    isRealTimeUpdatesEnabled,
    isAdvancedFiltersEnabled,
    flags: featureFlags,
  };
};

// HOC for feature flag conditional rendering
export const withFeatureFlag = (flagName, fallbackComponent = null) => {
  return (WrappedComponent) => {
    return (props) => {
      const { isEnabled } = useFeatureFlags();
      
      if (!isEnabled(flagName)) {
        return fallbackComponent;
      }
      
      return <WrappedComponent {...props} />;
    };
  };
};

// Component for conditional rendering based on feature flags
export const FeatureFlag = ({ flag, children, fallback = null }) => {
  const { isEnabled } = useFeatureFlags();
  
  if (!isEnabled(flag)) {
    return fallback;
  }
  
  return children;
};

// Strict mode guards for sensitive operations
export const useStrictModeGuards = () => {
  const { isStrictModeEnabled, isOTPRequired } = useFeatureFlags();

  const requiresStrictMode = () => isStrictModeEnabled();
  const requiresOTP = () => isOTPRequired() || isStrictModeEnabled();
  
  const getTokenTTL = () => {
    // Shorter TTL in strict mode
    return isStrictModeEnabled() ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000; // 1 day vs 7 days
  };

  const allowEmailAttachments = () => {
    // Block email attachments in strict mode
    return !isStrictModeEnabled();
  };

  const getRetentionPeriod = () => {
    // Shorter retention in strict mode
    return isStrictModeEnabled() ? 30 : 365; // 30 days vs 1 year
  };

  return {
    requiresStrictMode,
    requiresOTP,
    getTokenTTL,
    allowEmailAttachments,
    getRetentionPeriod,
  };
};
