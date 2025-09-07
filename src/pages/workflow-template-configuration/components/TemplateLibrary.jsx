import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import PlaybookBlockManager from '../../../components/playbook-blocks/PlaybookBlockManager';

const TemplateLibrary = ({ 
  selectedTemplate, 
  onTemplateSelect,
  onCreateNew,
  onTemplateUpdate 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [enabledBlocks, setEnabledBlocks] = useState({
    'general': {
      'entity-identity': true
    }
  });
  const [showBlockManager, setShowBlockManager] = useState(false);

  const toggleCard = (templateId) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(templateId)) {
      newExpanded.delete(templateId);
    } else {
      newExpanded.add(templateId);
    }
    setExpandedCards(newExpanded);
  };

  const handleBlockToggle = (templateId, blockId, enabled) => {
    setEnabledBlocks(prev => ({
      ...prev,
      [templateId]: {
        ...prev[templateId],
        [blockId]: enabled
      }
    }));

    // Notify parent component if callback is provided
    if (onTemplateUpdate) {
      const updatedBlocks = {
        ...enabledBlocks[templateId],
        [blockId]: enabled
      };
      onTemplateUpdate(templateId, 'blocks', updatedBlocks);
    }
  };

  const getEnabledBlocksForTemplate = (templateId) => {
    const templateBlocks = enabledBlocks[templateId] || {};
    return Object.keys(templateBlocks).filter(blockId => templateBlocks[blockId]);
  };

  const templateCategories = [
    { id: 'all', label: 'All Playbooks', count: 4 },
    { id: 'fintech', label: 'Fintech', count: 1 },
    { id: 'general', label: 'General', count: 2 },
    { id: 'security', label: 'Privacy & Security', count: 1 },
    { id: 'blocks', label: 'Reusable Blocks', count: 1 },
    { id: 'custom', label: 'Custom', count: 0 }
  ];

  const starterTemplates = [
    {
      id: 'fintech',
      name: 'Standard Fintech KYB',
      category: 'fintech',
      description: 'Comprehensive Know Your Business verification for fintech companies with AML/CTF compliance',
      steps: 11,
      avgCompletion: '4.2 days',
      completionRate: 94,
      isStarter: true,
      tags: ['KYB', 'AML', 'CTF', 'Fintech', 'Compliance']
    },
    {
      id: 'general',
      name: 'Vendor Onboarding',
      category: 'general',
      description: 'Comprehensive vendor security assessment and onboarding process with SOC2, penetration testing, and data protection requirements',
      steps: 10,
      avgCompletion: '3.8 days',
      completionRate: 89,
      isStarter: true,
      tags: ['Vendor', 'Security', 'SOC2', 'Data Protection', 'Compliance']
    },
    {
      id: 'saas-gdpr',
      name: 'GDPR Compliance',
      category: 'security',
      description: 'Comprehensive GDPR compliance verification including DPA, processing records, international transfers, and data protection measures',
      steps: 8,
      avgCompletion: '3.2 days',
      completionRate: 96,
      isStarter: true,
      tags: ['GDPR', 'Privacy', 'DPA', 'Data Protection', 'EU Compliance']
    },
    {
      id: 'entity-identity',
      name: 'Entity Identity',
      category: 'general',
      description: 'Comprehensive entity verification covering company registration, addresses, contacts, tax details, and compliance',
      steps: 8,
      avgCompletion: '2.5 days',
      completionRate: 92,
      isStarter: true,
      tags: ['Entity', 'Identity', 'Company', 'Verification', 'Compliance']
    }
  ];

  const filteredTemplates = starterTemplates?.filter(template => {
    const matchesSearch = template?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         template?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         template?.tags?.some(tag => tag?.toLowerCase()?.includes(searchQuery?.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Playbook Library</h2>
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={onCreateNew}
          >
            New
          </Button>
        </div>

        {/* Search */}
        <Input
          type="search"
          placeholder="Search playbooks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="mb-4"
        />

        {/* Categories */}
        <div className="space-y-1">
          {templateCategories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => {
                setSelectedCategory(category?.id);
                if (category?.id === 'blocks') {
                  setShowBlockManager(true);
                } else {
                  setShowBlockManager(false);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-smooth ${
                selectedCategory === category?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <span>{category?.label}</span>
              <span className="text-xs opacity-75">{category?.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Block Manager - Show when "Reusable Blocks" category is selected */}
      {showBlockManager && selectedCategory === 'blocks' && (
        <div className="border-b border-border p-4">
          <PlaybookBlockManager
            enabledBlocks={getEnabledBlocksForTemplate('global')}
            onBlockToggle={(blockId, enabled, position) => 
              handleBlockToggle('global', blockId, enabled)
            }
            availableBlocks={['entity-identity']}
          />
        </div>
      )}
      {/* Template List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredTemplates?.map((template) => {
          const isExpanded = expandedCards.has(template?.id);
          const isSelected = selectedTemplate?.id === template?.id;
          
          return (
            <div
              key={template?.id}
              className={`rounded-lg border cursor-pointer transition-smooth ${
                isSelected
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }`}
            >
              {/* Compact Header - Always Visible */}
              <div 
                className="p-3 flex items-center justify-between template-card-header"
                onClick={() => onTemplateSelect(template)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-foreground text-sm truncate">
                      {template?.name}
                    </h3>
                    {template?.isStarter && (
                      <span className="px-1.5 py-0.5 bg-accent/10 text-accent text-xs rounded-full flex-shrink-0">
                        Starter
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{template?.steps} steps</span>
                    <span>{template?.avgCompletion}</span>
                    <div className="flex items-center gap-1">
                      <div className="w-8 h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-success rounded-full template-card-progress"
                          style={{ width: `${template?.completionRate}%` }}
                        />
                      </div>
                      <span>{template?.completionRate}%</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCard(template?.id);
                  }}
                  className="ml-2 p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
                >
                  <Icon 
                    name={isExpanded ? "ChevronUp" : "ChevronDown"} 
                    size={14} 
                    className="text-muted-foreground" 
                  />
                </button>
              </div>

              {/* Expanded Details - Collapsible */}
              {isExpanded && (
                <div className="px-3 pb-3 border-t border-border/50 bg-muted/10 template-card-details">
                  <div className="pt-2 space-y-3">
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {template?.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      {template?.tags?.slice(0, 3)?.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 bg-muted text-muted-foreground text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {template?.tags?.length > 3 && (
                        <span className="px-1.5 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                          +{template?.tags?.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Template-specific Block Management */}
                    <div className="border-t border-border/30 pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-foreground">Optional Blocks</span>
                        <span className="text-xs text-muted-foreground">
                          {getEnabledBlocksForTemplate(template?.id).length} enabled
                        </span>
                      </div>
                      
                      {/* Entity Identity Block Toggle for this template */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center">
                              <Icon name="Building2" size={12} className="text-blue-600" />
                            </div>
                            <div>
                              <div className="text-xs font-medium text-foreground">Entity Identity</div>
                              <div className="text-xs text-muted-foreground">8 steps • 73 min</div>
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={enabledBlocks[template?.id]?.['entity-identity'] || false}
                              onChange={(e) => handleBlockToggle(template?.id, 'entity-identity', e.target.checked)}
                              className="sr-only"
                            />
                            <div className={`w-8 h-4 rounded-full transition-colors ${
                              enabledBlocks[template?.id]?.['entity-identity'] ? 'bg-primary' : 'bg-muted'
                            }`}>
                              <div className={`w-3 h-3 bg-white rounded-full transition-transform transform ${
                                enabledBlocks[template?.id]?.['entity-identity'] ? 'translate-x-4' : 'translate-x-0.5'
                              } mt-0.5`} />
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredTemplates?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Search" size={32} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No playbooks found</p>
            <p className="text-xs text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateLibrary;