// Telemetry utility for tracking events - DORMANT VERSION
class TelemetryService {
  constructor() {
    this.isEnabled = true;
    this.queue = [];
    this.sessionId = this.generateSessionId();
    this.userId = null;
    this.metadata = {};
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId) {
    this.userId = userId;
  }

  setMetadata(metadata) {
    this.metadata = { ...this.metadata, ...metadata };
  }

  track(eventName, properties = {}) {
    if (!this.isEnabled) return;

    const event = {
      event: eventName,
      properties: {
        ...properties,
        ...this.metadata,
        session_id: this.sessionId,
        user_id: this.userId,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        user_agent: navigator.userAgent,
        screen_resolution: `${window.screen.width}x${window.screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
      },
    };

    // Add to queue
    this.queue.push(event);

    // Send immediately in development, batch in production
    if (process.env.NODE_ENV === 'development') {
      this.flush();
    } else {
      // Batch send every 10 events or 30 seconds
      if (this.queue.length >= 10) {
        this.flush();
      } else if (!this.flushTimer) {
        this.flushTimer = setTimeout(() => {
          this.flush();
        }, 30000);
      }
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Telemetry Event:', eventName, properties);
    }
  }

  async flush() {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    try {
      // Use mock API in development
      if (process.env.NODE_ENV === 'development') {
        const { mockSendAnalytics } = await import('./mockApi');
        await mockSendAnalytics(events);
        // DORMANT: No actual API calls, all telemetry data stays local
        console.log('[TELEMETRY - DORMANT] Analytics events logged:', events);
        return;
      }
      
      // DORMANT: Production API calls disabled for frontend-only development
      console.log('[TELEMETRY - DORMANT] Production analytics disabled:', events);
      // await fetch('/api/analytics/events', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ events }),
      // });
    } catch (error) {
      console.error('Failed to send telemetry events:', error);
      // Re-queue events on failure
      this.queue.unshift(...events);
    }
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  // Specific tracking methods for common events
  trackPageView(pageName, properties = {}) {
    this.track('page_view', {
      page_name: pageName,
      ...properties,
    });
  }

  trackStepViewed(stepId, stepType, caseId) {
    this.track('step_viewed', {
      step_id: stepId,
      step_type: stepType,
      case_id: caseId,
    });
  }

  trackValidationError(field, error, context = {}) {
    this.track('validation_error', {
      field,
      error,
      ...context,
    });
  }

  trackFileUploadStart(fileName, fileSize, fileType, stepId) {
    this.track('file_upload_start', {
      file_name: fileName,
      file_size: fileSize,
      file_type: fileType,
      step_id: stepId,
    });
  }

  trackFileUploadSuccess(fileName, fileSize, fileType, stepId, uploadTime) {
    this.track('file_upload_success', {
      file_name: fileName,
      file_size: fileSize,
      file_type: fileType,
      step_id: stepId,
      upload_time_ms: uploadTime,
    });
  }

  trackFileUploadFail(fileName, fileSize, fileType, stepId, error) {
    this.track('file_upload_fail', {
      file_name: fileName,
      file_size: fileSize,
      file_type: fileType,
      step_id: stepId,
      error,
    });
  }

  trackNudgeClicked(nudgeId, caseId) {
    this.track('nudge_sent_clicked', {
      nudge_id: nudgeId,
      case_id: caseId,
    });
  }

  trackRevisionRequested(stepId, reason, caseId) {
    this.track('revision_requested', {
      step_id: stepId,
      reason,
      case_id: caseId,
    });
  }

  trackCaseCompleted(caseId, completionTime, stepCount) {
    this.track('case_completed', {
      case_id: caseId,
      completion_time: completionTime,
      step_count: stepCount,
    });
  }

  trackExportStarted(exportType, filters = {}) {
    this.track('export_started', {
      export_type: exportType,
      filters: JSON.stringify(filters),
    });
  }

  trackExportSuccess(exportType, recordCount, exportTime) {
    this.track('export_success', {
      export_type: exportType,
      record_count: recordCount,
      export_time_ms: exportTime,
    });
  }

  trackExportFail(exportType, error) {
    this.track('export_fail', {
      export_type: exportType,
      error,
    });
  }
}

// Create singleton instance
const telemetry = new TelemetryService();

// Initialize telemetry
if (typeof window !== 'undefined') {
  window.telemetry = telemetry;
  
  // Track page unload
  window.addEventListener('beforeunload', () => {
    telemetry.flush();
  });
}

// Export both the class and instance
export { TelemetryService };
export default telemetry;

// Helper function for components
export const trackEvent = (eventName, properties) => {
  if (typeof window !== 'undefined' && window.telemetry) {
    window.telemetry.track(eventName, properties);
  }
};
