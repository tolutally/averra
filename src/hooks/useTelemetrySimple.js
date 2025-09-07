// Simple telemetry hook without circular dependencies
import { trackEvent } from '../utils/telemetry';

export const useTelemetry = () => {
  const trackCustomEvent = (eventName, properties = {}) => {
    trackEvent(eventName, properties);
  };

  const trackValidationError = (field, error, context = {}) => {
    trackEvent('validation_error', {
      field,
      error,
      ...context,
      timestamp: new Date().toISOString(),
    });
  };

  return {
    trackCustomEvent,
    trackValidationError,
  };
};
