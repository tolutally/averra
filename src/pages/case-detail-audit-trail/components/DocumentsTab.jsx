import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentsTab = ({ documents, onPreviewDocument, onDownloadDocument }) => {
  const [sortBy, setSortBy] = useState('uploadDate');
  const [filterBy, setFilterBy] = useState('all');

  const getFileIcon = (fileType) => {
    if (fileType?.includes('pdf')) return 'FileText';
    if (fileType?.includes('image')) return 'Image';
    if (fileType?.includes('document') || fileType?.includes('word')) return 'FileText';
    if (fileType?.includes('spreadsheet') || fileType?.includes('excel')) return 'FileSpreadsheet';
    return 'File';
  };

  const getApprovalStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'text-success-foreground bg-success';
      case 'rejected':
        return 'text-pastel-orange-foreground bg-pastel-orange';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'under-review':
        return 'text-accent bg-accent/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const filteredDocuments = documents?.filter(doc => {
    if (filterBy === 'all') return true;
    return doc?.approvalStatus?.toLowerCase() === filterBy;
  });

  const sortedDocuments = [...filteredDocuments]?.sort((a, b) => {
    switch (sortBy) {
      case 'uploadDate':
        return new Date(b.uploadDate) - new Date(a.uploadDate);
      case 'fileName':
        return a?.fileName?.localeCompare(b?.fileName);
      case 'fileSize':
        return b?.fileSize - a?.fileSize;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-muted-foreground" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e?.target?.value)}
              className="text-sm border border-border rounded-md px-2 py-1 bg-background"
            >
              <option value="all">All Documents</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="under-review">Under Review</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e?.target?.value)}
              className="text-sm border border-border rounded-md px-2 py-1 bg-background"
            >
              <option value="uploadDate">Upload Date</option>
              <option value="fileName">File Name</option>
              <option value="fileSize">File Size</option>
            </select>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {sortedDocuments?.length} document{sortedDocuments?.length !== 1 ? 's' : ''}
        </div>
      </div>
      {/* Documents List */}
      <div className="space-y-3">
        {sortedDocuments?.map((document) => (
          <div key={document?.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-start space-x-4">
              {/* File Icon */}
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={getFileIcon(document?.fileType)} size={20} className="text-muted-foreground" />
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">{document?.fileName}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatFileSize(document?.fileSize)} • {document?.fileType}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getApprovalStatusColor(document?.approvalStatus)}`}>
                    {document?.approvalStatus}
                  </span>
                </div>

                {/* Metadata */}
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Upload Date</p>
                    <p className="font-medium text-foreground">{document?.uploadDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">IP Address</p>
                    <p className="font-mono text-foreground">{document?.ipAddress}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">SHA-256 Hash</p>
                    <p className="font-mono text-foreground truncate" title={document?.sha256Hash}>
                      {document?.sha256Hash?.substring(0, 16)}...
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Uploaded By</p>
                    <p className="font-medium text-foreground">{document?.uploadedBy}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Eye"
                    iconPosition="left"
                    onClick={() => onPreviewDocument(document?.id)}
                  >
                    Preview
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Download"
                    iconPosition="left"
                    onClick={() => onDownloadDocument(document?.id)}
                    className="negative-action"
                  >
                    Download
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Copy"
                    iconPosition="left"
                    onClick={() => navigator.clipboard?.writeText(document?.sha256Hash)}
                  >
                    Copy Hash
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {sortedDocuments?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="FileX" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Documents Found</h3>
          <p className="text-muted-foreground">
            {filterBy === 'all' ?'No documents have been uploaded for this case yet.'
              : `No documents with status "${filterBy}" found.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentsTab;