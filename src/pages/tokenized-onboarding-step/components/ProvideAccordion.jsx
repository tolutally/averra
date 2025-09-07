import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Upload, Eye, MessageCircle, MoreHorizontal, FileText } from 'lucide-react';
import FileUploadZone from './FileUploadZone';

const ProvideAccordion = ({ 
  requirements = [], 
  count = 0, 
  expandAll = false, 
  onRequirementToggle, 
  onViewInstructions,
  uploadingFiles = new Set(),
  onFileUpload
}) => {
  const [expandedRequirements, setExpandedRequirements] = useState(new Set());
  const [showUploadZone, setShowUploadZone] = useState({});
  const [expandedSections, setExpandedSections] = useState(new Set(['outstanding', 'completed']));
  const [uploadProgress, setUploadProgress] = useState({});

  React.useEffect(() => {
    if (expandAll) {
      setExpandedRequirements(new Set(requirements.map(r => r.id)));
      setExpandedSections(new Set(['outstanding', 'completed']));
    } else {
      setExpandedRequirements(new Set());
    }
  }, [expandAll, requirements]);

  // Separate requirements into outstanding and completed
  const outstandingRequirements = requirements.filter(req => 
    req.status !== 'approved' && req.status !== 'completed'
  );
  const completedRequirements = requirements.filter(req => 
    req.status === 'approved' || req.status === 'completed'
  );

  // Debug logging
  console.log('ProvideAccordion rendered with:', { 
    totalRequirements: requirements.length, 
    outstanding: outstandingRequirements.length, 
    completed: completedRequirements.length,
    expandedSections: Array.from(expandedSections)
  });

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'completed':
        return 'bg-[#DFF6E9] text-[#2D8A58]';
      case 'in_progress':
        return 'bg-[#56C2A6] text-[#1B5B4A]';
      case 'requested':
        return 'bg-[#FFF6E6] text-[#A36200]';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      case 'requested': return 'Requested';
      case 'approved': return 'Approved';
      case 'completed': return 'Completed';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const toggleRequirement = (reqId) => {
    const newExpanded = new Set(expandedRequirements);
    if (newExpanded.has(reqId)) {
      newExpanded.delete(reqId);
    } else {
      newExpanded.add(reqId);
    }
    setExpandedRequirements(newExpanded);
    onRequirementToggle?.(reqId);
  };

  const toggleUploadZone = (reqId) => {
    setShowUploadZone(prev => ({
      ...prev,
      [reqId]: !prev[reqId]
    }));
  };

  const simulateFileUpload = (requirementId, file) => {
    const uploadId = `${requirementId}-${Date.now()}`;
    
    // Start upload progress
    setUploadProgress(prev => ({ ...prev, [uploadId]: 0 }));
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[uploadId] || 0;
        if (currentProgress >= 100) {
          clearInterval(interval);
          // Remove progress tracking after completion
          setTimeout(() => {
            setUploadProgress(prev => {
              const newProgress = { ...prev };
              delete newProgress[uploadId];
              return newProgress;
            });
            onFileUpload?.(requirementId, file);
          }, 500);
          return prev;
        }
        return { ...prev, [uploadId]: Math.min(currentProgress + 10, 100) };
      });
    }, 200);
    
    return uploadId;
  };

  const renderRequirementRow = (requirement) => {
    const isExpanded = expandedRequirements.has(requirement.id);
    const showUpload = showUploadZone[requirement.id];
    
    return (
      <div key={requirement.id} className="border border-gray-200 rounded-lg mb-3">
        {/* Requirement Header */}
        <div 
          className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => toggleRequirement(requirement.id)}
          role="button"
          aria-expanded={isExpanded}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleRequirement(requirement.id);
            }
          }}
        >
          <div className="flex items-center space-x-3">
            <ChevronRight 
              className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {requirement.title}
              </p>
              <p className="text-xs text-gray-500">
                {requirement.uploadedFiles} of {requirement.totalFiles} files uploaded
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(requirement.status)}`}>
              {formatStatus(requirement.status)}
            </span>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onViewInstructions?.(requirement);
                }}
                className="text-purple-600 hover:text-purple-700 p-1"
              >
                <Eye className="w-4 h-4" />
              </button>
              
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">{requirement.messages}</span>
              </div>
              
              <button 
                onClick={(e) => e.stopPropagation()}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="bg-gray-50 p-4 border-t border-gray-200">
            {/* Instructions */}
            <div className="mb-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-700">{requirement.instructions}</p>
            </div>

            {/* Existing Files */}
            {requirement.uploads && Array.isArray(requirement.uploads) && requirement.uploads.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Files</h4>
                <div className="space-y-2">
                  {requirement.uploads.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size} • {file.type}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`}>
                          {formatStatus(file.status)}
                        </span>
                        
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">{file.messages}</span>
                        </div>
                        
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload Section - Only show for outstanding requirements */}
            {(requirement.status !== 'approved' && requirement.status !== 'completed') && (
              <div>
                {!showUpload ? (
                  <button 
                    onClick={() => toggleUploadZone(requirement.id)}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Upload file(s)</span>
                  </button>
                ) : (
                  <FileUploadZone 
                    requirement={requirement}
                    onFileUpload={(reqId, fileData) => {
                      console.log('File uploaded for requirement:', reqId, fileData);
                      setShowUploadZone(prev => ({ ...prev, [reqId]: false }));
                    }}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (title, sectionId, requirements, count) => {
    const isExpanded = expandedSections.has(sectionId);
    
    return (
      <div className="mb-6">
        {/* Section Header */}
        <div 
          className="flex items-center justify-between p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
          onClick={() => toggleSection(sectionId)}
        >
          <div className="flex items-center space-x-3">
            <ChevronDown 
              className={`w-5 h-5 text-gray-600 transition-transform ${!isExpanded ? '-rotate-90' : ''}`} 
            />
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <span className="bg-white text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
              {count}
            </span>
          </div>
        </div>

        {/* Section Content */}
        {isExpanded && (
          <div className="mt-4">
            {requirements.length > 0 ? (
              requirements.map(renderRequirementRow)
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No {title.toLowerCase()} documents</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      {/* Main Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-gray-900">Documents</h2>
          <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
            {count} total
          </span>
        </div>
        <button className="bg-purple-600 text-white text-sm px-4 py-2 rounded-md hover:bg-purple-700 flex items-center space-x-2">
          <Upload className="w-4 h-4" />
          <span>Upload</span>
        </button>
      </div>

      {/* Sections */}
      <div className="p-6">
        {renderSection(
          'Outstanding', 
          'outstanding', 
          outstandingRequirements, 
          outstandingRequirements.length
        )}
        
        {renderSection(
          'Completed', 
          'completed', 
          completedRequirements, 
          completedRequirements.length
        )}
      </div>
    </div>
  );
};

export default ProvideAccordion;
