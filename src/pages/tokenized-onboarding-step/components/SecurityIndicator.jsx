import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityIndicator = ({ 
  tokenStatus = 'valid',
  expiresAt = null,
  ipAddress = null,
  sessionId = null 
}) => {
  const getStatusColor = () => {
    switch (tokenStatus) {
      case 'valid':
        return 'text-success';
      case 'expiring':
        return 'text-warning';
      case 'expired':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = () => {
    switch (tokenStatus) {
      case 'valid':
        return 'Shield';
      case 'expiring':
        return 'Clock';
      case 'expired':
        return 'ShieldAlert';
      default:
        return 'Shield';
    }
  };

  const getStatusText = () => {
    switch (tokenStatus) {
      case 'valid':
        return 'Secure Session Active';
      case 'expiring':
        return 'Session Expiring Soon';
      case 'expired':
        return 'Session Expired';
      default:
        return 'Session Status Unknown';
    }
  };

  const formatTimeRemaining = () => {
    if (!expiresAt) return null;
    
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  return (
    <div className="bg-muted/30 border border-border rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon 
            name={getStatusIcon()} 
            size={16} 
            className={getStatusColor()} 
          />
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {expiresAt && (
          <span className="text-xs text-muted-foreground">
            {formatTimeRemaining()}
          </span>
        )}
      </div>
      {/* Additional Security Info */}
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center space-x-4">
          {ipAddress && (
            <div className="flex items-center space-x-1">
              <Icon name="Globe" size={10} />
              <span>IP: {ipAddress}</span>
            </div>
          )}
          {sessionId && (
            <div className="flex items-center space-x-1">
              <Icon name="Key" size={10} />
              <span>Session: {sessionId?.substring(0, 8)}...</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1">
          <Icon name="Lock" size={10} />
          <span>256-bit encryption</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityIndicator;