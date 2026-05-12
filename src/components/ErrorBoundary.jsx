import React from "react";
import Icon from "./AppIcon";
import { trackEvent } from "../utils/telemetry";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      eventId: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    error.__ErrorBoundary = true;
    window.__COMPONENT_ERROR__?.(error, errorInfo);
    
    // Generate unique error ID for tracking
    const eventId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Track error with telemetry
    trackEvent('error_boundary_triggered', {
      error_message: error.message,
      error_stack: error.stack,
      component_stack: errorInfo.componentStack,
      event_id: eventId,
      url: window.location.href,
      user_agent: navigator.userAgent,
    });

    this.setState({ 
      error, 
      errorInfo,
      eventId
    });

    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleRetry = () => {
    // Track retry attempt
    trackEvent('error_boundary_retry', {
      event_id: this.state.eventId,
    });

    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      eventId: null
    });
  };

  handleReportBug = () => {
    // Track bug report
    trackEvent('error_boundary_report_bug', {
      event_id: this.state.eventId,
    });

    // Create bug report with error details
    const bugReport = {
      eventId: this.state.eventId,
      error: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    // Send to support or copy to clipboard
    navigator.clipboard?.writeText(JSON.stringify(bugReport, null, 2));
    
    // Could also open email client or support form
    window.open(`mailto:support@averra.com?subject=Error Report ${this.state.eventId}&body=${encodeURIComponent(JSON.stringify(bugReport, null, 2))}`);
  };

  render() {
    if (this.state?.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="text-center p-8 max-w-lg">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-red-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 text-center mb-6">
              <h1 className="text-2xl font-semibold text-red-800">Something went wrong</h1>
              <p className="text-red-600 text-base">
                We encountered an unexpected error while processing your request.
              </p>
              {this.state.eventId && (
                <p className="text-sm text-red-500">
                  Error ID: {this.state.eventId}
                </p>
              )}
            </div>
            
            <div className="flex justify-center items-center gap-3">
              <button
                onClick={this.handleRetry}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2 transition-colors duration-200 shadow-sm"
              >
                <Icon name="RotateCcw" size={16} color="#fff" />
                Try Again
              </button>
              
              <button
                onClick={() => window.location.href = "/"}
                className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2 transition-colors duration-200 shadow-sm"
              >
                <Icon name="Home" size={16} color="#fff" />
                Go Home
              </button>
              
              <button
                onClick={this.handleReportBug}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2 transition-colors duration-200 shadow-sm"
              >
                <Icon name="Bug" size={16} color="#fff" />
                Report Bug
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                  Show Error Details (Development)
                </summary>
                <div className="mt-2 p-4 bg-red-100 rounded text-xs font-mono text-red-800 overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.message}
                  </div>
                  <div className="mb-2">
                    <strong>Stack:</strong>
                    <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props?.children;
  }
}

export default ErrorBoundary;