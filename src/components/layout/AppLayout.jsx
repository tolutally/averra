import React, { useState, useEffect } from 'react';
import CoordinatorWorkspaceNav from '../ui/CoordinatorWorkspaceNav';

const AppLayout = ({ children, userProfile = null }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Get saved state from localStorage or default to false
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const handleToggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <CoordinatorWorkspaceNav 
        userProfile={userProfile} 
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      
      {/* Main Content Area */}
      <div className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed 
          ? 'ml-0 lg:ml-16' 
          : 'ml-0 lg:ml-64'
      } min-w-0`}>
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
