import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../../hooks/useTelemetrySimple';

const FilePreview = ({ file }) => {
  const { trackCustomEvent } = useTelemetry();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (file) {
      loadPreview();
      trackCustomEvent('file_preview_opened', {
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
      });
    }
  }, [file, trackCustomEvent]);

  const loadPreview = async () => {
    setLoading(true);
    setError(null);

    try {
      // Mock preview URL generation - in production, this would come from your file service
      if (file.url) {
        setPreviewUrl(file.url);
      } else {
        // Generate preview URL based on file type
        const previewUrl = await generatePreviewUrl(file);
        setPreviewUrl(previewUrl);
      }
    } catch (err) {
      setError('Failed to load file preview');
      trackCustomEvent('file_preview_error', {
        file_name: file.name,
        error: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePreviewUrl = async (file) => {
    // Mock implementation - replace with actual preview service
    if (file.type?.startsWith('image/')) {
      return file.mockUrl || '/api/files/preview/' + file.id;
    } else if (file.type === 'application/pdf') {
      return '/api/files/pdf-preview/' + file.id;
    } else {
      throw new Error('Unsupported file type for preview');
    }
  };

  const downloadFile = () => {
    trackCustomEvent('file_download_initiated', {
      file_name: file.name,
      file_type: file.type,
    });
    // Mock download - replace with actual download logic
    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = file.name;
    link.click();
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) {
      return (
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (fileType === 'application/pdf') {
      return (
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <p>No file selected</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          {getFileIcon(file.type)}
          <h3 className="mt-4 text-lg font-medium text-gray-900">{file.name}</h3>
          <p className="mt-2 text-sm text-red-600">{error}</p>
          <button
            onClick={downloadFile}
            className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download File
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* File Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-3">
          {getFileIcon(file.type)}
          <div>
            <h4 className="text-sm font-medium text-gray-900">{file.name}</h4>
            <p className="text-xs text-gray-500">
              {file.type} • {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <button
          onClick={downloadFile}
          className="inline-flex items-center px-3 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download
        </button>
      </div>

      {/* File Content */}
      <div className="flex-1 overflow-auto">
        {file.type?.startsWith('image/') ? (
          <div className="p-4 h-full flex items-center justify-center">
            <img
              src={previewUrl}
              alt={file.name}
              className="max-w-full max-h-full object-contain shadow-lg rounded"
              onLoad={() => trackCustomEvent('image_preview_loaded', { file_name: file.name })}
            />
          </div>
        ) : file.type === 'application/pdf' ? (
          <div className="h-full">
            <iframe
              src={previewUrl}
              className="w-full h-full border-0"
              title={`Preview of ${file.name}`}
              onLoad={() => trackCustomEvent('pdf_preview_loaded', { file_name: file.name })}
            />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center p-6">
              {getFileIcon(file.type)}
              <h3 className="mt-4 text-lg font-medium text-gray-900">{file.name}</h3>
              <p className="mt-2 text-sm text-gray-600">
                Preview not available for this file type
              </p>
              <button
                onClick={downloadFile}
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download to View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilePreview;
