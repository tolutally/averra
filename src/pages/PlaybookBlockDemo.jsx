import React, { useState } from 'react';
import { EntityIdentityBlockToggle } from '../components/playbook-blocks/EntityIdentityBlock';
import PlaybookBlockManager from '../components/playbook-blocks/PlaybookBlockManager';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';

const PlaybookBlockDemo = () => {
  const [enabledBlocks, setEnabledBlocks] = useState([]);
  const [showDemo, setShowDemo] = useState(false);

  const handleBlockToggle = (blockId, enabled, position) => {
    if (enabled) {
      setEnabledBlocks(prev => [...prev, blockId]);
    } else {
      setEnabledBlocks(prev => prev.filter(id => id !== blockId));
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Reusable Playbook Blocks Demo
          </h1>
          <p className="text-muted-foreground mb-6">
            Entity Identity verification is now a reusable block that can be toggled into any playbook
          </p>
          <Button 
            onClick={() => setShowDemo(!showDemo)}
            variant={showDemo ? "outline" : "default"}
            iconName={showDemo ? "EyeOff" : "Eye"}
            iconPosition="left"
          >
            {showDemo ? "Hide Demo" : "Show Demo"}
          </Button>
        </div>

        {showDemo && (
          <>
            {/* Demo Section */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left: Block Toggle Demo */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Individual Block Toggle
                </h2>
                <EntityIdentityBlockToggle
                  isEnabled={enabledBlocks.includes('entity-identity')}
                  onToggle={(enabled) => handleBlockToggle('entity-identity', enabled, 'append')}
                />
              </div>

              {/* Right: Block Manager Demo */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Block Manager Interface
                </h2>
                <PlaybookBlockManager
                  enabledBlocks={enabledBlocks}
                  onBlockToggle={handleBlockToggle}
                  availableBlocks={['entity-identity']}
                />
              </div>
            </div>

            {/* Demo Results */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Current State
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon name="CheckCircle" size={16} className="text-green-600" />
                  <span className="text-sm text-foreground">
                    Enabled Blocks: {enabledBlocks.length === 0 ? "None" : enabledBlocks.join(", ")}
                  </span>
                </div>
                {enabledBlocks.includes('entity-identity') && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-sm font-medium text-blue-900 mb-2">
                      Entity Identity Block Enabled ✨
                    </div>
                    <div className="text-xs text-blue-700 space-y-1">
                      <div>• 8 verification steps will be added to any playbook</div>
                      <div>• Includes company registration, address, contacts, tax details</div>
                      <div>• Conditional steps for high-risk entities and fintech compliance</div>
                      <div>• Estimated completion time: 73 minutes</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Integration Example */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Integration Example
              </h2>
              <div className="text-sm text-muted-foreground space-y-2">
                <div>📝 <strong>In Template Library:</strong> Each template card now has toggleable blocks in expanded view</div>
                <div>🔧 <strong>In Template Details:</strong> Steps are merged automatically with visual indicators for block origin</div>
                <div>📊 <strong>Step Counting:</strong> Template step counts update dynamically based on enabled blocks</div>
                <div>⚡ <strong>Reusable:</strong> Same entity verification can be added to KYB, vendor onboarding, or any custom playbook</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PlaybookBlockDemo;
