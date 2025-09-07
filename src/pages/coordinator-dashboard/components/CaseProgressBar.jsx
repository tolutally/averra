import React from 'react';

const CaseProgressBar = ({ progress = 0, size = 'default', showPercentage = true }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 50) return 'bg-accent';
    if (progress >= 25) return 'bg-warning';
    return 'bg-error';
  };

  const sizeClasses = {
    sm: 'h-1',
    default: 'h-2',
    lg: 'h-3'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    default: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`flex-1 bg-muted rounded-full overflow-hidden ${sizeClasses?.[size]}`}>
        <div
          className={`${sizeClasses?.[size]} ${getProgressColor(clampedProgress)} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showPercentage && (
        <span className={`font-medium text-muted-foreground ${textSizeClasses?.[size]} min-w-[3rem] text-right`}>
          {clampedProgress}%
        </span>
      )}
    </div>
  );
};

export default CaseProgressBar;