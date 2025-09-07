import React from 'react';
import Icon from '../AppIcon';

// Reusable Entity Identity Block that can be toggled into any playbook
export const EntityIdentityBlock = {
  id: 'entity-identity-block',
  name: 'Entity Identity Verification',
  description: 'Complete entity identity verification including registration, addresses, contacts, and compliance',
  category: 'verification',
  estimatedTime: '73 minutes',
  stepCount: 8,
  steps: [
    {
      id: 'entity-step-1',
      title: 'Company Registration',
      description: 'Upload Certificate of Incorporation/Business Registration (legal name, number, jurisdiction, date)',
      type: 'document',
      required: true,
      estimatedTime: '10 minutes',
      documents: ['Certificate of Incorporation', 'Business Registration', 'Articles of Incorporation'],
      acceptanceCriteria: 'Clear scan/PDF; matches legal name in this flow'
    },
    {
      id: 'entity-step-2',
      title: 'Registered/Operating Address',
      description: 'Recent utility bill/bank statement/government letter (≤90 days) with business name + address',
      type: 'document',
      required: true,
      estimatedTime: '8 minutes',
      documents: ['Utility Bill', 'Bank Statement', 'Government Letter'],
      acceptanceCriteria: 'Date visible; matches ERP/vendor master (or note HQ vs ops)'
    },
    {
      id: 'entity-step-3',
      title: 'Primary Contacts',
      description: 'Operations, Security/IT, Billing, and Legal contacts (name, title, email)',
      type: 'form',
      required: true,
      estimatedTime: '15 minutes',
      fields: ['Operations Contact', 'Security/IT Contact', 'Billing Contact', 'Legal Contact'],
      acceptanceCriteria: 'Corporate emails required'
    },
    {
      id: 'entity-step-4',
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
      id: 'entity-step-5',
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
      id: 'entity-step-6',
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
      id: 'entity-step-7',
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
      id: 'entity-step-8',
      title: 'Sanctions/PEP Screening Attestation',
      description: 'Signed statement that you screen counterparties (tool + cadence)',
      type: 'document',
      required: false,
      conditional: 'Required for fintech, public sector, high-risk geo',
      estimatedTime: '8 minutes',
      documents: ['Screening Attestation', 'Policy Documentation'],
      acceptanceCriteria: 'Scope/frequency stated; ≤12 months'
    }
  ]
};

// Component for displaying the Entity Identity Block toggle in playbook builder
export const EntityIdentityBlockToggle = ({ 
  isEnabled = false, 
  onToggle, 
  position = 'before' // 'before', 'after', 'replace'
}) => {
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Icon name="Building2" size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">{EntityIdentityBlock.name}</h3>
            <p className="text-sm text-muted-foreground">
              {EntityIdentityBlock.stepCount} steps • {EntityIdentityBlock.estimatedTime}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {isEnabled ? 'Enabled' : 'Available'}
          </span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => onToggle && onToggle(e.target.checked, position)}
              className="sr-only"
            />
            <div className={`w-11 h-6 rounded-full transition-colors ${
              isEnabled ? 'bg-primary' : 'bg-muted'
            }`}>
              <div className={`w-5 h-5 bg-white rounded-full transition-transform transform ${
                isEnabled ? 'translate-x-5' : 'translate-x-0.5'
              } mt-0.5`} />
            </div>
          </label>
        </div>
      </div>
      
      <div className="text-xs text-muted-foreground mb-3">
        {EntityIdentityBlock.description}
      </div>
      
      {isEnabled && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-foreground mb-2">Included Steps:</div>
          <div className="space-y-1">
            {EntityIdentityBlock.steps.slice(0, 3).map((step, index) => (
              <div key={step.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center">
                  {index + 1}
                </span>
                <span>{step.title}</span>
                {step.conditional && (
                  <span className="px-1 py-0.5 bg-orange-50 text-orange-600 rounded text-xs">
                    Conditional
                  </span>
                )}
              </div>
            ))}
            {EntityIdentityBlock.steps.length > 3 && (
              <div className="text-xs text-muted-foreground ml-6">
                +{EntityIdentityBlock.steps.length - 3} more steps
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityIdentityBlock;
