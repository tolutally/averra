import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentPreviewModal = ({ document, isOpen, onClose, onAnnotate }) => {
  const [annotations, setAnnotations] = useState([]);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [annotationText, setAnnotationText] = useState('');

  if (!isOpen || !document) return null;

  const handleAddAnnotation = (x, y) => {
    if (!isAnnotating || !annotationText?.trim()) return;

    const newAnnotation = {
      id: Date.now(),
      x,
      y,
      text: annotationText,
      timestamp: new Date()?.toISOString(),
      author: 'Current User'
    };

    setAnnotations([...annotations, newAnnotation]);
    setAnnotationText('');
    setIsAnnotating(false);
    onAnnotate?.(document?.id, newAnnotation);
  };

  const getPreviewContent = () => {
    if (document?.fileType?.includes('image')) {
      return (
        <div className="relative">
          <img
            src={document?.previewUrl || document?.url}
            alt={document?.fileName}
            className="max-w-full max-h-[70vh] object-contain mx-auto"
            onClick={(e) => {
              if (isAnnotating) {
                const rect = e?.target?.getBoundingClientRect();
                const x = ((e?.clientX - rect?.left) / rect?.width) * 100;
                const y = ((e?.clientY - rect?.top) / rect?.height) * 100;
                handleAddAnnotation(x, y);
              }
            }}
          />
          {/* Annotations */}
          {annotations?.map((annotation) => (
            <div
              key={annotation?.id}
              className="absolute w-4 h-4 bg-primary rounded-full border-2 border-white cursor-pointer"
              style={{
                left: `${annotation?.x}%`,
                top: `${annotation?.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              title={annotation?.text}
            >
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-popover border border-border rounded-lg p-2 shadow-elevated min-w-48 z-10 opacity-0 hover:opacity-100 transition-opacity">
                <p className="text-xs text-popover-foreground">{annotation?.text}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {annotation?.author} • {new Date(annotation.timestamp)?.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (document?.fileType?.includes('pdf')) {
      return (
        <div className="bg-muted/20 rounded-lg p-8 text-center">
          <Icon name="FileText" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">PDF Preview</h3>
          <p className="text-muted-foreground mb-4">
            PDF preview is not available in this demo. In a real application, this would show the PDF content.
          </p>
          <Button
            variant="outline"
            iconName="ExternalLink"
            iconPosition="left"
            onClick={() => window.open(document?.url, '_blank')}
          >
            Open in New Tab
          </Button>
        </div>
      );
    }

    return (
      <div className="bg-muted/20 rounded-lg p-8 text-center">
        <Icon name="File" size={64} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Preview Not Available</h3>
        <p className="text-muted-foreground mb-4">
          Preview is not supported for this file type: {document?.fileType}
        </p>
        <Button
          variant="outline"
          iconName="Download"
          iconPosition="left"
          onClick={() => window.open(document?.url, '_blank')}
        >
          Download File
        </Button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-elevated max-w-6xl max-h-[90vh] w-full mx-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Eye" size={20} className="text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-foreground">{document?.fileName}</h2>
              <p className="text-sm text-muted-foreground">
                {document?.fileType} • {document?.fileSize ? `${Math.round(document?.fileSize / 1024)} KB` : 'Unknown size'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {document?.fileType?.includes('image') && (
              <Button
                variant={isAnnotating ? "default" : "outline"}
                size="sm"
                iconName="MessageSquare"
                iconPosition="left"
                onClick={() => setIsAnnotating(!isAnnotating)}
              >
                Annotate
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Annotation Input */}
        {isAnnotating && (
          <div className="p-4 bg-muted/30 border-b border-border">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Enter annotation text..."
                value={annotationText}
                onChange={(e) => setAnnotationText(e?.target?.value)}
                className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
                onKeyPress={(e) => {
                  if (e?.key === 'Enter' && annotationText?.trim()) {
                    // This would be handled by clicking on the image
                  }
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAnnotating(false);
                  setAnnotationText('');
                }}
              >
                Cancel
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Click on the image to add an annotation at that location.
            </p>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {getPreviewContent()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">
                <span className="font-medium">SHA-256:</span> {document?.sha256Hash}
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Uploaded:</span> {document?.uploadDate} by {document?.uploadedBy}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Copy"
                iconPosition="left"
                onClick={() => navigator.clipboard?.writeText(document?.sha256Hash)}
              >
                Copy Hash
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
                onClick={() => window.open(document?.url, '_blank')}
              >
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;