import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import CaseContextBreadcrumb from '../../components/ui/CaseContextBreadcrumb';
import QuickActionPanel from '../../components/ui/QuickActionPanel';
import CaseOverviewTab from './components/CaseOverviewTab';
import DocumentsTab from './components/DocumentsTab';
import ActivityTab from './components/ActivityTab';
import AuditTab from './components/AuditTab';
import DocumentPreviewModal from './components/DocumentPreviewModal';
import Icon from '../../components/AppIcon';


const CaseDetailAuditTrail = () => {
  const { id: caseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Mock case data
  const caseData = {
    id: "CASE-2024-001",
    clientName: "TechFlow Solutions Inc.",
    status: "In Progress",
    priority: "High",
    createdDate: "08/15/2024",
    dueDate: "08/25/2024",
    assignedCoordinator: "Sarah Chen",
    contactPerson: "Michael Rodriguez",
    email: "michael.rodriguez@techflow.com",
    phone: "+1 (555) 123-4567",
    company: "TechFlow Solutions Inc.",
    currentBlocker: {
      reason: "Missing Tax Documentation",
      description: "Required tax certificates have not been uploaded. Participant was notified via email on 08/18/2024.",
      blockedSince: "08/18/2024 2:30 PM"
    },
    workflowSteps: [
      {
        id: 1,
        name: "Company Information",
        description: "Basic company details and registration",
        status: "completed",
        completedDate: "08/15/2024"
      },
      {
        id: 2,
        name: "Financial Documents",
        description: "Bank statements and financial records",
        status: "completed",
        completedDate: "08/16/2024"
      },
      {
        id: 3,
        name: "Tax Documentation",
        description: "Tax certificates and compliance documents",
        status: "blocked",
        completedDate: null
      },
      {
        id: 4,
        name: "Final Review",
        description: "Coordinator review and approval",
        status: "pending",
        completedDate: null
      }
    ],
    stats: {
      documentsVerified: 12,
      pendingReviews: 3,
      totalEvents: 47,
      daysActive: 4
    },
    complianceChecks: [
      {
        requirement: "KYC Documentation",
        description: "Know Your Customer verification completed",
        status: "passed"
      },
      {
        requirement: "AML Screening",
        description: "Anti-Money Laundering checks passed",
        status: "passed"
      },
      {
        requirement: "Tax Compliance",
        description: "Tax documentation verification pending",
        status: "pending"
      },
      {
        requirement: "Data Privacy Consent",
        description: "GDPR compliance consent obtained",
        status: "passed"
      }
    ]
  };

  // Mock documents data
  const documentsData = [
    {
      id: "DOC-001",
      fileName: "company_registration.pdf",
      fileType: "application/pdf",
      fileSize: 2048576,
      uploadDate: "08/15/2024 10:30 AM",
      uploadedBy: "Michael Rodriguez",
      ipAddress: "192.168.1.100",
      sha256Hash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      approvalStatus: "Approved",
      url: "https://example.com/documents/company_registration.pdf"
    },
    {
      id: "DOC-002",
      fileName: "bank_statement_july.pdf",
      fileType: "application/pdf",
      fileSize: 1536000,
      uploadDate: "08/16/2024 2:15 PM",
      uploadedBy: "Michael Rodriguez",
      ipAddress: "192.168.1.100",
      sha256Hash: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567",
      approvalStatus: "Under Review",
      url: "https://example.com/documents/bank_statement.pdf"
    },
    {
      id: "DOC-003",
      fileName: "company_logo.png",
      fileType: "image/png",
      fileSize: 512000,
      uploadDate: "08/15/2024 11:45 AM",
      uploadedBy: "Michael Rodriguez",
      ipAddress: "192.168.1.100",
      sha256Hash: "c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678",
      approvalStatus: "Approved",
      url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      previewUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
    }
  ];

  // Mock activities data
  const activitiesData = [
    {
      id: "ACT-001",
      title: "Case Created",
      description: "New onboarding case initiated for TechFlow Solutions Inc.",
      eventType: "system-events",
      timestamp: "2024-08-15T08:30:00Z",
      metadata: {
        performedBy: "System",
        ipAddress: "192.168.1.1"
      }
    },
    {
      id: "ACT-002",
      title: "Token Generated",
      description: "Secure access token generated and sent to participant",
      eventType: "token-events",
      timestamp: "2024-08-15T08:35:00Z",
      metadata: {
        tokenId: "TKN-ABC123",
        performedBy: "System",
        ipAddress: "192.168.1.1"
      }
    },
    {
      id: "ACT-003",
      title: "Document Uploaded",
      description: "Company registration document uploaded successfully",
      eventType: "participant-interactions",
      timestamp: "2024-08-15T10:30:00Z",
      metadata: {
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    },
    {
      id: "ACT-004",
      title: "Document Approved",
      description: "Company registration document reviewed and approved",
      eventType: "coordinator-actions",
      timestamp: "2024-08-15T14:20:00Z",
      metadata: {
        performedBy: "Sarah Chen",
        ipAddress: "192.168.1.50"
      }
    },
    {
      id: "ACT-005",
      title: "Reminder Sent",
      description: "Email reminder sent for pending tax documentation",
      eventType: "reminder-sends",
      timestamp: "2024-08-18T09:00:00Z",
      metadata: {
        performedBy: "System",
        reminderType: "Email"
      }
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'LayoutDashboard' },
    { id: 'documents', label: 'Documents', icon: 'FileText' },
    { id: 'activity', label: 'Activity', icon: 'Activity' },
    { id: 'audit', label: 'Audit', icon: 'Shield' }
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleQuickAction = (actionId, caseId) => {
    console.log('Quick action:', actionId, 'for case:', caseId);
    // Handle quick actions like approve, reject, request info, etc.
  };

  const handleUpdateCase = (action) => {
    console.log('Update case action:', action);
    // Handle case updates
  };

  const handlePreviewDocument = (documentId) => {
    const document = documentsData?.find(doc => doc?.id === documentId);
    setSelectedDocument(document);
    setIsPreviewOpen(true);
  };

  const handleDownloadDocument = (documentId) => {
    const document = documentsData?.find(doc => doc?.id === documentId);
    console.log('Download document:', document);
    // Handle document download
  };

  const handleGenerateReport = async (reportConfig) => {
    console.log('Generate report:', reportConfig);
    // Handle report generation
    return new Promise(resolve => setTimeout(resolve, 2000));
  };

  const handleExportData = (format) => {
    console.log('Export data in format:', format);
    // Handle data export
  };

  const handleAnnotateDocument = (documentId, annotation) => {
    console.log('Add annotation to document:', documentId, annotation);
    // Handle document annotation
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <CaseOverviewTab 
            caseData={caseData}
            onUpdateCase={handleUpdateCase}
          />
        );
      case 'documents':
        return (
          <DocumentsTab
            documents={documentsData}
            onPreviewDocument={handlePreviewDocument}
            onDownloadDocument={handleDownloadDocument}
          />
        );
      case 'activity':
        return (
          <ActivityTab
            activities={activitiesData}
            onFilterChange={(filters) => console.log('Filter change:', filters)}
          />
        );
      case 'audit':
        return (
          <AuditTab
            caseData={caseData}
            onGenerateReport={handleGenerateReport}
            onExportData={handleExportData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout userProfile={{ name: 'Sarah Chen' }}>
      {/* Breadcrumb */}
      <div>
        <CaseContextBreadcrumb
          caseId={caseData?.id}
          caseName={caseData?.clientName}
          caseStatus={caseData?.status}
          parentPath="/coordinator-dashboard"
          parentLabel="Dashboard"
          currentLabel="Case Details"
        />
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Tab Navigation */}
            <div className="bg-card border border-border rounded-lg mb-6">
              <div className="border-b border-border">
                <nav className="flex space-x-0 overflow-x-auto">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-smooth whitespace-nowrap ${
                        activeTab === tab?.id
                          ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      <span>{tab?.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>

          {/* Sidebar - Desktop Only */}
          {!isMobile && (
            <div className="w-80 space-y-6">
              <QuickActionPanel
                context="coordinator"
                caseId={caseData?.id}
                position="sidebar"
                onAction={handleQuickAction}
              />

              {/* Case Stats */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-4 flex items-center">
                  <Icon name="BarChart3" size={16} className="mr-2" />
                  Case Statistics
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium text-foreground">50%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="text-center">
                      <p className="text-lg font-bold text-success-foreground">{caseData?.stats?.documentsVerified}</p>
                      <p className="text-xs text-muted-foreground">Verified</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-warning">{caseData?.stats?.pendingReviews}</p>
                      <p className="text-xs text-muted-foreground">Pending</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Mobile Quick Actions */}
      {isMobile && (
        <QuickActionPanel
          context="coordinator"
          caseId={caseData?.id}
          position="bottom-right"
          isFloating={true}
          onAction={handleQuickAction}
        />
      )}
      {/* Document Preview Modal */}
      <DocumentPreviewModal
        document={selectedDocument}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedDocument(null);
        }}
        onAnnotate={handleAnnotateDocument}
      />
    </AppLayout>
  );
};

export default CaseDetailAuditTrail;