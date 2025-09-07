import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ExampleComparison = ({ 
  goodExamples = [], 
  needsRevisionExamples = [] 
}) => {
  const [selectedExample, setSelectedExample] = useState(null);

  const allExamples = [
    ...goodExamples?.map(ex => ({ ...ex, type: 'good' })),
    ...needsRevisionExamples?.map(ex => ({ ...ex, type: 'needsRevision' }))
  ];

  const openModal = (example) => {
    setSelectedExample(example);
  };

  const closeModal = () => {
    setSelectedExample(null);
  };

  return (
    <div className="space-y-4">
      {/* Desktop: Side by Side */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
        {/* Good Examples */}
        {goodExamples?.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <h4 className="text-sm font-semibold text-success">Good Examples</h4>
            </div>
            <div className="space-y-3">
              {goodExamples?.map((example, index) => (
                <div 
                  key={index}
                  className="border border-success/20 rounded-lg p-3 bg-success/5 cursor-pointer hover:bg-success/10 transition-smooth"
                  onClick={() => openModal({ ...example, type: 'good' })}
                >
                  <div className="flex items-start space-x-3">
                    {example?.thumbnail && (
                      <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        <Image 
                          src={example?.thumbnail} 
                          alt={example?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-foreground">{example?.title}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{example?.description}</p>
                      {example?.highlights && (
                        <div className="mt-2 space-y-1">
                          {example?.highlights?.map((highlight, idx) => (
                            <div key={idx} className="flex items-start space-x-1">
                              <Icon name="Check" size={10} className="text-success mt-1 flex-shrink-0" />
                              <span className="text-xs text-success">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Needs Revision Examples */}
        {needsRevisionExamples?.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Icon name="XCircle" size={16} className="text-error" />
              <h4 className="text-sm font-semibold text-error">Needs Revision</h4>
            </div>
            <div className="space-y-3">
              {needsRevisionExamples?.map((example, index) => (
                <div 
                  key={index}
                  className="border border-error/20 rounded-lg p-3 bg-error/5 cursor-pointer hover:bg-error/10 transition-smooth"
                  onClick={() => openModal({ ...example, type: 'needsRevision' })}
                >
                  <div className="flex items-start space-x-3">
                    {example?.thumbnail && (
                      <div className="w-16 h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                        <Image 
                          src={example?.thumbnail} 
                          alt={example?.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h5 className="text-sm font-medium text-foreground">{example?.title}</h5>
                      <p className="text-xs text-muted-foreground mt-1">{example?.description}</p>
                      {example?.issues && (
                        <div className="mt-2 space-y-1">
                          {example?.issues?.map((issue, idx) => (
                            <div key={idx} className="flex items-start space-x-1">
                              <Icon name="X" size={10} className="text-error mt-1 flex-shrink-0" />
                              <span className="text-xs text-error">{issue}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Mobile: Stacked */}
      <div className="lg:hidden space-y-4">
        {allExamples?.map((example, index) => (
          <div 
            key={index}
            className={`border rounded-lg p-3 cursor-pointer transition-smooth ${
              example?.type === 'good' ?'border-success/20 bg-success/5 hover:bg-success/10' :'border-error/20 bg-error/5 hover:bg-error/10'
            }`}
            onClick={() => openModal(example)}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Icon 
                name={example?.type === 'good' ? "CheckCircle" : "XCircle"} 
                size={14} 
                className={example?.type === 'good' ? "text-success" : "text-error"} 
              />
              <span className={`text-xs font-medium ${
                example?.type === 'good' ? "text-success" : "text-error"
              }`}>
                {example?.type === 'good' ? 'Good Example' : 'Needs Revision'}
              </span>
            </div>
            
            <div className="flex items-start space-x-3">
              {example?.thumbnail && (
                <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                  <Image 
                    src={example?.thumbnail} 
                    alt={example?.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h5 className="text-sm font-medium text-foreground">{example?.title}</h5>
                <p className="text-xs text-muted-foreground mt-1">{example?.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal for Detailed View */}
      {selectedExample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon 
                  name={selectedExample?.type === 'good' ? "CheckCircle" : "XCircle"} 
                  size={20} 
                  className={selectedExample?.type === 'good' ? "text-success" : "text-error"} 
                />
                <h3 className="text-lg font-semibold text-foreground">{selectedExample?.title}</h3>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-muted-foreground hover:text-foreground transition-smooth rounded-md hover:bg-muted"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {selectedExample?.image && (
                <div className="w-full h-64 bg-muted rounded-lg overflow-hidden">
                  <Image 
                    src={selectedExample?.image} 
                    alt={selectedExample?.title}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              <p className="text-muted-foreground">{selectedExample?.description}</p>

              {selectedExample?.highlights && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-success">What makes this good:</h4>
                  {selectedExample?.highlights?.map((highlight, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{highlight}</span>
                    </div>
                  ))}
                </div>
              )}

              {selectedExample?.issues && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-error">Issues to fix:</h4>
                  {selectedExample?.issues?.map((issue, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <Icon name="X" size={14} className="text-error mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground">{issue}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExampleComparison;