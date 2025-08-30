import React from 'react';
import { TagManager } from '../components/TagManager';

export const Tags: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <TagManager />
          </div>
        </div>
      </div>
    </div>
  );
};