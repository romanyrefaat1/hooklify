// ============================================
// PHASE 4, STEP 4: FRONTEND COMPONENTS (120 minutes)
// ============================================

// ============================================
// 1. components/pricing/PricingCard.tsx
// ============================================

'use client';

import { Check, Loader2 } from 'lucide-react';
import { PlanType, BillingCycle, getPlanDetails, getSavingsPercentage } from '@/lib/dodo-payments';

interface PricingCardProps {
  planType: PlanType;
  billingCycle: BillingCycle;
  isCurrentPlan?: boolean;
  onSelect: (planType: PlanType, billingCycle: BillingCycle) => void;
  isLoading?: boolean;
}

export default function PricingCard({
  planType,
  billingCycle,
  isCurrentPlan = false,
  onSelect,
  isLoading = false
}: PricingCardProps) {
  const planDetails = getPlanDetails(planType, billingCycle);
  const savings = getSavingsPercentage(planType);
  const isPopular = planType === 'growth';

  return (
    <div className={`
      relative bg-white rounded-2xl shadow-lg border-2 p-8 
      ${isPopular ? 'border-blue-500 scale-105' : 'border-gray-200'}
      ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}
      transition-all duration-300 hover:shadow-xl
    `}>
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      {/* Current Plan Badge */}
      {isCurrentPlan && (
        <div className="absolute -top-3 -right-3">
          <span className="bg-green-500 text-white px-4 py-1 rounded-full text-xs font-semibold">
            Current Plan
          </span>
        </div>
      )}

      {/* Plan Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {planDetails.name}
        </h3>
        <p className="text-gray-600 mb-4">
          {planDetails.description}
        </p>
        
        {/* Pricing */}
        <div className="mb-4">
          <div className="flex items-baseline justify-center">
            <span className="text-5xl font-bold text-gray-900">
              {planDetails.priceFormatted.split('.')[0]}
            </span>
            <span className="text-2xl font-semibold text-gray-500 ml-1">
              .{planDetails.priceFormatted.split('.')[1]}
            </span>
            <span className="text-gray-500 ml-2">
              /{billingCycle === 'annual' ? 'year' : 'month'}
            </span>
          </div>
          
          {/* Annual Savings */}
          {billingCycle === 'annual' && savings > 0 && (
            <div className="mt-2">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                Save {savings}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4 mb-8">
        {planDetails.features.map((feature, index) => (
          <div key={index} className="flex items-center">
            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={() => onSelect(planType, billingCycle)}
        disabled={isCurrentPlan || isLoading}
        className={`
          w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200
          ${isCurrentPlan 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : isPopular
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Processing...
          </div>
        ) : isCurrentPlan ? (
          'Current Plan'
        ) : planType === 'free' ? (
          'Get Started'
        ) : (
          'Upgrade Now'
        )}
      </button>
    </div>
  );
}
