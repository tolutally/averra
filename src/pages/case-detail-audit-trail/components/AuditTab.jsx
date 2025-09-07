import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const AuditTab = ({ caseData, onGenerateReport, onExportData }) => {
  const [reportSections, setReportSections] = useState({
    caseOverview: true,
    participantInfo: true,
    workflowProgress: true,
    documentHistory: true,
    activityTimeline: true,
    coordinatorActions: true,
    complianceChecks: true,
    signatures: false
  });

  const [reportFormat, setReportFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportSectionOptions = [
    {
      id: 'caseOverview',
      label: 'Case Overview & Summary',
      description: 'Basic case information, status, and key metrics'
    },
    {
      id: 'participantInfo',
      label: 'Participant Information',
      description: 'Contact details and company information'
    },
    {
      id: 'workflowProgress',
      label: 'Workflow Progress',
      description: 'Step-by-step completion status and timeline'
    },
    {
      id: 'documentHistory',
      label: 'Document History',
      description: 'All uploaded files with SHA-256 hashes and metadata'
    },
    {
      id: 'activityTimeline',
      label: 'Activity Timeline',
      description: 'Chronological log of all events and interactions'
    },
    {
      id: 'coordinatorActions',
      label: 'Coordinator Actions',
      description: 'All coordinator interventions and decisions'
    },
    {
      id: 'complianceChecks',
      label: 'Compliance Verification',
      description: 'Regulatory compliance status and checks'
    },
    {
      id: 'signatures',
      label: 'Digital Signatures',
      description: 'Cryptographic signatures and verification data'
    }
  ];

  const handleSectionToggle = (sectionId) => {
    setReportSections(prev => ({
      ...prev,
      [sectionId]: !prev?.[sectionId]
    }));
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      await onGenerateReport({
        sections: reportSections,
        format: reportFormat,
        caseId: caseData?.id
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getSelectedSectionsCount = () => {
    return Object.values(reportSections)?.filter(Boolean)?.length;
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4 flex items-center">
          <Icon name="FileText" size={16} className="mr-2" />
          Audit Report Configuration
        </h4>

        {/* Report Format */}
        <div className="mb-6">
          <h5 className="text-sm font-medium text-foreground mb-3">Report Format</h5>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="reportFormat"
                value="pdf"
                checked={reportFormat === 'pdf'}
                onChange={(e) => setReportFormat(e?.target?.value)}
                className="text-primary"
              />
              <span className="text-sm text-foreground">PDF Document</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="reportFormat"
                value="html"
                checked={reportFormat === 'html'}
                onChange={(e) => setReportFormat(e?.target?.value)}
                className="text-primary"
              />
              <span className="text-sm text-foreground">HTML Report</span>
            </label>
          </div>
        </div>

        {/* Report Sections */}
        <div>
          <h5 className="text-sm font-medium text-foreground mb-3">
            Include Sections ({getSelectedSectionsCount()}/{reportSectionOptions?.length})
          </h5>
          <div className="space-y-3">
            {reportSectionOptions?.map((section) => (
              <div key={section?.id} className="flex items-start space-x-3">
                <Checkbox
                  checked={reportSections?.[section?.id]}
                  onChange={(e) => handleSectionToggle(section?.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground cursor-pointer">
                    {section?.label}
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">{section?.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Case Summary for Audit */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4 flex items-center">
          <Icon name="Shield" size={16} className="mr-2" />
          Compliance Summary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg checkmark">
            <div className="w-8 h-8 mx-auto mb-2 checkmark rounded-full flex items-center justify-center">
              <Icon name="Check" size={16} />
            </div>
            <p className="text-xs">Verified</p>
            <p className="text-lg font-bold">{caseData?.stats?.documentsVerified || 0}</p>
          </div>
          <div className="text-center p-3 bg-warning/10 rounded-lg">
            <Icon name="Clock" size={24} className="text-warning mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Pending Reviews</p>
            <p className="text-lg font-bold text-warning">{caseData?.stats?.pendingReviews || 0}</p>
          </div>
          <div className="text-center p-3 bg-accent/10 rounded-lg">
            <Icon name="Activity" size={24} className="text-accent mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Total Events</p>
            <p className="text-lg font-bold text-accent">{caseData?.stats?.totalEvents || 0}</p>
          </div>
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <Icon name="Calendar" size={24} className="text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-foreground">Days Active</p>
            <p className="text-lg font-bold text-primary">{caseData?.stats?.daysActive || 0}</p>
          </div>
        </div>
      </div>
      {/* Compliance Checklist */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h4 className="text-md font-semibold text-foreground mb-4 flex items-center">
          <Icon name="CheckSquare" size={16} className="mr-2" />
          Regulatory Compliance Checklist
        </h4>
        <div className="space-y-3">
          {caseData?.complianceChecks?.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  check?.status === 'passed' ? 'checkmark' :
                  check?.status === 'failed' ? 'priority--high' : 
                  'priority--medium'
                }`}>
                  <Icon 
                    name={check?.status === 'passed' ? 'Check' : check?.status === 'failed' ? 'X' : 'Clock'} 
                    size={12}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{check?.requirement}</p>
                  <p className="text-xs text-muted-foreground">{check?.description}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                check?.status === 'passed' ? 'text-success-foreground bg-success' :
                check?.status === 'failed'? 'text-pastel-orange-foreground bg-pastel-orange' : 'text-warning bg-warning/10'
              }`}>
                {check?.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <Button
          variant="default"
          iconName="FileText"
          iconPosition="left"
          onClick={handleGenerateReport}
          loading={isGenerating}
          disabled={getSelectedSectionsCount() === 0}
          className="flex-1"
        >
          Generate Audit Report
        </Button>
        <Button
          variant="outline"
          iconName="Download"
          iconPosition="left"
          onClick={() => onExportData('csv')}
        >
          Export CSV
        </Button>
        <Button
          variant="outline"
          iconName="FileSpreadsheet"
          iconPosition="left"
          onClick={() => onExportData('xlsx')}
        >
          Export Excel
        </Button>
      </div>
      {/* Report Preview */}
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Eye" size={16} className="text-muted-foreground" />
          <h5 className="text-sm font-medium text-foreground">Report Preview</h5>
        </div>
        <p className="text-xs text-muted-foreground mb-2">
          Your audit report will include {getSelectedSectionsCount()} section{getSelectedSectionsCount() !== 1 ? 's' : ''} 
          and will be generated in {reportFormat?.toUpperCase()} format.
        </p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Case ID: #{caseData?.id}</p>
          <p>• Client: {caseData?.clientName}</p>
          <p>• Generated: {new Date()?.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
      </div>
    </div>
  );
};

export default AuditTab;