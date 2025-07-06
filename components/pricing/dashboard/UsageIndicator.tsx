'use client';

import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress'; // Assuming you have this component
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface UsageData {
  events: {
    used: number;
    limit: number;
    resetDate: string;
  };
  websites: {
    used: number;
    limit: number;
  };
}

export default function UsageIndicator() {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/plans/usage');
      if (response.ok) {
        const data = await response.json();
        setUsage(data);
      }
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-2 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  if (!usage) return null;

  const eventPercentage = (usage.events.used / usage.events.limit) * 100;
  const websitePercentage = (usage.websites.used / usage.websites.limit) * 100;

  const isNearLimit = eventPercentage >= 80 || websitePercentage >= 80;

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Usage This Month</h3>
        {isNearLimit && (
          <div className="flex items-center text-amber-600">
            <AlertTriangle className="h-5 w-5 mr-1" />
            <span className="text-sm">Near Limit</span>
          </div>
        )}
      </div>

      {/* Events Usage */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Events</span>
          <span className="text-sm text-gray-500">
            {usage.events.used.toLocaleString()} / {usage.events.limit.toLocaleString()}
          </span>
        </div>
        <Progress 
          value={eventPercentage} 
          className={`h-2 ${eventPercentage >= 90 ? 'bg-red-100' : eventPercentage >= 80 ? 'bg-amber-100' : 'bg-gray-200'}`}
        />
        <div className="mt-1 text-xs text-gray-500">
          Resets on {new Date(usage.events.resetDate).toLocaleDateString()}
        </div>
      </div>

      {/* Websites Usage */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Websites</span>
          <span className="text-sm text-gray-500">
            {usage.websites.used} / {usage.websites.limit}
          </span>
        </div>
        <Progress 
          value={websitePercentage} 
          className={`h-2 ${websitePercentage >= 90 ? 'bg-red-100' : websitePercentage >= 80 ? 'bg-amber-100' : 'bg-gray-200'}`}
        />
      </div>

      {/* Upgrade CTA */}
      {isNearLimit && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                You're approaching your limits
              </p>
              <p className="text-sm text-blue-700 mt-1">
                <a href="/pricing" className="underline hover:no-underline">
                  Upgrade your plan
                </a> to continue growing
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
