import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const CoordinatorWorkspaceNav = ({ 
  isCollapsed = false,
  onToggleCollapse = null,
  userProfile = null 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [internalCollapsed, setInternalCollapsed] = useState(isCollapsed);

  // Use internal state if no external handler provided
  const collapsed = onToggleCollapse ? isCollapsed : internalCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalCollapsed(!internalCollapsed));

  const primaryNavItems = [
    {
      name: 'Dashboard',
      path: '/coordinator-dashboard',
      icon: 'LayoutDashboard',
      description: 'Case overview and monitoring'
    },
    {
      name: 'Review Cockpit',
      path: '/cases',
      icon: 'Eye',
      description: 'Review and manage cases'
    },
    {
      name: 'Cases',
      path: '/case-detail-audit-trail',
      icon: 'FileText',
      description: 'Individual case management'
    },
    {
      name: 'Templates',
      path: '/workflow-template-configuration',
      icon: 'Settings',
      description: 'Workflow configuration'
    }
  ];

  const secondaryNavItems = [
    {
      name: 'Settings',
      path: '/settings',
      icon: 'Cog',
      description: 'System configuration'
    },
    {
      name: 'Help',
      path: '/help',
      icon: 'HelpCircle',
      description: 'Documentation and support'
    }
  ];

  const isActivePath = (path) => {
    return location?.pathname === path || location?.pathname?.startsWith(path + '/');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setMoreMenuOpen(false);
  };

  return (
    <>
      {/* Left Sidebar Navigation - Hidden on mobile, fixed on desktop */}
      <aside className={`fixed top-0 left-0 z-50 h-full bg-action-900 text-white transition-all duration-300 hidden lg:block ${
        collapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-action-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-medium">V</span>
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-white truncate">VouchLine</h2>
                  <p className="text-sm text-action-300 truncate">Coordinator</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-6">
            <div className="space-y-2 px-3">
              {/* Dashboard */}
              <button
                onClick={() => handleNavigation('/coordinator-dashboard')}
                className={`flex items-center w-full px-3 py-3 rounded-lg text-sm transition-colors ${
                  isActivePath('/coordinator-dashboard')
                    ? 'bg-brand-600 text-white'
                    : 'text-action-300 hover:text-white hover:bg-brand-600/10'
                } ${collapsed ? 'justify-center' : 'space-x-3'}`}
                title={collapsed ? 'Dashboard' : ''}
              >
                <Icon name="LayoutDashboard" size={20} className="flex-shrink-0" />
                {!collapsed && <span>Dashboard</span>}
              </button>

              {/* Case Vault */}
              <button
                onClick={() => handleNavigation('/case-vault')}
                className={`flex items-center w-full px-3 py-3 rounded-lg text-sm transition-colors ${
                  isActivePath('/case-vault')
                    ? 'bg-brand-600 text-white'
                    : 'text-action-300 hover:text-white hover:bg-brand-600/10'
                } ${collapsed ? 'justify-center' : 'space-x-3'}`}
                title={collapsed ? 'Case Vault' : ''}
              >
                <Icon name="FolderOpen" size={20} className="flex-shrink-0" />
                {!collapsed && <span>Case Vault</span>}
              </button>

              {/* Review Cockpit */}
              <button
                onClick={() => handleNavigation('/cases')}
                className={`flex items-center w-full px-3 py-3 rounded-lg text-sm transition-colors ${
                  isActivePath('/cases')
                    ? 'bg-brand-600 text-white'
                    : 'text-action-300 hover:text-white hover:bg-brand-600/10'
                } ${collapsed ? 'justify-center' : 'space-x-3'}`}
                title={collapsed ? 'Review Cockpit' : ''}
              >
                <Icon name="Eye" size={20} className="flex-shrink-0" />
                {!collapsed && <span>Review Cockpit</span>}
              </button>

              {/* Quick Actions Divider */}
              {!collapsed && (
                <div className="border-t border-action-700 mx-3 my-4"></div>
              )}

              {/* Create Case */}
              <button
                onClick={() => handleNavigation('/case-creation')}
                className={`flex items-center w-full px-3 py-3 rounded-lg text-sm transition-colors bg-green-600 hover:bg-green-700 text-white ${
                  collapsed ? 'justify-center' : 'space-x-3'
                }`}
                title={collapsed ? 'Create Case' : ''}
              >
                <Icon name="Plus" size={20} className="flex-shrink-0" />
                {!collapsed && <span>Create Case</span>}
              </button>

              {/* Playbooks */}
              <button
                onClick={() => handleNavigation('/workflow-template-configuration')}
                className={`flex items-center w-full px-3 py-3 rounded-lg text-sm transition-colors ${
                  isActivePath('/workflow-template-configuration')
                    ? 'bg-brand-600 text-white'
                    : 'text-action-300 hover:text-white hover:bg-brand-600/10'
                } ${collapsed ? 'justify-center' : 'space-x-3'}`}
                title={collapsed ? 'Playbooks' : ''}
              >
                <Icon name="Building2" size={20} className="flex-shrink-0" />
                {!collapsed && <span>Playbooks</span>}
              </button>
            </div>
          </nav>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-action-700">
            <div className="space-y-2">
              {/* Account */}
              <button
                onClick={() => handleNavigation('/settings')}
                className={`flex items-center w-full px-3 py-3 rounded-lg text-sm text-action-300 hover:text-white hover:bg-brand-600/10 transition-colors ${
                  collapsed ? 'justify-center' : 'space-x-3'
                }`}
                title={collapsed ? 'Account' : ''}
              >
                <Icon name="User" size={20} className="flex-shrink-0" />
                {!collapsed && <span>Account</span>}
              </button>

              {/* Help */}
              <button
                onClick={() => handleNavigation('/help-support-center')}
                className={`flex items-center w-full px-3 py-3 rounded-lg text-sm text-action-300 hover:text-white hover:bg-brand-600/10 transition-colors ${
                  collapsed ? 'justify-center' : 'space-x-3'
                }`}
                title={collapsed ? 'Help' : ''}
              >
                <Icon name="HelpCircle" size={20} className="flex-shrink-0" />
                {!collapsed && <span>Help</span>}
              </button>

              {/* Sign out */}
              <button
                onClick={() => navigate('/login')}
                className={`flex items-center w-full px-3 py-3 rounded-lg text-sm text-action-300 hover:text-white hover:bg-brand-600/10 transition-colors ${
                  collapsed ? 'justify-center' : 'space-x-3'
                }`}
                title={collapsed ? 'Sign out' : ''}
              >
                <Icon name="LogOut" size={20} className="flex-shrink-0" />
                {!collapsed && <span>Sign out</span>}
              </button>

              {/* Collapse Toggle */}
              <button
                onClick={toggleCollapse}
                className={`flex items-center w-full px-3 py-2 rounded-lg text-sm text-action-400 hover:text-action-300 transition-colors ${
                  collapsed ? 'justify-center' : 'space-x-3'
                }`}
                title={collapsed ? (collapsed ? 'Expand' : 'Collapse') : ''}
              >
                <Icon 
                  name={collapsed ? "ChevronRight" : "ChevronLeft"} 
                  size={20} 
                  className="flex-shrink-0" 
                />
                {!collapsed && <span>Collapse</span>}
              </button>
            </div>

            {/* Powered by - only show when expanded */}
            {!collapsed && (
              <div className="mt-4 pt-4 border-t border-action-700">
                <p className="text-xs text-action-400 text-center">
                  Powered by <span className="text-brand-300">Averra</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 w-64 h-full bg-action-900 text-white z-50">
            {/* Mobile menu content - same as desktop but always expanded */}
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-6 border-b border-action-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium">V</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-white">VouchLine</h2>
                      <p className="text-sm text-action-300">Coordinator</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-action-400 hover:text-white"
                  >
                    <Icon name="X" size={20} />
                  </button>
                </div>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 py-6">
                <div className="space-y-2 px-3">
                  <button
                    onClick={() => handleNavigation('/coordinator-dashboard')}
                    className={`flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm transition-colors ${
                      isActivePath('/coordinator-dashboard')
                        ? 'bg-brand-600 text-white'
                        : 'text-action-300 hover:text-white hover:bg-brand-600/10'
                    }`}
                  >
                    <Icon name="LayoutDashboard" size={20} />
                    <span>Dashboard</span>
                  </button>

                  <button
                    onClick={() => handleNavigation('/case-vault')}
                    className={`flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm transition-colors ${
                      isActivePath('/case-vault')
                        ? 'bg-brand-600 text-white'
                        : 'text-action-300 hover:text-white hover:bg-brand-600/10'
                    }`}
                  >
                    <Icon name="FolderOpen" size={20} />
                    <span>Case Vault</span>
                  </button>

                  <button
                    onClick={() => handleNavigation('/cases')}
                    className={`flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm transition-colors ${
                      isActivePath('/cases')
                        ? 'bg-brand-600 text-white'
                        : 'text-action-300 hover:text-white hover:bg-brand-600/10'
                    }`}
                  >
                    <Icon name="Eye" size={20} />
                    <span>Review Cockpit</span>
                  </button>

                  {/* Quick Actions Divider */}
                  <div className="border-t border-action-700 mx-3 my-4"></div>

                  <button
                    onClick={() => handleNavigation('/case-creation')}
                    className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm transition-colors bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Icon name="Plus" size={20} />
                    <span>Create Case</span>
                  </button>

                  <button
                    onClick={() => handleNavigation('/workflow-template-configuration')}
                    className={`flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm transition-colors ${
                      isActivePath('/workflow-template-configuration')
                        ? 'bg-brand-600 text-white'
                        : 'text-action-300 hover:text-white hover:bg-brand-600/10'
                    }`}
                  >
                    <Icon name="Building2" size={20} />
                    <span>Playbooks</span>
                  </button>
                </div>
              </nav>

              {/* Bottom Actions */}
              <div className="p-3 border-t border-action-700">
                <div className="space-y-2">
                  <button
                    onClick={() => handleNavigation('/settings')}
                    className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm text-action-300 hover:text-white hover:bg-brand-600/10 transition-colors"
                  >
                    <Icon name="User" size={20} />
                    <span>Account</span>
                  </button>

                  <button
                    onClick={() => handleNavigation('/help-support-center')}
                    className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm text-action-300 hover:text-white hover:bg-brand-600/10 transition-colors"
                  >
                    <Icon name="HelpCircle" size={20} />
                    <span>Help</span>
                  </button>

                  <button
                    onClick={() => navigate('/login')}
                    className="flex items-center space-x-3 w-full px-3 py-3 rounded-lg text-sm text-action-300 hover:text-white hover:bg-brand-600/10 transition-colors"
                  >
                    <Icon name="LogOut" size={20} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden p-2 bg-action-800 text-white rounded-lg shadow-lg"
      >
        <Icon name="Menu" size={20} />
      </button>
    </>
  );
};

export default CoordinatorWorkspaceNav;