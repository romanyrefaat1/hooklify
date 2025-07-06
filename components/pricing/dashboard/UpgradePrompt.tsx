'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UpgradePromptProps {
  title: string;
  description: string;
  ctaText?: string;
  variant?: 'events' | 'websites';
}

export default function UpgradePrompt({ 
  title, 
  description, 
  ctaText = "Upgrade Now",
  variant = 'events'
}: UpgradePromptProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push('/pricing');
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <Sparkles className="h-6 w-6 text-blue-600" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 mb-4">
            {description}
          </p>
          <button
            onClick={handleUpgrade}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            {ctaText}
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
