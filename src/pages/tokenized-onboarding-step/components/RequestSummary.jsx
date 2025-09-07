import React from 'react';
import { Calendar, Clock, FileCheck, CheckCircle, BarChart } from 'lucide-react';

const RequestSummary = ({ data }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'in progress':
        return 'bg-[#56C2A6] text-[#1B5B4A]';
      case 'approved':
        return 'bg-[#DFF6E9] text-[#2D8A58]';
      case 'requested':
        return 'bg-[#FFF6E6] text-[#A36200]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Title and Status */}
      <div className="bg-white rounded-lg p-6 shadow-sm border">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.title}</h1>
            <p className="text-sm text-gray-600">Request ID: {data.id}</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(data.status)}`}>
              <div className="w-2 h-2 bg-current rounded-full mr-2"></div>
              {data.status}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
          <div className="flex items-center mb-2">
            <Clock className="w-4 h-4 text-purple-600 mr-2" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Request Sent
            </p>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {data.requestSent}
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
          <div className="flex items-center mb-2">
            <Calendar className="w-4 h-4 text-red-600 mr-2" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Due Date
            </p>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {data.requestDueDate}
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
          <div className="flex items-center mb-2">
            <FileCheck className="w-4 h-4 text-green-600 mr-2" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Hard Copies
            </p>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {data.hardCopiesAfterApproval}
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
          <div className="flex items-center mb-2">
            <CheckCircle className="w-4 h-4 text-purple-600 mr-2" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Completion Date
            </p>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {data.completionDate || '—'}
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
          <div className="flex items-center mb-2">
            <BarChart className="w-4 h-4 text-purple-400 mr-2" />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Progress
            </p>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {data.requirements?.filter(r => r.status === 'approved').length || 0} of {data.requirements?.length || 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequestSummary;
