import React from 'react';
import { ArrowRight, Crown } from 'lucide-react';

interface UpgradePromptProps {
  feature: string;
  description: string;
  inline?: boolean;
  onUpgrade?: () => void;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({ 
  feature, 
  description, 
  inline = false,
  onUpgrade 
}) => {
  const handleUpgrade = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      window.location.href = '/get-started';
    }
  };

  if (inline) {
    return (
      <div className="bg-gradient-to-r from-accent-50 to-primary-50 border border-accent-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
              <Crown className="h-4 w-4 text-accent-600" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-accent-900">{feature} - Premium Feature</h4>
              <p className="text-sm text-accent-700">{description}</p>
            </div>
          </div>
          <button
            onClick={handleUpgrade}
            className="bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition-colors text-sm font-medium flex items-center space-x-1"
          >
            <span>Upgrade</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Crown className="h-8 w-8 text-accent-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature} - Premium Feature</h3>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">{description}</p>
      <button
        onClick={handleUpgrade}
        className="bg-accent-600 text-white px-8 py-4 rounded-lg hover:bg-accent-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg flex items-center space-x-2 mx-auto"
      >
        <Crown className="h-5 w-5" />
        <span>Upgrade to Premium</span>
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
};