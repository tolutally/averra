import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { markStepViewed } from '../store/slices/stepSlice';
import { TelemetryService, trackEvent } from '../utils/telemetry';

// Hook for tracking step views
export const useStepTracking = (stepId, stepType, caseId) => {
  const hasTracked = useRef(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (stepId && !hasTracked.current) {
      // Mark as viewed in store
      dispatch(markStepViewed(stepId));
      
      // Track telemetry event
      trackEvent('step_viewed', {
        step_id: stepId,
        step_type: stepType,
        case_id: caseId,
      });
      
      hasTracked.current = true;
    }
  }, [stepId, stepType, caseId, dispatch]);
};

// Hook for tracking validation errors
export const useValidationTracking = () => {
  return (field, error, context = {}) => {
    trackEvent('validation_error', {
      field,
      error,
      ...context,
      timestamp: new Date().toISOString(),
    });
  };
};

// Hook for tracking file upload progress
export const useFileUploadTracking = () => {
  const trackUploadStart = (fileName, fileSize, fileType, stepId) => {
    trackEvent('file_upload_start', {
      file_name: fileName,
      file_size: fileSize,
      file_type: fileType,
      step_id: stepId,
    });
  };

  const trackUploadSuccess = (fileName, fileSize, fileType, stepId, uploadTime) => {
    trackEvent('file_upload_success', {
      file_name: fileName,
      file_size: fileSize,
      file_type: fileType,
      step_id: stepId,
      upload_time_ms: uploadTime,
    });
  };

  const trackUploadFail = (fileName, fileSize, fileType, stepId, error) => {
    trackEvent('file_upload_fail', {
      file_name: fileName,
      file_size: fileSize,
      file_type: fileType,
      step_id: stepId,
      error,
    });
  };

  return {
    trackUploadStart,
    trackUploadSuccess,
    trackUploadFail,
  };
};

// Hook for tracking nudge interactions
export const useNudgeTracking = () => {
  return (nudgeId, caseId) => {
    trackEvent('nudge_sent_clicked', {
      nudge_id: nudgeId,
      case_id: caseId,
    });
  };
};

// Hook for tracking case completion
export const useCaseTracking = () => {
  const trackCaseCompleted = (caseId, completionTime, stepCount) => {
    trackEvent('case_completed', {
      case_id: caseId,
      completion_time: completionTime,
      step_count: stepCount,
    });
  };

  const trackRevisionRequested = (stepId, reason, caseId) => {
    trackEvent('revision_requested', {
      step_id: stepId,
      reason,
      case_id: caseId,
    });
  };

  return {
    trackCaseCompleted,
    trackRevisionRequested,
  };
};

// Hook for tracking export operations
export const useExportTracking = () => {
  const trackExportStarted = (exportType, filters = {}) => {
    trackEvent('export_started', {
      export_type: exportType,
      filters: JSON.stringify(filters),
    });
  };

  const trackExportSuccess = (exportType, recordCount, exportTime) => {
    trackEvent('export_success', {
      export_type: exportType,
      record_count: recordCount,
      export_time_ms: exportTime,
    });
  };

  const trackExportFail = (exportType, error) => {
    trackEvent('export_fail', {
      export_type: exportType,
      error,
    });
  };

  return {
    trackExportStarted,
    trackExportSuccess,
    trackExportFail,
  };
};

// Combined hook for all telemetry tracking
export const useTelemetry = () => {
  const validationTracking = useValidationTracking();
  const fileUploadTracking = useFileUploadTracking();
  const nudgeTracking = useNudgeTracking();
  const caseTracking = useCaseTracking();
  const exportTracking = useExportTracking();

  const trackCustomEvent = (eventName, properties = {}) => {
    trackEvent(eventName, properties);
  };

  return {
    trackValidationError: validationTracking,
    ...fileUploadTracking,
    trackNudgeClicked: nudgeTracking,
    ...caseTracking,
    ...exportTracking,
    trackCustomEvent,
  };
};

// HOC for automatic step tracking
export const withStepTracking = (WrappedComponent) => {
  return (props) => {
    const { stepId, stepType, caseId } = props;
    useStepTracking(stepId, stepType, caseId);
    return <WrappedComponent {...props} />;
  };
};
