import React from 'react';
import { ChevronDown, Menu, HelpCircle, UserPlus, MoreHorizontal } from 'lucide-react';

const HeaderBar = ({ title, subtitle, expandAll, onExpandAll }) => {
  return (
    <header className="h-16 sticky top-0 bg-white border-b z-40 flex items-center justify-between px-6">
      {/* Left side - Product mark + title */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-purple-400 rounded-md flex items-center justify-center">
          <span className="text-white font-bold text-sm">VL</span>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-gray-900 leading-tight">{title}</span>
          <span className="text-sm text-gray-500 leading-tight">{subtitle}</span>
        </div>
      </div>

      {/* Center - Tab (Desktop) */}
      <div className="hidden md:flex items-center">
        <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-900 border-b-2 border-gray-900">
          <span>📄</span>
          <span>Request</span>
          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">Active</span>
        </button>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-4">
        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
            <span className="text-blue-600">⏺</span>
            <span>Active</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button 
              onClick={onExpandAll}
              className="hover:text-gray-900"
            >
              {expandAll ? 'Collapse all' : 'Expand all'}
            </button>
          </div>
          
          <button className="text-gray-600 hover:text-gray-900">
            <HelpCircle className="w-5 h-5" />
          </button>
          
          <button className="bg-purple-400 text-white text-sm px-3 py-1.5 rounded-md hover:bg-purple-500 flex items-center space-x-1">
            <UserPlus className="w-4 h-4" />
            <span>Invite team</span>
          </button>
        </div>

        {/* Avatar */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-700">OT</span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
        </div>

        {/* Mobile Kebab */}
        <button className="lg:hidden text-gray-600 hover:text-gray-900">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default HeaderBar;
