import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { mergePlaybookWithBlocks, calculateTotalTimeWithBlocks } from '../../../components/playbook-blocks/PlaybookBlockManager';

const TemplateDetailsPanel = ({ 
  template, 
  onUseTemplate, 
  onTest,
  onClose,
  templateUpdates = {}
}) => {
  const navigate = useNavigate();
  const [expandedSteps, setExpandedSteps] = useState(new Set());

  // Get enabled blocks for this template
  const enabledBlocks = templateUpdates[template?.id]?.blocks || {};
  const enabledBlockIds = Object.keys(enabledBlocks).filter(blockId => enabledBlocks[blockId]);

  const toggleStep = (stepId) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const expandAllSteps = () => {
    const baseSteps = getBaseTemplateSteps(template.id);
    const mergedSteps = mergePlaybookWithBlocks(baseSteps, enabledBlockIds);
    setExpandedSteps(new Set(mergedSteps.map(step => step.id)));
  };

  const collapseAllSteps = () => {
    setExpandedSteps(new Set());
  };

  const handleUseTemplate = () => {
    navigate('/case-creation', { 
      state: { 
        template: {
          ...template,
          // Include enabled blocks in the template data
          enabledBlocks: enabledBlockIds,
          // Merge the steps with enabled blocks for case creation
          steps: mergePlaybookWithBlocks(getBaseTemplateSteps(template.id), enabledBlockIds),
          estimatedDuration: calculateTotalTimeWithBlocks(template.id, enabledBlockIds)
        }
      }
    });
  };

  const handleCreateNew = () => {
    navigate('/workflow-builder');
  };

  if (!template) return null;

  // Mock detailed steps for the template
  const getBaseTemplateSteps = (templateId) => {
    switch (templateId) {
      case 'fintech':
        return [
          {
            id: 'step-1',
            title: 'Company Registration',
            description: 'Upload your Certificate of Incorporation or Business Registration showing legal name, number, jurisdiction, and date',
            type: 'document',
            required: true,
            estimatedTime: '10 minutes',
            documents: ['Certificate of Incorporation', 'Business Registration'],
            acceptanceCriteria: 'Clear scan/PDF; matches legal name in this flow. Renewal: on change only'
          },
          {
            id: 'step-2',
            title: 'Proof of Business Address',
            description: 'Provide a recent utility bill, bank statement, or government letter with business name and address (≤90 days)',
            type: 'document',
            required: true,
            estimatedTime: '8 minutes',
            documents: ['Utility Bill', 'Bank Statement', 'Government Letter'],
            acceptanceCriteria: 'Date visible; address matches registration or official HQ'
          },
          {
            id: 'step-3',
            title: 'Directors/Officers List',
            description: 'Upload a current list of directors/officers (from registry extract, annual return, or signed letterhead)',
            type: 'document',
            required: true,
            estimatedTime: '12 minutes',
            documents: ['Registry Extract', 'Annual Return', 'Signed Letterhead'],
            acceptanceCriteria: 'Dated ≤12 months; includes full names and roles'
          },
          {
            id: 'step-4',
            title: 'UBO Declaration',
            description: 'Provide a signed UBO form listing all individuals with ≥25% ownership or control (attach structure chart if layered)',
            type: 'form',
            required: true,
            estimatedTime: '20 minutes',
            fields: ['Individual Names', '% Ownership', 'Control Rationale', 'Structure Chart'],
            acceptanceCriteria: 'Names, % ownership, and control rationale provided; dated ≤12 months'
          },
          {
            id: 'step-5',
            title: 'Government ID for Controllers/Signers',
            description: 'Upload a government photo ID for each beneficial owner/controller and authorized signer',
            type: 'document',
            required: true,
            estimatedTime: '15 minutes',
            documents: ['Government Photo ID', 'Passport', 'Driver License'],
            acceptanceCriteria: 'Valid, unexpired; full name matches UBO/Signer details'
          },
          {
            id: 'step-6',
            title: 'AML/CTF Policy',
            description: 'Share your current AML/CTF policy or program summary (risk assessment, screening, monitoring, SAR process)',
            type: 'document',
            required: true,
            estimatedTime: '15 minutes',
            documents: ['AML/CTF Policy', 'Program Summary', 'Risk Assessment'],
            acceptanceCriteria: 'Version/date visible; owner/contact listed; English or local + English'
          },
          {
            id: 'step-7',
            title: 'Sanctions/PEP Screening Attestation',
            description: 'Provide a signed attestation that you screen clients/owners against sanctions and PEPs (note tool/provider)',
            type: 'document',
            required: true,
            estimatedTime: '10 minutes',
            documents: ['Screening Attestation', 'Tool/Provider Documentation'],
            acceptanceCriteria: 'States frequency and scope; dated ≤12 months'
          },
          {
            id: 'step-8',
            title: 'Licenses & Registrations',
            description: 'Upload relevant licenses (e.g., FINTRAC MSB, PSP, state/provincial) with numbers and effective dates',
            type: 'document',
            required: false,
            conditional: 'As Applicable',
            estimatedTime: '12 minutes',
            documents: ['FINTRAC MSB', 'PSP License', 'State/Provincial License'],
            acceptanceCriteria: 'Active; jurisdiction matches operations'
          },
          {
            id: 'step-9',
            title: 'Settlement Bank Proof',
            description: 'Provide a void cheque/bank letter showing legal name and account number for settlements/payouts',
            type: 'document',
            required: true,
            estimatedTime: '8 minutes',
            documents: ['Void Cheque', 'Bank Letter', 'Account Verification'],
            acceptanceCriteria: 'Issued by bank; dated ≤12 months'
          },
          {
            id: 'step-10',
            title: 'Tax Form',
            description: 'US: W-9 (domestic) or W-8BEN-E (foreign). Canada: BN/GST/HST or T2 summary page; Others: local tax cert',
            type: 'document',
            required: true,
            conditional: 'Jurisdictional',
            estimatedTime: '10 minutes',
            documents: ['W-9', 'W-8BEN-E', 'BN/GST/HST', 'T2 Summary', 'Local Tax Certificate'],
            acceptanceCriteria: 'Signed, current, and complete'
          },
          {
            id: 'step-11',
            title: 'Key Compliance Contact',
            description: 'Share name, title, and email of your AML/Compliance lead',
            type: 'form',
            required: true,
            estimatedTime: '5 minutes',
            fields: ['Contact Name', 'Title', 'Corporate Email'],
            acceptanceCriteria: 'Corporate email provided'
          }
        ];
      case 'general': // Vendor Onboarding
        return [
          {
            id: 'step-1',
            title: 'Security Certification',
            description: 'Upload SOC 2 Type II (full or bridge letter) or ISO/IEC 27001 certificate + SoA',
            type: 'document',
            required: false,
            conditional: 'Preferred',
            estimatedTime: '15 minutes',
            documents: ['SOC 2 Type II Report', 'ISO/IEC 27001 Certificate', 'Statement of Applicability', 'SIG Lite/CAIQ'],
            acceptanceCriteria: 'Report period end ≤18 months; scope includes product in use. Fallback: SIG Lite/CAIQ'
          },
          {
            id: 'step-2',
            title: 'Penetration Test Summary',
            description: 'Provide the executive summary of your last external pen test (findings + remediation status)',
            type: 'document',
            required: true,
            estimatedTime: '12 minutes',
            documents: ['Penetration Test Executive Summary', 'Findings Report', 'Remediation Status'],
            acceptanceCriteria: '≤12 months; performed by independent tester'
          },
          {
            id: 'step-3',
            title: 'Vulnerability Management',
            description: 'Share patch SLAs and recent vuln scan summary (critical/high backlog counts)',
            type: 'document',
            required: true,
            estimatedTime: '10 minutes',
            documents: ['Patch SLA Document', 'Vulnerability Scan Summary', 'Backlog Report'],
            acceptanceCriteria: 'Dates, tool, cadence stated'
          },
          {
            id: 'step-4',
            title: 'Incident Response Policy',
            description: 'Upload your incident playbook, including notification timelines and contacts',
            type: 'document',
            required: true,
            estimatedTime: '12 minutes',
            documents: ['Incident Response Playbook', 'Notification Timeline', 'Contact List'],
            acceptanceCriteria: 'Version/date shown; contact email(s) included'
          },
          {
            id: 'step-5',
            title: 'BCP/DR Overview',
            description: 'Provide a 1–2 page summary with RTO/RPO, backup cadence, test dates, and key dependencies',
            type: 'document',
            required: true,
            estimatedTime: '15 minutes',
            documents: ['Business Continuity Plan', 'Disaster Recovery Plan', 'Test Results'],
            acceptanceCriteria: 'Last test ≤12 months'
          },
          {
            id: 'step-6',
            title: 'Data Protection Addendum',
            description: 'Upload your DPA (or sign ours) with sub-processor list and change-notification process',
            type: 'document',
            required: true,
            estimatedTime: '18 minutes',
            documents: ['Data Protection Addendum', 'Sub-processor List', 'Change Notification Process'],
            acceptanceCriteria: 'Lists subprocessors and lawful bases; includes SCCs/IDTA if needed'
          },
          {
            id: 'step-7',
            title: 'Insurance Certificates',
            description: 'Provide Certificates of Insurance for Cyber and E&O (and GL where applicable), showing limits and expiry',
            type: 'document',
            required: true,
            estimatedTime: '8 minutes',
            documents: ['Cyber Insurance Certificate', 'E&O Insurance Certificate', 'General Liability Certificate'],
            acceptanceCriteria: 'Coverage active; named insured matches legal entity'
          },
          {
            id: 'step-8',
            title: 'Availability & Support',
            description: 'Share uptime SLO/SLAs, status page URL, and support escalation matrix',
            type: 'form',
            required: true,
            estimatedTime: '10 minutes',
            fields: ['Uptime SLO/SLA', 'Status Page URL', 'Support Escalation Matrix'],
            acceptanceCriteria: 'Response/restore targets defined'
          },
          {
            id: 'step-9',
            title: 'Access & SSO Readiness',
            description: 'Confirm SSO/SAML and MFA support (attach IdP metadata if enabling now)',
            type: 'form',
            required: false,
            conditional: 'Preferred',
            estimatedTime: '12 minutes',
            fields: ['SSO/SAML Support', 'MFA Support', 'IdP Metadata'],
            acceptanceCriteria: 'SAML/SCIM docs or IdP guide exists'
          },
          {
            id: 'step-10',
            title: 'Data Residency Statement',
            description: 'Describe where customer data is stored/processed and backup locations',
            type: 'form',
            required: true,
            estimatedTime: '8 minutes',
            fields: ['Data Storage Locations', 'Processing Regions', 'Backup Locations', 'Service Providers'],
            acceptanceCriteria: 'Regions and providers named'
          }
        ];
      case 'saas-gdpr':
        return [
          {
            id: 'step-1',
            title: 'DPA + TOMs',
            description: 'Upload your GDPR Art. 28 DPA and Technical & Organisational Measures document',
            type: 'document',
            required: true,
            estimatedTime: '20 minutes',
            documents: ['GDPR Art. 28 DPA', 'Technical & Organisational Measures', 'Security Documentation'],
            acceptanceCriteria: 'Roles defined (controller/processor); TOMs cover access, encryption, logging'
          },
          {
            id: 'step-2',
            title: 'Record of Processing (ROPA) Summary',
            description: 'Provide a summary of processing activities relevant to our use case',
            type: 'document',
            required: true,
            estimatedTime: '15 minutes',
            documents: ['ROPA Summary', 'Processing Activities Report', 'Data Categories Document'],
            acceptanceCriteria: 'Categories of data, purposes, retention windows listed'
          },
          {
            id: 'step-3',
            title: 'International Transfers',
            description: 'Upload SCCs/UK IDTA and your latest Transfer Impact Assessment (TIA)',
            type: 'document',
            required: false,
            conditional: 'As Applicable',
            estimatedTime: '18 minutes',
            documents: ['Standard Contractual Clauses', 'UK IDTA', 'Transfer Impact Assessment'],
            acceptanceCriteria: 'Clauses complete; third countries named'
          },
          {
            id: 'step-4',
            title: 'DPIA / Legitimate Interests',
            description: 'If high-risk processing: share DPIA or LI Assessment',
            type: 'document',
            required: false,
            conditional: 'Contextual',
            estimatedTime: '22 minutes',
            documents: ['Data Protection Impact Assessment', 'Legitimate Interests Assessment', 'Risk Analysis'],
            acceptanceCriteria: 'Risk mitigations and outcomes present'
          },
          {
            id: 'step-5',
            title: 'Data Subject Requests',
            description: 'Attach your DSAR playbook: intake, verification, fulfillment timelines',
            type: 'document',
            required: true,
            estimatedTime: '12 minutes',
            documents: ['DSAR Playbook', 'Request Verification Process', 'Fulfillment Procedures'],
            acceptanceCriteria: 'Timelines ≤30 days; contact channel defined'
          },
          {
            id: 'step-6',
            title: 'Sub-Processors',
            description: 'Provide current list with services, locations, and notice policy',
            type: 'document',
            required: true,
            estimatedTime: '10 minutes',
            documents: ['Sub-processor List', 'Service Descriptions', 'Change Notice Policy'],
            acceptanceCriteria: 'Last updated ≤6 months'
          },
          {
            id: 'step-7',
            title: 'Breach Notification',
            description: 'Share your 72-hour GDPR breach notification procedure',
            type: 'document',
            required: true,
            estimatedTime: '15 minutes',
            documents: ['Breach Notification Procedure', 'Escalation Matrix', 'Notification Templates'],
            acceptanceCriteria: 'Regulator + customer notification paths shown'
          },
          {
            id: 'step-8',
            title: 'Privacy Contact/DPO',
            description: 'Provide DPO or privacy lead contact details',
            type: 'form',
            required: true,
            estimatedTime: '8 minutes',
            fields: ['DPO/Privacy Lead Name', 'Corporate Email', 'Postal Address', 'Phone Number'],
            acceptanceCriteria: 'Corporate email and postal address'
          }
        ];
      case 'entity-identity':
        return [
          {
            id: 'step-1',
            title: 'Company Registration',
            description: 'Upload Certificate of Incorporation/Business Registration (legal name, number, jurisdiction, date)',
            type: 'document',
            required: true,
            estimatedTime: '10 minutes',
            documents: ['Certificate of Incorporation', 'Business Registration', 'Articles of Incorporation'],
            acceptanceCriteria: 'Clear scan/PDF; matches legal name in this flow'
          },
          {
            id: 'step-2',
            title: 'Registered/Operating Address',
            description: 'Recent utility bill/bank statement/government letter (≤90 days) with business name + address',
            type: 'document',
            required: true,
            estimatedTime: '8 minutes',
            documents: ['Utility Bill', 'Bank Statement', 'Government Letter'],
            acceptanceCriteria: 'Date visible; matches ERP/vendor master (or note HQ vs ops)'
          },
          {
            id: 'step-3',
            title: 'Primary Contacts',
            description: 'Operations, Security/IT, Billing, and Legal contacts (name, title, email)',
            type: 'form',
            required: true,
            estimatedTime: '15 minutes',
            fields: ['Operations Contact', 'Security/IT Contact', 'Billing Contact', 'Legal Contact'],
            acceptanceCriteria: 'Corporate emails required'
          },
          {
            id: 'step-4',
            title: 'Tax Details',
            description: 'Tax documentation if we pay them or they invoice us (W-9/W-8BEN-E for US, BN/GST/HST for CA, VAT ID for EU)',
            type: 'document',
            required: false,
            conditional: 'Required if we pay them or they invoice us',
            estimatedTime: '12 minutes',
            documents: ['W-9', 'W-8BEN-E', 'BN/GST/HST', 'VAT ID', 'Local Tax Documents'],
            acceptanceCriteria: 'Signed/current; IDs valid'
          },
          {
            id: 'step-5',
            title: 'Bank Details',
            description: 'Void cheque/bank letter showing legal name + account',
            type: 'document',
            required: false,
            conditional: 'Required if payables',
            estimatedTime: '8 minutes',
            documents: ['Void Cheque', 'Bank Letter', 'Account Verification'],
            acceptanceCriteria: 'Issued by bank; ≤12 months'
          },
          {
            id: 'step-6',
            title: 'Directors/Officers List',
            description: 'Registry extract/annual return/signed letterhead with names/roles',
            type: 'document',
            required: false,
            conditional: 'Required for higher risk entities',
            estimatedTime: '10 minutes',
            documents: ['Registry Extract', 'Annual Return', 'Signed Letterhead'],
            acceptanceCriteria: 'Dated ≤12 months'
          },
          {
            id: 'step-7',
            title: 'UBO Declaration',
            description: 'List individuals with ≥25% ownership/control (add structure chart if layered)',
            type: 'form',
            required: false,
            conditional: 'Required for fintech, public sector, high-risk geo',
            estimatedTime: '20 minutes',
            fields: ['Individual Names', '% Ownership', 'Control Rationale', 'Structure Chart'],
            acceptanceCriteria: 'Names, % ownership, control rationale; dated ≤12 months'
          },
          {
            id: 'step-8',
            title: 'Sanctions/PEP Screening Attestation',
            description: 'Signed statement that you screen counterparties (tool + cadence)',
            type: 'document',
            required: false,
            conditional: 'Required for fintech, public sector, high-risk geo',
            estimatedTime: '8 minutes',
            documents: ['Screening Attestation', 'Policy Documentation'],
            acceptanceCriteria: 'Scope/frequency stated; ≤12 months'
          }
        ];
      default:
        return [
          {
            id: 'step-1',
            title: 'Basic Information',
            description: 'Collect basic user information',
            type: 'form',
            required: true,
            estimatedTime: '5 minutes'
          },
          {
            id: 'step-2',
            title: 'Document Upload',
            description: 'Upload required documents',
            type: 'document',
            required: true,
            estimatedTime: '10 minutes'
          },
          {
            id: 'step-3',
            title: 'Review & Approval',
            description: 'Review and approve application',
            type: 'review',
            required: true,
            estimatedTime: '24 hours'
          }
        ];
    }
  };

  // New function that merges base template steps with enabled blocks
  const getTemplateSteps = (templateId) => {
    const baseSteps = getBaseTemplateSteps(templateId);
    return mergePlaybookWithBlocks(baseSteps, enabledBlockIds);
  };

  const steps = getTemplateSteps(template.id);

  const getStepIcon = (type) => {
    switch (type) {
      case 'document': return 'FileText';
      case 'form': return 'Edit3';
      case 'automated': return 'Zap';
      case 'review': return 'Eye';
      default: return 'Circle';
    }
  };

  const getStepColor = (type) => {
    switch (type) {
      case 'document': return 'text-blue-600 bg-blue-50';
      case 'form': return 'text-green-600 bg-green-50';
      case 'automated': return 'text-purple-600 bg-purple-50';
      case 'review': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground mb-1">
              {template.name}
            </h2>
            <p className="text-muted-foreground text-sm">
              {template.description}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            onClick={onClose}
            className="ml-2"
          />
        </div>

        {/* Template Stats */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{steps.length}</div>
            <div className="text-xs text-muted-foreground">Total Steps</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{template.avgCompletion}</div>
            <div className="text-xs text-muted-foreground">Base Time</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-foreground">{template.completionRate}%</div>
            <div className="text-xs text-muted-foreground">Success Rate</div>
          </div>
        </div>

        {/* Enabled Blocks Info */}
        {enabledBlockIds.length > 0 && (
          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Icon name="Plus" size={14} className="text-blue-600" />
              <span className="text-xs font-medium text-blue-600">
                {enabledBlockIds.length} Additional Block{enabledBlockIds.length > 1 ? 's' : ''} Enabled
              </span>
            </div>
            <div className="text-xs text-blue-600/80">
              Extra verification steps have been added to this playbook
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {template.tags?.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="default"
            iconName="Play"
            iconPosition="left"
            onClick={handleUseTemplate}
            className="flex-1"
          >
            Use Template
          </Button>
          <Button
            variant="outline"
            iconName="Eye"
            iconPosition="left"
            onClick={onTest}
          >
            Preview
          </Button>
        </div>
      </div>

      {/* Steps Details */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">Workflow Steps</h3>
            <span className="text-xs px-2 py-1 bg-accent/10 text-accent-foreground rounded-full">
              {steps.length} steps
            </span>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={expandAllSteps}
              className="text-xs px-2 py-1 h-auto"
            >
              Expand All
            </Button>
            <Button
              variant="ghost" 
              size="sm"
              onClick={collapseAllSteps}
              className="text-xs px-2 py-1 h-auto"
            >
              Collapse All
            </Button>
          </div>
        </div>
        
        <div className="space-y-1">
          {steps.map((step, index) => {
            const isExpanded = expandedSteps.has(step.id);
            return (
              <div key={step.id} className="border border-border rounded-lg overflow-hidden">
                {/* Step Header - Always Visible */}
                <div 
                  className="flex items-center p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleStep(step.id)}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {index + 1}
                      </span>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getStepColor(step.type)} flex-shrink-0`}>
                        <Icon name={getStepIcon(step.type)} size={12} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-foreground">
                            {step.title}
                          </h4>
                          {step.blockId && (
                            <span className="px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-600 border border-blue-200">
                              {step.blockName}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {step.estimatedTime}
                          </span>
                          {step.conditional ? (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-orange-50 text-orange-700">
                              Conditional
                            </span>
                          ) : (
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              step.required 
                                ? 'bg-red-50 text-red-700' 
                                : 'bg-gray-50 text-gray-700'
                            }`}>
                              {step.required ? 'Required' : 'Optional'}
                            </span>
                          )}
                          <Icon 
                            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                            size={16} 
                            className="text-muted-foreground"
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step Details - Collapsible */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-border/50 bg-muted/20">
                    <div className="pt-3 space-y-3">
                      {/* Full Description */}
                      <div>
                        <div className="text-xs font-medium text-foreground mb-1">Description</div>
                        <p className="text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      </div>

                      {/* Conditional Requirements */}
                      {step.conditional && (
                        <div>
                          <div className="text-xs font-medium text-foreground mb-1">Conditional Requirement</div>
                          <div className="flex items-center gap-2 text-xs">
                            <Icon name="AlertTriangle" size={12} className="text-orange-500" />
                            <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded">
                              {step.conditional}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Acceptance Criteria */}
                      {step.acceptanceCriteria && (
                        <div>
                          <div className="text-xs font-medium text-foreground mb-1">Acceptance Criteria</div>
                          <div className="flex items-start gap-2 text-xs">
                            <Icon name="CheckCircle" size={12} className="text-green-500 mt-0.5" />
                            <span className="text-muted-foreground">
                              {step.acceptanceCriteria}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Step-specific details */}
                      {step.documents && (
                        <div>
                          <div className="text-xs font-medium text-foreground mb-2">Required Documents</div>
                          <div className="grid grid-cols-1 gap-1">
                            {step.documents.map((doc, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <Icon name="FileText" size={12} className="text-muted-foreground" />
                                <span className="text-muted-foreground">{doc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {step.fields && (
                        <div>
                          <div className="text-xs font-medium text-foreground mb-2">Form Fields</div>
                          <div className="grid grid-cols-1 gap-1">
                            {step.fields.map((field, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <Icon name="Edit" size={12} className="text-muted-foreground" />
                                <span className="text-muted-foreground">{field}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {step.checks && (
                        <div>
                          <div className="text-xs font-medium text-foreground mb-2">Automated Checks</div>
                          <div className="grid grid-cols-1 gap-1">
                            {step.checks.map((check, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                <Icon name="Shield" size={12} className="text-muted-foreground" />
                                <span className="text-muted-foreground">{check}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Step Type Info */}
                      <div className="pt-2 border-t border-border/30">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground capitalize flex items-center gap-1">
                            <Icon name={getStepIcon(step.type)} size={12} />
                            {step.type} Step
                          </span>
                          <span className="text-muted-foreground">
                            Est. Time: {step.estimatedTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="bg-muted rounded-md p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Info" size={14} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Template Info</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-0.5">
            <div>Last Updated: {new Date().toLocaleDateString()}</div>
            <div>Version: 1.0.0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailsPanel;
