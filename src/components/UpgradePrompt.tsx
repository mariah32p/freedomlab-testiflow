import React from 'react';
import { ArrowRight, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UpgradePromptProps {
  feature: string;
  description?: string;
  inline?: boolean;
  className?: string;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({ 
  feature, 
  description, 
  inline = false,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate('/settings');
  };

  if (inline) {
    return (
      <div className={`bg-gradient-to-r from-accent-50 to-accent-100 border border-accent-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="h-4 w-4 text-accent-600" />
            <div>
              <div className="text-sm font-medium text-accent-900">{feature} - Premium Feature</div>
              <div className="text-xs text-accent-700">
                {description || `${feature} is available with Premium. Upgrade to unlock this powerful feature.`}
                <br />
                <span className="font-medium">Charged immediately • Prorated billing</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleUpgrade}
            className="bg-accent-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-accent-700 transition-colors flex items-center space-x-1"
          >
            <span>Upgrade</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border-2 border-dashed border-accent-300 rounded-xl p-8 text-center ${className}`}>
      <div className="w-16 h-16 bg-gradient-to-br from-accent-100 to-accent-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <Crown className="h-8 w-8 text-accent-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description || `${feature} is available with Premium. Upgrade to unlock this powerful feature.`}
      </p>
      <button
        onClick={handleUpgrade}
        className="bg-accent-600 text-white px-6 py-3 rounded-lg hover:bg-accent-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2 mx-auto"
      >
        <Crown className="h-5 w-5" />
        <span>Upgrade to Premium</span>
        <ArrowRight className="h-5 w-5" />
      </button>
    </div>
  );
};