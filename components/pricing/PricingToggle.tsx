'use client';

import { BillingCycle } from '@/lib/dodo-payments';

interface PricingToggleProps {
  billingCycle: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}

export default function PricingToggle({ billingCycle, onChange }: PricingToggleProps) {
  return (
    <div className="flex items-center justify-center mb-12">
      <div className="bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onChange('monthly')}
          className={`
            px-6 py-2 rounded-md font-medium transition-all duration-200
            ${billingCycle === 'monthly' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          Monthly
        </button>
        <button
          onClick={() => onChange('annual')}
          className={`
            px-6 py-2 rounded-md font-medium transition-all duration-200 relative
            ${billingCycle === 'annual' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
            }
          `}
        >
          Annual
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Save 17%
          </span>
        </button>
      </div>
    </div>
  );
}