'use client';

import { useEffect, useState } from 'react';
import { Crown, Zap, Star } from 'lucide-react';

interface CurrentPlan {
  plan_type: string;
  billing_cycle: string;
  subscription_status: string;
}

export default function PlanBadge() {
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan | null>(null);

  useEffect(() => {
    fetchCurrentPlan();
  }, []);

  const fetchCurrentPlan = async () => {
    try {
      const response = await fetch('/api/plans/current');
      if (response.ok) {
        const data = await response.json();
        setCurrentPlan(data);
      }
    } catch (error) {
      console.error('Error fetching current plan:', error);
    }
  };

  if (!currentPlan) return null;

  const getPlanIcon = () => {
    switch (currentPlan.plan_type) {
      case 'pro':
        return <Crown className="h-4 w-4" />;
      case 'growth':
        return <Zap className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  const getPlanColor = () => {
    switch (currentPlan.plan_type) {
      case 'pro':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'growth':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPlanName = () => {
    switch (currentPlan.plan_type) {
      case 'pro':
        return 'Pro';
      case 'growth':
        return 'Growth';
      default:
        return 'Free';
    }
  };

  return (
    <div className={`
      inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border
      ${getPlanColor()}
    `}>
      {getPlanIcon()}
      <span className="ml-1">{getPlanName()}</span>
      {currentPlan.billing_cycle === 'annual' && (
        <span className="ml-1 text-xs opacity-75">(Annual)</span>
      )}
    </div>
  );
}
