import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showToast, setFeatureFlag } from '../../store/slices/uiSlice';
import { useFeatureFlags } from '../../utils/featureFlags.jsx';
import { useTelemetry } from '../../hooks/useTelemetry.jsx';
import LoadingState from '../ui/LoadingState';
import EmptyState, { NoCasesEmpty } from '../ui/EmptyState';
import { FeatureFlag } from '../../utils/featureFlags.jsx';
import Icon from '../AppIcon';

const Sprint0Demo = () => {
  const dispatch = useDispatch();
  const { flags } = useFeatureFlags();
  const { trackCustomEvent, trackValidationError } = useTelemetry();
  const [loading, setLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [completedActions, setCompletedActions] = useState(new Set());

  const markActionCompleted = (action) => {
    setCompletedActions(prev => new Set([...prev, action]));
  };

  const handleToastDemo = (type) => {
    dispatch(showToast({
      message: `This is a ${type} toast message!`,
      type,
      duration: 5000,
    }));
    trackCustomEvent('toast_demo', { type });
    markActionCompleted(`toast_${type}`);
  };

  const handleValidationDemo = () => {
    trackValidationError('email', 'Invalid email format', { 
      component: 'Sprint0Demo' 
    });
    dispatch(showToast({
      message: 'Validation error tracked! Check console for telemetry.',
      type: 'warning',
    }));
    markActionCompleted('validation_error');
  };

  const handleFeatureFlagToggle = (flag) => {
    dispatch(setFeatureFlag({ flag, value: !flags[flag] }));
    trackCustomEvent('feature_flag_toggled', { flag, new_value: !flags[flag] });
    markActionCompleted(`flag_${flag}`);
  };

  const handleLoadingDemo = () => {
    setLoading(true);
    trackCustomEvent('loading_demo_started');
    setTimeout(() => {
      setLoading(false);
      trackCustomEvent('loading_demo_completed');
      markActionCompleted('loading_demo');
    }, 3000);
  };

  if (loading) {
    return <LoadingState message="Loading Sprint 0 demo..." />;
  }

  if (showEmpty) {
    return (
      <div className="p-6">
        <button
          onClick={() => setShowEmpty(false)}
          className="mb-4 bg-gray-500 text-white px-4 py-2 rounded"
        >
          Back to Demo
        </button>
        <NoCasesEmpty onCreateCase={() => setShowEmpty(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Icon name="Rocket" size={16} className="mr-2" />
              Sprint 0 Foundation
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Vouchline Demo
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Experience the foundational features powering modern case management workflows
            </p>
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center space-x-6 text-white">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{completedActions.size}</div>
                    <div className="text-sm text-blue-200">Actions Completed</div>
                  </div>
                  <div className="h-8 w-px bg-white/30"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-sm text-blue-200">Features Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Analytics & Tracking */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Icon name="BarChart3" size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-white">Analytics & Tracking</h2>
                  <p className="text-blue-100 text-sm">Monitor user behavior and system performance</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <button
                  onClick={handleValidationDemo}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    completedActions.has('validation_error') 
                      ? 'border-green-200 bg-green-50 text-green-700' 
                      : 'border-red-200 bg-red-50 hover:bg-red-100 text-red-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon name="AlertTriangle" size={20} className="mr-3" />
                    <span className="font-medium">Track Validation Error</span>
                  </div>
                  {completedActions.has('validation_error') && (
                    <Icon name="CheckCircle" size={20} className="text-green-600" />
                  )}
                </button>
                <button
                  onClick={() => {
                    trackCustomEvent('button_clicked', { button: 'custom_event' });
                    markActionCompleted('custom_event');
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    completedActions.has('custom_event') 
                      ? 'border-green-200 bg-green-50 text-green-700' 
                      : 'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon name="Activity" size={20} className="mr-3" />
                    <span className="font-medium">Track Custom Event</span>
                  </div>
                  {completedActions.has('custom_event') && (
                    <Icon name="CheckCircle" size={20} className="text-green-600" />
                  )}
                </button>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Events are logged to console and sent to analytics in production
                </p>
              </div>
            </div>
          </div>

          {/* Smart Notifications */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Icon name="Bell" size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-white">Smart Notifications</h2>
                  <p className="text-emerald-100 text-sm">Real-time alerts and status updates</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-3">
                {['success', 'error', 'warning', 'info'].map(type => (
                  <button
                    key={type}
                    onClick={() => handleToastDemo(type)}
                    className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all ${
                      completedActions.has(`toast_${type}`)
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : type === 'success' ? 'border-green-200 bg-green-50 hover:bg-green-100 text-green-700' :
                          type === 'error' ? 'border-red-200 bg-red-50 hover:bg-red-100 text-red-700' :
                          type === 'warning' ? 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100 text-yellow-700' :
                          'border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700'
                    }`}
                  >
                    <div className="text-center">
                      {completedActions.has(`toast_${type}`) ? (
                        <Icon name="CheckCircle" size={20} className="mx-auto mb-1" />
                      ) : (
                        <Icon name={type === 'success' ? 'CheckCircle' : type === 'error' ? 'XCircle' : type === 'warning' ? 'AlertTriangle' : 'Info'} size={20} className="mx-auto mb-1" />
                      )}
                      <span className="text-sm font-medium capitalize">{type}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Feature Controls */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Icon name="Flag" size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-white">Feature Controls</h2>
                  <p className="text-purple-100 text-sm">Toggle features and system behaviors</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {Object.entries(flags).map(([flag, enabled]) => (
                  <div key={flag} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={() => handleFeatureFlagToggle(flag)}
                          className="sr-only"
                        />
                        <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          enabled ? 'bg-purple-600' : 'bg-gray-300'
                        }`}>
                          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            enabled ? 'translate-x-6' : 'translate-x-1'
                          }`} />
                        </div>
                        <span className="ml-3 text-sm font-medium text-gray-900">{flag}</span>
                      </label>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {enabled ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>

              <FeatureFlag flag="strictMode" fallback={null}>
                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-center">
                    <Icon name="Shield" size={20} className="text-yellow-600 mr-2" />
                    <p className="text-yellow-800 font-medium">Strict Mode Active</p>
                  </div>
                  <p className="text-yellow-700 text-sm mt-1">Enhanced security features are enabled.</p>
                </div>
              </FeatureFlag>
            </div>
          </div>

          {/* System States */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Icon name="Settings" size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-white">System States</h2>
                  <p className="text-orange-100 text-sm">Loading, error, and empty state demos</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <button
                  onClick={handleLoadingDemo}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    completedActions.has('loading_demo') 
                      ? 'border-green-200 bg-green-50 text-green-700' 
                      : 'border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon name="Loader2" size={20} className="mr-3" />
                    <span className="font-medium">Show Loading State</span>
                  </div>
                  {completedActions.has('loading_demo') && (
                    <Icon name="CheckCircle" size={20} className="text-green-600" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowEmpty(true);
                    markActionCompleted('empty_state');
                  }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    completedActions.has('empty_state') 
                      ? 'border-green-200 bg-green-50 text-green-700' 
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon name="FileX" size={20} className="mr-3" />
                    <span className="font-medium">Show Empty State</span>
                  </div>
                  {completedActions.has('empty_state') && (
                    <Icon name="CheckCircle" size={20} className="text-green-600" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Routes Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-600 to-slate-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Icon name="Shield" size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-white">Security & Route Guards</h2>
                  <p className="text-slate-200 text-sm">Test authentication and access control</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="/steps/valid-token"
                className="block p-4 bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors group"
              >
                <div className="flex items-center mb-2">
                  <Icon name="CheckCircle" size={20} className="text-green-600 mr-2" />
                  <span className="font-medium text-green-800">Valid Token</span>
                </div>
                <p className="text-green-600 text-sm">Access granted scenario</p>
              </a>
              <a
                href="/steps/expired"
                className="block p-4 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors group"
              >
                <div className="flex items-center mb-2">
                  <Icon name="XCircle" size={20} className="text-red-600 mr-2" />
                  <span className="font-medium text-red-800">Expired Token</span>
                </div>
                <p className="text-red-600 text-sm">Token expiry handling</p>
              </a>
              <a
                href="/steps/otp-required"
                className="block p-4 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors group"
              >
                <div className="flex items-center mb-2">
                  <Icon name="Key" size={20} className="text-blue-600 mr-2" />
                  <span className="font-medium text-blue-800">OTP Required</span>
                </div>
                <p className="text-blue-600 text-sm">Two-factor authentication</p>
              </a>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Test OTP:</strong> Use <code className="bg-blue-100 px-1 rounded">123456</code> for testing scenarios
              </p>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Foundation Complete</h3>
              <p className="text-gray-600">Sprint 0 delivers the core infrastructure for modern case management</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">{Math.round((completedActions.size / 8) * 100)}%</div>
              <div className="text-sm text-gray-500">Demo Progress</div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Icon name="Zap" size={16} className="mr-2 text-indigo-600" />
                Core Infrastructure
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <Icon name="Check" size={14} className="mr-2 text-green-600" />
                  Enhanced routing with token guards
                </li>
                <li className="flex items-center">
                  <Icon name="Check" size={14} className="mr-2 text-green-600" />
                  Redux state management with domain stores
                </li>
                <li className="flex items-center">
                  <Icon name="Check" size={14} className="mr-2 text-green-600" />
                  Telemetry system with interaction tracking
                </li>
                <li className="flex items-center">
                  <Icon name="Check" size={14} className="mr-2 text-green-600" />
                  Optimistic update helpers for responsive UX
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Icon name="Layers" size={16} className="mr-2 text-indigo-600" />
                User Experience
              </h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center">
                  <Icon name="Check" size={14} className="mr-2 text-green-600" />
                  Error boundaries with telemetry integration
                </li>
                <li className="flex items-center">
                  <Icon name="Check" size={14} className="mr-2 text-green-600" />
                  Feature flags system with strict mode
                </li>
                <li className="flex items-center">
                  <Icon name="Check" size={14} className="mr-2 text-green-600" />
                  Loading, empty, and error state components
                </li>
                <li className="flex items-center">
                  <Icon name="Check" size={14} className="mr-2 text-green-600" />
                  Toast notification system
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sprint0Demo;
