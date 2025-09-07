import React, { useState, useCallback } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle, Eye, Edit, Download, RotateCcw, Image, FileIcon } from 'lucide-react';

const FileUploadZone = ({ requirement, onFileUpload, className = '' }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [annotationMode, setAnnotationMode] = useState(null);
  const [showAnnotationTools, setShowAnnotationTools] = useState(false);

  const validateFile = (file) => {
    const errors = [];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'image/jpg'];

    if (file.size > maxSize) {
      errors.push({
        type: 'size',
        message: `File "${file.name}" is too large. Maximum size is 10MB.`,
        severity: 'error'
      });
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push({
        type: 'format',
        message: `File "${file.name}" format not supported. Please upload JPG, PNG, or PDF files.`,
        severity: 'error'
      });
    }

    // Check for potential security issues
    if (file.name.includes('../') || file.name.includes('..\\')) {
      errors.push({
        type: 'security',
        message: `File "${file.name}" contains invalid characters.`,
        severity: 'error'
      });
    }

    return errors;
  };

  const handleFileSelect = useCallback(async (files) => {
    const fileArray = Array.from(files);
    setValidationErrors([]);
    setIsUploading(true);

    // Validate all files first
    const allErrors = [];
    const validFiles = [];

    fileArray.forEach(file => {
      const errors = validateFile(file);
      if (errors.length > 0) {
        allErrors.push(...errors);
      } else {
        validFiles.push(file);
      }
    });

    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
      setIsUploading(false);
      return;
    }

    // Process valid files
    for (const file of validFiles) {
      const fileId = Math.random().toString(36).substr(2, 9);
      
      // Add to upload queue
      setUploadQueue(prev => [...prev, { id: fileId, name: file.name, status: 'queued' }]);
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      try {
        // Simulate realistic upload with multiple progress steps
        const uploadSteps = [
          { progress: 10, message: 'Preparing file...' },
          { progress: 25, message: 'Uploading...' },
          { progress: 50, message: 'Processing...' },
          { progress: 75, message: 'Validating...' },
          { progress: 90, message: 'Finalizing...' },
          { progress: 100, message: 'Complete!' }
        ];

        for (const step of uploadSteps) {
          await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
          
          setUploadProgress(prev => ({ ...prev, [fileId]: step.progress }));
          setUploadQueue(prev => prev.map(item => 
            item.id === fileId 
              ? { ...item, status: step.progress === 100 ? 'completed' : 'uploading', message: step.message }
              : item
          ));
        }

        // Call the parent handler
        onFileUpload && onFileUpload(requirement.id, {
          id: fileId,
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
          type: file.type.includes('pdf') ? 'PDF' : 'Image',
          status: 'uploaded',
          uploadedAt: new Date().toISOString(),
          messages: 0
        });

      } catch (error) {
        setValidationErrors(prev => [...prev, {
          type: 'upload',
          message: `Failed to upload "${file.name}". Please try again.`,
          severity: 'error'
        }]);
        
        setUploadQueue(prev => prev.map(item => 
          item.id === fileId ? { ...item, status: 'failed', message: 'Upload failed' } : item
        ));
      }
    }

    // Clean up after all uploads complete
    setTimeout(() => {
      setIsUploading(false);
      setUploadQueue([]);
      setUploadProgress({});
    }, 1000);

  }, [requirement.id, onFileUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleFileInputChange = useCallback((e) => {
    const files = e.target.files;
    if (files) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  const retryUpload = (fileId) => {
    const queueItem = uploadQueue.find(item => item.id === fileId);
    if (queueItem) {
      // Reset and retry upload logic here
      setUploadQueue(prev => prev.map(item => 
        item.id === fileId ? { ...item, status: 'queued' } : item
      ));
    }
  };

  const enableAnnotationMode = (mode) => {
    setAnnotationMode(mode);
    setShowAnnotationTools(true);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${isUploading ? 'pointer-events-none opacity-75' : 'cursor-pointer hover:bg-gray-50'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && document.getElementById(`file-input-${requirement.id}`)?.click()}
      >
        <input
          id={`file-input-${requirement.id}`}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="animate-pulse">
            <div className="w-8 h-8 bg-blue-200 rounded-full mx-auto mb-2"></div>
            <p className="text-sm text-blue-600 mb-1">Processing files...</p>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Drop files here or <span className="text-blue-600 font-medium">browse</span>
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, PDF up to 10MB
            </p>
          </>
        )}
      </div>

      {/* Enhanced Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="space-y-2">
          {validationErrors.map((error, index) => (
            <div key={index} className={`flex items-start space-x-3 p-3 rounded-lg ${
              error.severity === 'error' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                error.severity === 'error' ? 'text-red-600' : 'text-yellow-600'
              }`} />
              <div>
                <p className={`text-sm font-medium ${
                  error.severity === 'error' ? 'text-red-800' : 'text-yellow-800'
                }`}>
                  {error.type === 'size' ? 'File Too Large' : 
                   error.type === 'format' ? 'Invalid Format' : 
                   error.type === 'security' ? 'Security Issue' : 'Upload Error'}
                </p>
                <p className={`text-sm ${
                  error.severity === 'error' ? 'text-red-700' : 'text-yellow-700'
                }`}>
                  {error.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Queue with Progress */}
      {uploadQueue.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Upload Progress</h4>
          {uploadQueue.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.status === 'completed' ? 'bg-green-100' :
                    item.status === 'failed' ? 'bg-red-100' :
                    'bg-blue-100'
                  }`}>
                    {item.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : item.status === 'failed' ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.message || item.status}</p>
                  </div>
                </div>
                
                {item.status === 'failed' && (
                  <button
                    onClick={() => retryUpload(item.id)}
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Retry</span>
                  </button>
                )}
              </div>
              
              {item.status !== 'completed' && item.status !== 'failed' && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{uploadProgress[item.id] || 0}%</span>
                    <span>{item.message}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress[item.id] || 0}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Uploaded Files with Annotation Tools */}
      {requirement.uploads && requirement.uploads.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
            {requirement.uploads.some(file => file.type === 'Image' || file.type === 'PDF') && (
              <button
                onClick={() => setShowAnnotationTools(!showAnnotationTools)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <Edit className="w-4 h-4" />
                <span>Annotate</span>
              </button>
            )}
          </div>

          {/* Annotation Tools */}
          {showAnnotationTools && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-600 mb-2">Annotation Tools</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => enableAnnotationMode('highlight')}
                  className={`px-3 py-1 text-xs rounded ${
                    annotationMode === 'highlight' 
                      ? 'bg-yellow-200 text-yellow-800' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Highlight
                </button>
                <button
                  onClick={() => enableAnnotationMode('arrow')}
                  className={`px-3 py-1 text-xs rounded ${
                    annotationMode === 'arrow' 
                      ? 'bg-blue-200 text-blue-800' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Arrow
                </button>
                <button
                  onClick={() => enableAnnotationMode('text')}
                  className={`px-3 py-1 text-xs rounded ${
                    annotationMode === 'text' 
                      ? 'bg-green-200 text-green-800' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Text
                </button>
              </div>
            </div>
          )}

          {requirement.uploads.map((file) => (
            <div key={file.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    {file.type === 'PDF' ? (
                      <FileIcon className="w-6 h-6 text-red-600" />
                    ) : (
                      <Image className="w-6 h-6 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {file.size} • {file.type} • {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                    {file.status === 'approved' && (
                      <div className="flex items-center space-x-1 mt-1">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600">Approved</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  <button 
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle file removal
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {annotationMode && (
                <div className="mt-3 p-2 bg-gray-50 rounded border-2 border-dashed border-gray-300">
                  <p className="text-xs text-gray-600 text-center">
                    {annotationMode === 'highlight' && 'Click and drag to highlight areas'}
                    {annotationMode === 'arrow' && 'Click to add arrows pointing to important areas'}
                    {annotationMode === 'text' && 'Click to add text annotations'}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;
