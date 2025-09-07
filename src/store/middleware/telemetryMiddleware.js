// Telemetry middleware to track all redux actions and state changes
const telemetryMiddleware = (store) => (next) => (action) => {
  const beforeState = store.getState();
  const result = next(action);
  const afterState = store.getState();

  // Track specific actions that we care about
  const trackedActions = [
    'step/markStepViewed',
    'step/setValidationError', 
    'upload/uploadFile/pending',
    'upload/uploadFile/fulfilled',
    'upload/uploadFile/rejected',
    'nudge/markNudgeClicked',
    'step/requestRevision',
    'case/completeCase/fulfilled',
    'export/exportData/pending',
    'export/exportData/fulfilled',
    'export/exportData/rejected',
  ];

  if (trackedActions.some(tracked => action.type.includes(tracked.split('/')[1]))) {
    // Map redux actions to telemetry events
    const eventMap = {
      'markStepViewed': 'step_viewed',
      'setValidationError': 'validation_error',
      'uploadFile/pending': 'file_upload_start',
      'uploadFile/fulfilled': 'file_upload_success',
      'uploadFile/rejected': 'file_upload_fail',
      'markNudgeClicked': 'nudge_sent_clicked',
      'requestRevision': 'revision_requested',
      'completeCase/fulfilled': 'case_completed',
      'exportData/pending': 'export_started',
      'exportData/fulfilled': 'export_success',
      'exportData/rejected': 'export_fail',
    };

    const eventType = Object.keys(eventMap).find(key => action.type.includes(key));
    if (eventType) {
      const eventName = eventMap[eventType];
      
      // Extract relevant data from action payload
      let eventData = {
        timestamp: new Date().toISOString(),
        action_type: action.type,
        user_id: beforeState.auth?.user?.id || 'anonymous',
        session_id: beforeState.auth?.sessionId || 'unknown',
      };

      // Add specific data based on event type
      switch (eventName) {
        case 'step_viewed':
          eventData = {
            ...eventData,
            step_id: action.payload,
            case_id: beforeState.step?.currentStep?.caseId,
          };
          break;
        case 'validation_error':
          eventData = {
            ...eventData,
            field: action.payload.field,
            error: action.payload.error,
            step_id: beforeState.step?.currentStep?.id,
          };
          break;
        case 'file_upload_start':
        case 'file_upload_success':
        case 'file_upload_fail':
          eventData = {
            ...eventData,
            file_name: action.meta?.arg?.file?.name,
            file_size: action.meta?.arg?.file?.size,
            file_type: action.meta?.arg?.file?.type,
            step_id: action.meta?.arg?.stepId,
          };
          if (eventName === 'file_upload_fail') {
            eventData.error = action.payload;
          }
          break;
        case 'nudge_sent_clicked':
          eventData = {
            ...eventData,
            nudge_id: action.payload.nudgeId,
            case_id: beforeState.case?.currentCase?.id,
          };
          break;
        case 'revision_requested':
          eventData = {
            ...eventData,
            step_id: action.meta?.arg?.stepId,
            reason: action.meta?.arg?.reason,
          };
          break;
        case 'case_completed':
          eventData = {
            ...eventData,
            case_id: action.payload.id,
            completion_time: action.payload.completedAt,
          };
          break;
        case 'export_started':
        case 'export_success':
        case 'export_fail':
          eventData = {
            ...eventData,
            export_type: action.meta?.arg?.type,
            filters: action.meta?.arg?.filters,
          };
          if (eventName === 'export_fail') {
            eventData.error = action.payload;
          }
          break;
      }

      // Send telemetry event
      window.telemetry?.track(eventName, eventData);
    }
  }

  return result;
};

export default telemetryMiddleware;
