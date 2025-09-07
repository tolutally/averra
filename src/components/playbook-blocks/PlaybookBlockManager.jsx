import React, { useState } from 'react';
import Icon from '../AppIcon';
import { EntityIdentityBlock, EntityIdentityBlockToggle } from './EntityIdentityBlock';

// Registry of all available playbook blocks
export const PlaybookBlockRegistry = {
  'entity-identity': EntityIdentityBlock,
  // Future blocks can be added here:
  // 'security-assessment': SecurityAssessmentBlock,
  // 'compliance-check': ComplianceCheckBlock,
  // 'financial-verification': FinancialVerificationBlock,
};

// Playbook Block Manager component for building custom playbooks
export const PlaybookBlockManager = ({ 
  enabledBlocks = [], 
  onBlockToggle, 
  availableBlocks = ['entity-identity'],
  insertPosition = 'append' // 'prepend', 'append', 'custom'
}) => {
  const [showBlockLibrary, setShowBlockLibrary] = useState(false);

  const handleBlockToggle = (blockId, enabled, position = 'append') => {
    if (onBlockToggle) {
      onBlockToggle(blockId, enabled, position);
    }
  };

  return (
    <div className="space-y-4">
      {/* Block Library Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Playbook Blocks</h3>
          <p className="text-sm text-muted-foreground">
            Add reusable verification blocks to your playbook
          </p>
        </div>
        <button
          onClick={() => setShowBlockLibrary(!showBlockLibrary)}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <Icon name="Plus" size={16} />
          Add Block
        </button>
      </div>

      {/* Available Blocks */}
      {showBlockLibrary && (
        <div className="border border-border rounded-lg p-4 bg-muted/20">
          <h4 className="font-medium text-foreground mb-3">Available Blocks</h4>
          <div className="space-y-3">
            {availableBlocks.map(blockId => {
              const isEnabled = enabledBlocks.includes(blockId);
              
              if (blockId === 'entity-identity') {
                return (
                  <EntityIdentityBlockToggle
                    key={blockId}
                    isEnabled={isEnabled}
                    onToggle={(enabled, position) => handleBlockToggle(blockId, enabled, position)}
                    position={insertPosition}
                  />
                );
              }
              
              // Future block components would be rendered here
              return null;
            })}
          </div>
        </div>
      )}

      {/* Enabled Blocks Summary */}
      {enabledBlocks.length > 0 && (
        <div className="border border-border rounded-lg p-4">
          <h4 className="font-medium text-foreground mb-3">Enabled Blocks ({enabledBlocks.length})</h4>
          <div className="space-y-2">
            {enabledBlocks.map(blockId => {
              const block = PlaybookBlockRegistry[blockId];
              if (!block) return null;
              
              return (
                <div key={blockId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="Building2" size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium text-sm text-foreground">{block.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {block.stepCount} steps • {block.estimatedTime}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBlockToggle(blockId, false)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Utility function to merge playbook steps with enabled blocks
export const mergePlaybookWithBlocks = (baseSteps = [], enabledBlocks = [], insertPosition = 'append') => {
  let mergedSteps = [...baseSteps];
  
  enabledBlocks.forEach(blockId => {
    const block = PlaybookBlockRegistry[blockId];
    if (!block) return;
    
    const blockSteps = block.steps.map(step => ({
      ...step,
      blockId, // Track which block this step belongs to
      blockName: block.name
    }));
    
    switch (insertPosition) {
      case 'prepend':
        mergedSteps = [...blockSteps, ...mergedSteps];
        break;
      case 'append':
      default:
        mergedSteps = [...mergedSteps, ...blockSteps];
        break;
    }
  });
  
  // Renumber steps
  return mergedSteps.map((step, index) => ({
    ...step,
    stepNumber: index + 1
  }));
};

// Helper function to calculate total time with blocks
export const calculateTotalTimeWithBlocks = (baseTime = 0, enabledBlocks = []) => {
  const blockTime = enabledBlocks.reduce((total, blockId) => {
    const block = PlaybookBlockRegistry[blockId];
    if (!block) return total;
    
    // Parse time string (e.g., "73 minutes" -> 73)
    const timeMatch = block.estimatedTime.match(/(\d+)/);
    const minutes = timeMatch ? parseInt(timeMatch[1]) : 0;
    return total + minutes;
  }, 0);
  
  return baseTime + blockTime;
};

export default PlaybookBlockManager;
